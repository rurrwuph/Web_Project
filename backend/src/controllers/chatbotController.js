const Groq = require('groq-sdk');
const db = require('../config/db');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let chatHistory = [];

const SYSTEM_PROMPT = `
You are a smart travel assistant for 'TripSync', a bus ticketing platform in Bangladesh.
Your goal is to help users find trips and navigate the app.

Current Date & Time: ${new Date().toISOString()}

You MUST always reply in valid JSON format:
{
  "response": "Your friendly text reply",
  "action": "navigate_search" | "navigate_route" | null,
  "params": { "origin": "City", "destination": "City", "date": "YYYY-MM-DD" },
  "route": "/profile" | "/login" | "/contact" | null
}

RULES:
1. Slot Filling: If Origin, Destination, or Date is missing, ASK for them.
2. Only set action to "navigate_search" when you have ALL THREE (Origin, Destination, Date).
3. If the user wants to go to profile or login, set action to "navigate_route" and provide the route.
4. If the user says "tomorrow", calculate the date based on the current date provided above.
`;

const assistUser = async (req, res) => {
    console.log("AI Controller hit!");
    const { message } = req.body;

    chatHistory.push({ role: "user", content: message });
    if (chatHistory.length > 15) chatHistory.shift();

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...chatHistory
            ],
            temperature: 0.5,
            response_format: { type: "json_object" }
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content);

        chatHistory.push({ role: "assistant", content: aiResponse.response });

        let tripData = null;
        if (aiResponse.action === "navigate_search") {
            const { origin, destination, date } = aiResponse.params;
            const result = await db.query(
                `SELECT t.*, r.StartPoint, r.EndPoint, b.BusType 
                 FROM TRIP t 
                 JOIN ROUTE r ON t.RouteID = r.RouteID 
                 JOIN BUS b ON t.BusID = b.BusID
                 WHERE r.EndPoint ILIKE $1 AND t.TripDate = $2 LIMIT 3`,
                [`%${destination}%`, date]
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
    chatHistory = [];
    res.json({ message: "Memory cleared" });
};

module.exports = { assistUser, clearHistory };