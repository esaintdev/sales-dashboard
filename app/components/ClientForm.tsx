"use client";

import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';


import { Client } from '../types';

export default function ClientForm({ onClose, initialData }: { onClose?: () => void, initialData?: Client }) {
    const { addClient, updateClient } = useDashboard();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        company: initialData?.company || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (initialData) {
            await updateClient(initialData.id, formData);
        } else {
            await addClient(formData);
        }

        setIsLoading(false);
        setFormData({ name: '', company: '', email: '', phone: '' });
        if (onClose) onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-secondary-text text-sm mb-1">Client Name</label>
                <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary-accent outline-none transition-colors"
                    placeholder="John Doe"
                />
            </div>

            <div>
                <label className="block text-secondary-text text-sm mb-1">Company (Optional)</label>
                <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary-accent outline-none transition-colors"
                    placeholder="Acme Inc."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-secondary-text text-sm mb-1">Email (Optional)</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary-accent outline-none transition-colors"
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label className="block text-secondary-text text-sm mb-1">Phone (Optional)</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary-accent outline-none transition-colors"
                        placeholder="+1 234 567 8900"
                    />
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-lg bg-white/5 text-secondary-text font-bold hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 rounded-lg bg-secondary-accent text-background font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : 'Save Client'}
                </button>
            </div>
        </form>
    );
}
