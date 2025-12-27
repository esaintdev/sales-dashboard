import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { TrendingUp, CreditCard, PieChart, Wallet } from 'lucide-react';

interface StatCardProps {
    title: string;
    amount: number;
    type: 'primary' | 'secondary' | 'neutral' | 'alert';
}

export default function StatCard({ title, amount, type }: StatCardProps) {
    const { formatCurrency } = useDashboard();

    // Icons mapping
    const getIcon = () => {
        if (title.includes('Total Revenue')) return <TrendingUp size={24} className="text-white" />;
        if (title.includes('Website')) return <GlobeIcon />;
        if (title.includes('Design')) return <PaletteIcon />;
        if (title.includes('Collected')) return <Wallet size={24} className="text-white" />;
        return <CreditCard size={24} className="text-white" />;
    };

    // Helper for specific icons since lucide might change names or we want custom style
    const GlobeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
    );
    const PaletteIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
    );

    // Styles based on type
    // Primary matches the "Purple Gradient" hero card in ref
    if (type === 'primary') {
        return (
            <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-900/20 group hover:scale-[1.02] transition-transform duration-300">
                {/* Background decorative blobs */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>

                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-violet-100 text-sm font-medium mb-1">{title}</p>
                        <h3 className="text-3xl font-bold text-white tracking-tight">{formatCurrency(amount)}</h3>

                        <div className="mt-4 flex items-center gap-2">
                            <div className="px-2 py-1 rounded-full bg-white/20 text-xs text-white font-medium flex items-center gap-1">
                                <span>+12%</span> <TrendingUp size={12} />
                            </div>
                            <span className="text-violet-200 text-xs">vs last month</span>
                        </div>
                    </div>
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                        {getIcon()}
                    </div>
                </div>
            </div>
        );
    }

    // Secondary/Other cards: Dark glass style with colorful accents
    let accentColor = 'bg-emerald-500'; // Default Green
    if (type === 'secondary' && title.includes('Website')) accentColor = 'bg-blue-500';
    if (title.includes('Design')) accentColor = 'bg-orange-500'; // Matches orange in ref
    if (type === 'neutral') accentColor = 'bg-cyan-500';

    return (
        <div className="rounded-3xl p-6 bg-[#181825] border border-white/5 shadow-xl hover:border-white/10 transition-colors duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-white/5 ${accentColor.replace('bg-', 'text-')} group-hover:bg-white/10 transition-colors`}>
                    {getIcon()}
                </div>
                {/* Sparkline placeholder or percentage */}
                <span className="text-xs font-medium text-secondary-text bg-white/5 px-2 py-1 rounded-lg">
                    30 Days
                </span>
            </div>

            <div>
                <p className="text-secondary-text text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">{formatCurrency(amount)}</h3>

                {/* Progress bar visual (Reference style) */}
                <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                    <div className={`h-full ${accentColor} rounded-full w-[65%]`}></div>
                </div>
            </div>
        </div>
    );
}
