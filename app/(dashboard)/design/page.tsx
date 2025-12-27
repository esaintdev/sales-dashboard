"use client";

import React from 'react';
import JobList from '../../components/JobList';
import JobForm from '../../components/JobForm';

export default function DesignPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Graphic Design Projects</h1>
                <p className="text-secondary-text">Manage your creative design portfolio and jobs.</p>
            </header>

            <div className="bg-[#131320] rounded-3xl p-6 border border-white/5 shadow-xl">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Add New Project</h2>
                    <JobForm />
                </div>

                <div className="h-px bg-white/5 my-8"></div>

                <JobList filterType="graphic_design" />
            </div>
        </div>
    );
}
