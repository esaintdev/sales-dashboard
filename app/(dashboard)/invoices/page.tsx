"use client";

import React, { useState } from 'react';
import { useDashboard } from '@/app/context/DashboardContext';
import { Search, Filter, Receipt, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Job } from '@/app/types';
import JobForm from '@/app/components/JobForm';

export default function InvoicesPage() {
    const { jobs, loading, formatCurrency } = useDashboard();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'completed'>('all');

    const filteredJobs = jobs.filter(job => {
        const matchesSearch =
            job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.clients?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.clients?.company?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' ? true : job.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Paid</span>;
            case 'pending':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-primary-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <JobForm
                title="Create New Invoice"
                buttonLabel="+ Create New Invoice"
            />

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Invoices</h1>
                <p className="text-secondary-text">Manage and track client invoices and payments.</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#131320] border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                            <Receipt size={24} />
                        </div>
                        <span className="text-xs font-medium text-secondary-text bg-white/5 px-2 py-1 rounded-lg">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{jobs.length}</div>
                    <div className="text-sm text-secondary-text">Total Invoices</div>
                </div>

                <div className="bg-[#131320] border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                            <CheckCircle size={24} />
                        </div>
                        <span className="text-xs font-medium text-secondary-text bg-white/5 px-2 py-1 rounded-lg">Paid</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                        {jobs.filter(j => j.status === 'paid' || j.amount_paid >= j.price).length}
                    </div>
                    <div className="text-sm text-secondary-text">Fully Paid</div>
                </div>

                <div className="bg-[#131320] border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                            <Clock size={24} />
                        </div>
                        <span className="text-xs font-medium text-secondary-text bg-white/5 px-2 py-1 rounded-lg">Pending</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                        {jobs.filter(j => j.status === 'pending').length}
                    </div>
                    <div className="text-sm text-secondary-text">Pending Payment</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-[#131320] rounded-3xl border border-white/5 shadow-xl overflow-hidden">
                {/* Filters */}
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-text" size={20} />
                        <input
                            type="text"
                            placeholder="Search client, company or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0b0b15] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-secondary-text focus:outline-none focus:border-primary-accent/50 focus:ring-1 focus:ring-primary-accent/50 transition-all"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {['all', 'paid', 'pending'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status as any)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize whitespace-nowrap
                                    ${statusFilter === status
                                        ? 'bg-primary-accent text-white shadow-lg shadow-primary-accent/20'
                                        : 'bg-white/5 text-secondary-text hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-text uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-text uppercase tracking-wider">Project / Description</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-text uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-secondary-text uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-secondary-text uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-secondary-text uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredJobs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-secondary-text">
                                        No invoices found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{job.clients?.name}</span>
                                                <span className="text-xs text-secondary-text">{job.clients?.company || 'Individual'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-secondary-text truncate max-w-xs">{job.description}</div>
                                            <div className="text-xs text-secondary-text/60 mt-0.5 capitalize">{job.type.replace('_', ' ')} Project</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-text">
                                            {new Date(job.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-white font-medium">{formatCurrency(job.price)}</span>
                                                {job.amount_paid > 0 && job.amount_paid < job.price && (
                                                    <span className="text-xs text-emerald-400">Paid: {formatCurrency(job.amount_paid)}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {getStatusBadge(job.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <Link
                                                href={`/invoices/${job.id}`}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-secondary-text hover:text-white transition-all text-sm font-medium border border-white/5 hover:border-white/20"
                                            >
                                                <ExternalLink size={14} /> View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
