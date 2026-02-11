import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        from: '',
        to: '',
        date: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?from=${searchData.from}&to=${searchData.to}&date=${searchData.date}`);
    };

    return (
        <div className="relative">
            {/* Hero Section */}
            {/* Hero Section */}
            <div className="pt-32 pb-48 px-4 text-center">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute top-[20%] left-[30%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/50 border border-indigo-100 text-indigo-600 font-medium text-sm shadow-sm backdrop-blur-sm">
                        ✨ Experience the future of travel
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-slate-900 leading-tight">
                        Seamless Journeys, <br />
                        <span className="text-gradient">Sync Your Trip.</span>
                    </h1>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Book your bus tickets with ease and comfort. Explore thousands of routes across the country with our premium fleet.
                    </p>
                </div>
            </div>

            {/* Search Container */}
            <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
                <form
                    onSubmit={handleSearch}
                    className="glass-panel p-6 md:p-8 flex flex-col md:flex-row gap-6 items-end rounded-3xl"
                >
                    <div className="flex-grow w-full space-y-2">
                        <label className="text-sm font-bold text-slate-700 block flex items-center gap-2 mb-2">
                            <MapPin size={16} className="text-indigo-500" /> From
                        </label>
                        <input
                            type="text"
                            placeholder="Source City"
                            className="w-full px-4 py-4 rounded-2xl bg-white/50 border border-white/40 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-800 placeholder:text-slate-400 shadow-sm"
                            value={searchData.from}
                            onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex-grow w-full space-y-2">
                        <label className="text-sm font-bold text-slate-700 block flex items-center gap-2 mb-2">
                            <MapPin size={16} className="text-cyan-500" /> To
                        </label>
                        <input
                            type="text"
                            placeholder="Destination City"
                            className="w-full px-4 py-4 rounded-2xl bg-white/50 border border-white/40 focus:bg-white focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 outline-none transition-all text-slate-800 placeholder:text-slate-400 shadow-sm"
                            value={searchData.to}
                            onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                            required
                        />
                    </div>

                    <div className="w-full md:w-56 space-y-2">
                        <label className="text-sm font-bold text-slate-700 block flex items-center gap-2 mb-2">
                            <Calendar size={16} className="text-violet-500" /> Date
                        </label>
                        <input
                            type="date"
                            className="w-full px-4 py-4 rounded-2xl bg-white/50 border border-white/40 focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all text-slate-800 shadow-sm"
                            value={searchData.date}
                            onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full md:w-auto bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0 text-lg"
                    >
                        <Search size={22} />
                        Search Buses
                    </button>
                </form>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 py-32">
                <h2 className="text-3xl font-black text-slate-900 text-center mb-16">
                    Why Choose <span className="text-gradient">TripSync?</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="glass-card p-10 rounded-3xl">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Users size={36} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-slate-900">Trusted by Millions</h3>
                        <p className="text-slate-600 leading-relaxed">
                            We've helped thousands of travelers reach their destinations safely and on time.
                        </p>
                    </div>

                    <div className="glass-card p-10 rounded-3xl">
                        <div className="w-20 h-20 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Search size={36} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-slate-900">Real-time Tracking</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Stay updated with live bus locations and expected arrival times.
                        </p>
                    </div>

                    <div className="glass-card p-10 rounded-3xl">
                        <div className="w-20 h-20 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <MapPin size={36} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-slate-900">Widest Network</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Connectivity to even the remotest parts of the country with premium operators.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
