"use client";

import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

export default function SettingsPage() {
    const { user, currency, setCurrency } = useDashboard();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-secondary-text">Manage your account and dashboard preferences.</p>
            </header>

            <div className="space-y-6">
                {/* Account Info */}
                <div className="bg-[#131320] rounded-3xl p-8 border border-white/5 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6">Account Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-secondary-text mb-2">Email Address</label>
                            <div className="p-3 bg-white/5 rounded-xl text-white border border-white/10">
                                {user?.email || 'Loading...'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-secondary-text mb-2">Role</label>
                            <div className="p-3 bg-white/5 rounded-xl text-white border border-white/10">
                                Administrator
                            </div>
                        </div>
                    </div>
                </div>

                {/* Currency Settings */}
                <div className="bg-[#131320] rounded-3xl p-8 border border-white/5 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Currency & Localization</h2>
                        <span className="text-xs bg-primary-accent/10 text-primary-accent px-2 py-1 rounded-full">Pro</span>
                    </div>
                    <p className="text-secondary-text mb-4">Select your preferred display currency.</p>

                    <div className="flex gap-4">
                        {(['NGN', 'USD', 'GBP'] as const).map((curr) => (
                            <button
                                key={curr}
                                onClick={() => setCurrency(curr)}
                                className={`px-6 py-2 rounded-xl font-bold transition-all ${currency === curr
                                    ? 'bg-primary-accent text-white shadow-lg shadow-primary-accent/20'
                                    : 'bg-white/5 text-secondary-text hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {curr}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
