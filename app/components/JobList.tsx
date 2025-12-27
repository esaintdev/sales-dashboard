"use client";

import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { JobType, JobStatus, Job } from '../types';
import { Check, DollarSign, Trash2 } from 'lucide-react';

export default function JobList({ filterType }: { filterType?: JobType }) {
    const { jobs, deleteJob, updateJobStatus, loading, formatCurrency, currency } = useDashboard();
    const [editingPayment, setEditingPayment] = useState<string | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');

    const filteredJobs = filterType
        ? jobs.filter(job => job.type === filterType)
        : jobs;

    const handleUpdatePayment = async (job: Job, newAmount: string) => {
        const amount = parseFloat(newAmount);
        if (isNaN(amount)) return;

        let newStatus: JobStatus = job.status;
        if (amount >= job.price) {
            newStatus = 'paid';
        } else if (amount > 0) {
            // If part paid, we keep as pending or could introduce 'partially_paid' if schema supported, 
            // but user request said: "Track payment status, pending, part payment, completed"
            // Schema currently has pending/completed/paid. 
            // Logic: If amount_paid > 0 but < price, it's pending (part payment).
            // If user explicitly marks completed, that's done via separate action?
            // For simplicity, let's auto-detect: if full paid -> paid. Else keep current status.
            if (job.status === 'completed' && amount < job.price) newStatus = 'completed';
            else newStatus = 'pending';
        }

        await updateJobStatus(job.id, newStatus, amount);
        setEditingPayment(null);
        setPaymentAmount('');
    };

    if (loading) {
        return <div className="text-secondary-text text-center py-8">Loading projects...</div>;
    }

    if (filteredJobs.length === 0) {
        return (
            <div className="text-center py-12 text-secondary-text italic border border-dashed border-secondary-text/20 rounded-xl">
                No active projects found. Start by adding one!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {filteredJobs.map((job) => (
                <div key={job.id} className="group bg-white/5 border border-white/5 rounded-xl p-5 hover:border-primary-accent/50 transition-all hover:bg-white/[0.07]">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-bold text-primary-text">
                                    {job.clients?.name || 'Unknown Client'}
                                </h4>
                                {job.clients?.company && (
                                    <span className="text-xs text-secondary-text bg-white/10 px-2 py-0.5 rounded">
                                        {job.clients.company}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2 mt-2">
                                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${job.type === 'website'
                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                    }`}>
                                    {job.type === 'website' ? 'Web Dev' : 'Graphic Design'}
                                </span>
                                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${job.status === 'paid'
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                    : job.status === 'completed'
                                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                    }`}>
                                    {job.status}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-white mb-1">
                                {formatCurrency(job.price)}
                            </p>
                            <span className="text-xs text-secondary-text block">
                                Paid: {formatCurrency(job.amount_paid || 0)}
                            </span>
                        </div>
                    </div>

                    <p className="text-secondary-text text-sm bg-black/20 p-3 rounded-lg mb-4">
                        {job.description}
                    </p>

                    <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                        {editingPayment === job.id ? (
                            <div className="flex bg-black/30 rounded p-1">
                                <span className="text-white text-sm px-2 py-1">{currency === 'NGN' ? '₦' : currency === 'GBP' ? '£' : '$'}</span>
                                <input
                                    type="number"
                                    autoFocus
                                    className="bg-transparent border-none outline-none text-white text-sm w-24"
                                    placeholder="Amount"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                />
                                <button
                                    onClick={() => handleUpdatePayment(job, paymentAmount)}
                                    className="text-green-400 hover:text-green-300 px-2"
                                >
                                    <Check size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditingPayment(job.id);
                                        setPaymentAmount(job.amount_paid?.toString() || '');
                                    }}
                                    className="flex items-center gap-1 text-xs text-secondary-accent hover:text-white px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors"
                                >
                                    <DollarSign size={14} />
                                    Update Payment
                                </button>
                                {job.status !== 'completed' && job.status !== 'paid' && (
                                    <button
                                        onClick={() => updateJobStatus(job.id, 'completed')}
                                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                                    >
                                        <Check size={14} />
                                        Mark Done
                                    </button>
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => deleteJob(job.id)}
                            className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded hover:bg-red-900/20 transition-colors flex items-center gap-1"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
