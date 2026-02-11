import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen mesh-gradient-light flex flex-col font-sans text-slate-900">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="py-8 mt-auto backdrop-blur-sm border-t border-white/20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-500 text-sm">© 2026 TripSync Bus Booking. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
