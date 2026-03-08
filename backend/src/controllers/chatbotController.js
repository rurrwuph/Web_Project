const Groq = require('groq-sdk');
const db = require('../config/db');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Using an object to store history per user (In a real app, use Redis or a DB)
const userHistories = {};

const getSystemPrompt = () => `
You are a smart travel assistant for 'TripSync', a bus ticketing platform in Bangladesh.
Your goal is to help users find trips and navigate the app.

Current Date & Time: ${new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}

LANGUAGE RULES:
1. Detect the user's language. If they speak in Bangla, respond in Bangla. If English, respond in English.
2. Regardless of the conversation language, the JSON values for 'origin', 'destination', and 'action' MUST ALWAYS BE IN ENGLISH.
   - Example: User says "চট্টগ্রাম যাবো", you set "params": { "destination": "Chittagong" }.
   - Always map Bangla city names to their English equivalents (e.g., ঢাকা -> Dhaka, সিলেট -> Sylhet).

You MUST always reply in valid JSON format:
{
  "response": "Your friendly text reply",
  "action": "navigate_search" | "navigate_route" | "general_query" | null,
  "params": { "origin": "City", "destination": "City", "date": "YYYY-MM-DD" },
  "route": "/profile" | "/login" | "/contact" | "/" | null
}

RULES:
1. Slot Filling: If Origin, Destination, or Date is missing, ASK for them in the detected language.
2. Date Logic: If user says "আগামীকাল" (tomorrow), calculate the date accurately in YYYY-MM-DD relative to local time.
3. Only trigger "navigate_search" when Origin, Destination, and Date are all present in the conversation.
4. If they ask about refunds or login, use "navigate_route" with the appropriate English route name.
`;

const assistUser = async (req, res) => {
    const { message } = req.body;
    const userId = req.user.id;

    if (!userHistories[userId]) userHistories[userId] = [];
    const history = userHistories[userId];

    history.push({ role: "user", content: message });
    if (history.length > 15) history.shift();

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: getSystemPrompt() },
                ...history
            ],
            temperature: 0.5,
            response_format: { type: "json_object" }
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content);

        history.push({ role: "assistant", content: aiResponse.response });

        let tripData = null;
        if (aiResponse.action === "navigate_search") {
            const { origin, destination, date } = aiResponse.params;
            const result = await db.query(
                'SELECT * FROM chatbot_search_trips($1, $2, $3)',
                [origin, destination, date]
            );
            tripData = result.rows;
        }


        res.status(200).json({
            reply: aiResponse.response,
            action: aiResponse.action,
            params: aiResponse.params,
            route: aiResponse.route,
            data: tripData
        });

    } catch (err) {
        console.error({ error: "AI Assistant is currently offline" });
        res.status(500).json({ reply: "I'm having trouble thinking. Try again later." });
    }
};

const clearHistory = (req, res) => {
    const userId = req.user.id;
    userHistories[userId] = [];
    res.json({ message: "Memory cleared" });
};

module.exports = { assistUser, clearHistory };