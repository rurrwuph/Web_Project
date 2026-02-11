import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="glass-panel sticky top-4 mx-4 rounded-2xl z-50 mt-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tight">
                            <div className="bg-gradient-to-tr from-indigo-600 to-cyan-400 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/30">
                                <Bus size={24} />
                            </div>
                            <span className="text-gradient">TripSync</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/" className="px-4 py-2 rounded-full text-slate-600 font-medium hover:bg-white/50 hover:text-indigo-600 transition-all">Home</Link>
                        {user ? (
                            <>
                                {user.role === 'operator' && (
                                    <Link to="/operator" className="px-4 py-2 rounded-full text-slate-600 font-medium hover:bg-white/50 hover:text-indigo-600 transition-all">Operator Dashboard</Link>
                                )}
                                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
                                    <span className="text-sm font-semibold text-slate-700 bg-white/50 px-3 py-1 rounded-full border border-white/40">{user.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="px-4 py-2 rounded-full text-slate-600 font-medium hover:bg-white/50 hover:text-indigo-600 transition-all">Login</Link>
                                <Link to="/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-slate-800 hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
