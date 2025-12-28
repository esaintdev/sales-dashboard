"use client";

import React from 'react';

export default function ClientsPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary-text mb-2">
                    Manage Clients
                </h1>
                <p className="text-secondary-text">View and manage your client list.</p>
            </header>

            <div className="bg-[#131320] border border-white/5 rounded-3xl p-8 shadow-xl text-center py-20">
                <p className="text-secondary-text text-lg">Client management features coming soon.</p>
            </div>
        </div>
    );
}
