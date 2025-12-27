"use client";

import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

export default function ClientForm({ onClose }: { onClose?: () => void }) {
    const { addClient } = useDashboard();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await addClient(formData);
        setIsLoading(false);
        setFormData({ name: '', company: '', email: '', phone: '' });
        if (onClose) onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-secondary-text text-sm mb-1">Client Name *</label>
                <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/50 border border-secondary-text/30 rounded p-2 text-white focus:border-primary-accent outline-none"
                    placeholder="e.g. John Doe"
                />
            </div>
            <div>
                <label className="block text-secondary-text text-sm mb-1">Company</label>
                <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-black/50 border border-secondary-text/30 rounded p-2 text-white focus:border-primary-accent outline-none"
                    placeholder="e.g. Tech Corp"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-secondary-text text-sm mb-1">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-black/50 border border-secondary-text/30 rounded p-2 text-white focus:border-primary-accent outline-none"
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label className="block text-secondary-text text-sm mb-1">Phone</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black/50 border border-secondary-text/30 rounded p-2 text-white focus:border-primary-accent outline-none"
                        placeholder="+234..."
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded bg-secondary-accent text-background font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
                {isLoading ? 'Saving...' : 'Save Client'}
            </button>
        </form>
    );
}
