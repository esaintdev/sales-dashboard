"use client";

import React, { useState } from 'react';
import { useDashboard } from '@/app/context/DashboardContext';
import { Search, Filter, CreditCard, ArrowUpRight, Calendar } from 'lucide-react';

export default function TransactionsPage() {
    const { payments, loading, formatCurrency } = useDashboard();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPayments = payments.filter(payment => {
        const searchLower = searchTerm.toLowerCase();
        return (
            payment.jobs?.description.toLowerCase().includes(searchLower) ||
            payment.jobs?.clients?.name.toLowerCase().includes(searchLower) ||
            String(payment.amount).includes(searchLower)
        );
    });

    const totalRevenue = payments.reduce((acc, p) => acc + Number(p.amount), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-primary-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary-text">
                    Transactions
                </h1>
                <p className="text-secondary-text mt-2">
                    History of all payments received.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                            <ArrowUpRight className="text-emerald-400" size={24} />
                        </div>
                        <span className="text-secondary-text font-medium">Total Revenue</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">{formatCurrency(totalRevenue)}</h3>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <CreditCard className="text-blue-400" size={24} />
                        </div>
                        <span className="text-secondary-text font-medium">Total Transactions</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">{payments.length}</h3>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-text" size={20} />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-secondary-text focus:outline-none focus:border-primary-accent transition-colors"
                    />
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-text uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-text uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-text uppercase tracking-wider">Project</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-text uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-secondary-text uppercase tracking-wider">Method</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-secondary-text">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            {new Date(payment.payment_date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-white">{payment.jobs?.clients?.name || 'Unknown'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-secondary-text">
                                        {payment.jobs?.description || 'Unknown Job'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-bold text-emerald-400">
                                            +{formatCurrency(payment.amount)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-secondary-text text-sm">
                                        {payment.method || 'Manual'}
                                    </td>
                                </tr>
                            ))}
                            {filteredPayments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-secondary-text">
                                        No transactions found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
