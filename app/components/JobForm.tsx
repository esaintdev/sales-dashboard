"use client";

import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { JobType, JobStatus } from '../types';
import ClientForm from './ClientForm';

import { X } from 'lucide-react';

interface JobFormProps {
    title?: string;
    buttonLabel?: string;
    defaultStatus?: JobStatus;
}

export default function JobForm({ title = "Create New Project", buttonLabel = "+ Add New Project", defaultStatus = "pending" }: JobFormProps) {
    const { addJob, clients, loading, currency } = useDashboard();
    const [isOpen, setIsOpen] = useState(false);
    const [showClientForm, setShowClientForm] = useState(false);

    const [formData, setFormData] = useState({
        client_id: '',
        type: 'website' as JobType,
        description: '',
        price: '',
        status: defaultStatus,
        due_date: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.client_id) {
            alert("Please select a client");
            return;
        }

        setIsSubmitting(true);
        await addJob({
            client_id: formData.client_id,
            type: formData.type,
            description: formData.description,
            price: parseFloat(formData.price) || 0,
            amount_paid: 0, // Default to 0 initially
            status: formData.status,
            due_date: formData.due_date ? new Date(formData.due_date).toISOString() : undefined,
        });

        setFormData({
            client_id: '',
            type: 'website',
            description: '',
            price: '',
            status: 'pending',
            due_date: '',
        });
        setIsSubmitting(false);
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full py-4 rounded-xl bg-primary-accent text-background font-bold shadow-lg shadow-primary-accent/20 hover:scale-[1.02] transition-transform"
            >
                {buttonLabel}
            </button>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-primary-text">{title}</h3>
                <button onClick={() => setIsOpen(false)} className="text-secondary-text hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {showClientForm ? (
                <div className="mb-6 border-b border-white/10 pb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-secondary-accent">New Client Details</h4>
                        <button onClick={() => setShowClientForm(false)} className="text-xs text-secondary-text hover:text-white">Cancel</button>
                    </div>
                    <ClientForm onClose={() => setShowClientForm(false)} />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="block text-secondary-text text-sm">Client</label>
                            <button
                                type="button"
                                onClick={() => setShowClientForm(true)}
                                className="text-xs text-secondary-accent hover:text-white"
                            >
                                + New Client
                            </button>
                        </div>
                        <select
                            required
                            value={formData.client_id}
                            onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary-accent outline-none appearance-none transition-colors"
                        >
                            <option value="" className="bg-[#131320]">Select a Client...</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id} className="bg-[#131320]">
                                    {client.name} {client.company ? `(${client.company})` : ''}
                                </option>
                            ))}
                        </select>
                        {clients.length === 0 && !loading && (
                            <p className="text-xs text-secondary-text mt-1">No clients found. Create one first.</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-secondary-text text-sm mb-1">Project Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as JobType })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary-accent outline-none transition-colors"
                            >
                                <option value="website" className="bg-[#131320]">Website Development</option>
                                <option value="graphic_design" className="bg-[#131320]">Graphic Design</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-secondary-text text-sm mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary-accent outline-none transition-colors"
                            >
                                <option value="pending" className="bg-[#131320]">Pending</option>
                                <option value="completed" className="bg-[#131320]">Completed</option>
                                <option value="paid" className="bg-[#131320]">Paid</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-secondary-text text-sm mb-1">Price ({currency === 'NGN' ? '₦' : currency === 'GBP' ? '£' : '$'})</label>
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary-accent outline-none transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-secondary-text text-sm mb-1">Due Date (Optional)</label>
                            <input
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary-accent outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-secondary-text text-sm mb-1">Description / Notes</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary-accent outline-none min-h-[100px] transition-colors"
                            placeholder="Project details..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-lg bg-primary-accent text-background font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isSubmitting ? 'Creating...' : title}
                    </button>
                </form>
            )}
        </div>
    );
}
