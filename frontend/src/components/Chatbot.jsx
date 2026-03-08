import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, RefreshCw, ArrowRight, Bus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Chatbot = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([
        { role: 'assistant', content: 'Hello! I am your TripSync assistant. How can I help you today?' }
    ]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    const user = JSON.parse(localStorage.getItem('user'));

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || loading) return;

        const userMessage = { role: 'user', content: message };
        setChat(prev => [...prev, userMessage]);
        setMessage('');
        setLoading(true);

        try {
            const res = await api.post('/ai/assist', { message });
            let botReply = { role: 'assistant', content: res.data.reply };

            // If action is navigate_route, handle it
            if (res.data.action === 'navigate_route' && res.data.route) {
                setTimeout(() => {
                    navigate(res.data.route);
                    setIsOpen(false);
                }, 2000);
            }

            // If we have trip data (from navigate_search)
            if (res.data.action === 'navigate_search' && res.data.data) {
                botReply.trips = res.data.data;
            }

            setChat(prev => [...prev, botReply]);
        } catch (err) {
            setChat(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting. Please try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = async () => {
        try {
            await api.delete('/ai/history');
            setChat([{ role: 'assistant', content: 'Memory cleared! How can I help you now?' }]);
        } catch (err) {
            console.error('Failed to clear history');
        }
    };

    if (!user || user.role !== 'customer') return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* Bubble */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 ${isOpen ? 'bg-rose-500 rotate-90' : 'bg-indigo-600'
                    } text-white`}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
                    {/* Header */}
                    <div className="bg-indigo-600 p-4 text-white flex justify-between items-center bg-gradient-to-r from-indigo-600 to-violet-600">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-sm">TripSync AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Active Now</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={clearChat} title="Clear Context" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <RefreshCw size={18} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {chat.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                                <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white shadow-sm text-gray-400'
                                        }`}>
                                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                                        }`}>
                                        {msg.content}

                                        {/* Render Trips if available */}
                                        {msg.trips && msg.trips.length > 0 && (
                                            <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                                                <p className="text-[10px] font-black uppercase text-indigo-500 mb-2">Available Trips:</p>
                                                {msg.trips.map(trip => (
                                                    <div key={trip.tripid} className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 hover:border-indigo-200 transition-all cursor-pointer group"
                                                        onClick={() => {
                                                            navigate(`/booking/${trip.tripid}`);
                                                            setIsOpen(false);
                                                        }}>
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="font-black text-xs text-gray-900">{trip.startpoint} → {trip.endpoint}</span>
                                                            <ArrowRight size={10} className="text-gray-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                                                            <Bus size={10} /> {trip.bustype} | {trip.departuretime.slice(0, 5)}
                                                        </div>
                                                        <div className="mt-1 font-black text-indigo-600 text-xs">৳{trip.basefare}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start animate-pulse">
                                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-indigo-600" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Assistant is thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 p-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || loading}
                            className="w-11 h-11 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
