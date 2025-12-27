"use client";

import React, { useRef, useState } from 'react';
import { useDashboard } from '@/app/context/DashboardContext';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Download, Mail, X, CreditCard } from 'lucide-react';

export default function InvoiceDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { jobs, payments, loading, formatCurrency, addPayment, updateJobStatus, currency } = useDashboard();

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');

    // Find the specific job
    const job = jobs.find(j => j.id === id);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0b0b15]">
                <div className="w-8 h-8 border-4 border-primary-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#0b0b15] text-white">
                <h2 className="text-2xl font-bold mb-4">Invoice Not Found</h2>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft size={20} /> Go Back
                </button>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    const handleRecordPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!job) return;

        const amountToAdd = parseFloat(paymentAmount);
        if (isNaN(amountToAdd) || amountToAdd <= 0) return;

        await addPayment(job.id, amountToAdd, 'Manual Payment');

        setIsPaymentModalOpen(false);
        setPaymentAmount('');
        router.refresh();
    };

    const handleEmail = () => {
        if (!job) return;
        const subject = `Invoice #${job.id.slice(0, 8).toUpperCase()} from Esaint Mjay`;
        const body = `Dear ${job.clients?.name},\n\nPlease find your invoice attached for the ${job.type.replace('_', ' ')} project.\n\nAmount Due: ${formatCurrency(job.price - job.amount_paid)}\n\nThank you,\nEsaint Mjay`;
        window.location.href = `mailto:${job.clients?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="min-h-screen bg-[#0b0b15] text-white p-8">
            {/* Toolbar (Hidden when printing) */}
            <div className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-secondary-text hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Invoices
                </button>

                <div className="flex items-center gap-3">
                    {job.status !== 'paid' && (
                        <button
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all font-medium"
                        >
                            <CreditCard size={18} /> Record Payment
                        </button>
                    )}
                    <button
                        onClick={handleEmail}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-all font-medium"
                    >
                        <Mail size={18} /> Send to Client
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-accent text-white rounded-xl shadow-lg shadow-primary-accent/20 hover:bg-primary-accent/90 transition-all font-medium"
                    >
                        <Printer size={18} /> Print Invoice
                    </button>
                </div>
            </div>

            {/* Invoice Paper */}
            <div className="max-w-4xl mx-auto bg-[#131320] text-white rounded-3xl shadow-2xl overflow-hidden border border-white/5 print:bg-white print:text-black print:shadow-none print:w-full print:max-w-none print:rounded-none print:border-none">
                {/* Header */}
                <div className="p-8 md:p-12 border-b border-white/5 print:border-slate-100 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary-text tracking-tight print:text-black print:bg-none">INVOICE</h1>
                        <p className="text-secondary-text mt-1 print:text-slate-500">#{job.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-white print:text-black">Esaint Mjay</h2>
                        {/* <p className="text-sm text-secondary-text mt-1 print:text-slate-500"></p> */}
                        <p className="text-sm text-secondary-text print:text-slate-500">Lagos, Nigeria</p>
                        <p className="text-sm text-secondary-text print:text-slate-500">esaint.designer@gmail.com</p>
                    </div>
                </div>

                {/* Client & Date Info */}
                <div className="p-8 md:p-12 grid grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-sm font-bold text-secondary-text uppercase tracking-wider mb-2 print:text-slate-400">Billed To</h3>
                        <p className="text-lg font-bold text-white print:text-black">{job.clients?.name}</p>
                        {job.clients?.company && <p className="text-secondary-text font-medium print:text-slate-600">{job.clients.company}</p>}
                        {job.clients?.email && <p className="text-secondary-text/80 print:text-slate-500">{job.clients.email}</p>}
                        {job.clients?.phone && <p className="text-secondary-text/80 print:text-slate-500">{job.clients.phone}</p>}
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-white/5 print:border-slate-100 pb-2">
                            <span className="text-secondary-text font-medium print:text-slate-500">Invoice Date</span>
                            <span className="text-white font-semibold print:text-black">{new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 print:border-slate-100 pb-2">
                            <span className="text-secondary-text font-medium print:text-slate-500">Due Date</span>
                            <span className="text-white font-semibold print:text-black">
                                {job.due_date ? new Date(job.due_date).toLocaleDateString() : 'On Compl.'}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 print:border-slate-100 pb-2">
                            <span className="text-secondary-text font-medium print:text-slate-500">Status</span>
                            <div className="relative group print:hidden">
                                <select
                                    value={job.status}
                                    onChange={async (e) => {
                                        const newStatus = e.target.value as any;
                                        await updateJobStatus(job.id, newStatus);
                                        router.refresh();
                                    }}
                                    className={`appearance-none bg-transparent font-bold capitalize cursor-pointer focus:outline-none pr-6
                                        ${job.status === 'paid' ? 'text-emerald-400' :
                                            job.status === 'pending' ? 'text-amber-400' : 'text-white'}`}
                                >
                                    <option value="pending" className="bg-[#131320] text-amber-400">Pending</option>
                                    <option value="completed" className="bg-[#131320] text-white">Completed</option>
                                    <option value="paid" className="bg-[#131320] text-emerald-400">Paid</option>
                                </select>
                                {/* Custom arrow to indicate interactivity */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-secondary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                            {/* Print-only static status */}
                            <span className={`hidden print:inline font-bold capitalize 
                                ${job.status === 'paid' ? 'text-emerald-600' :
                                    job.status === 'pending' ? 'text-amber-600' : 'text-black'}`}>
                                {job.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="px-8 md:px-12 py-4">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white/5 print:bg-slate-50">
                                <th className="px-4 py-3 text-left text-xs font-bold text-secondary-text uppercase tracking-wider rounded-l-lg print:text-slate-500">Description</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-secondary-text uppercase tracking-wider print:text-slate-500">Type</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-secondary-text uppercase tracking-wider rounded-r-lg print:text-slate-500">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 print:divide-slate-100">
                            <tr>
                                <td className="px-4 py-6">
                                    <p className="font-bold text-white print:text-black">{job.description}</p>
                                    <p className="text-sm text-secondary-text mt-1 print:text-slate-500">Professional services rendered.</p>
                                </td>
                                <td className="px-4 py-6 text-right text-secondary-text capitalize print:text-slate-600">
                                    {job.type.replace('_', ' ')}
                                </td>
                                <td className="px-4 py-6 text-right font-bold text-white print:text-black">
                                    {formatCurrency(job.price)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="p-8 md:p-12 flex justify-end">
                    <div className="w-full md:w-1/2 space-y-4">
                        <div className="flex justify-between text-secondary-text print:text-slate-500">
                            <span>Subtotal</span>
                            <span>{formatCurrency(job.price)}</span>
                        </div>
                        <div className="flex justify-between text-secondary-text print:text-slate-500">
                            <span>Tax (0%)</span>
                            <span>{formatCurrency(0)}</span>
                        </div>
                        <div className="border-t border-white/10 print:border-slate-200 pt-4 flex justify-between items-center">
                            <span className="text-xl font-bold text-white print:text-black">Total</span>
                            <span className="text-xl font-bold text-white print:text-black">{formatCurrency(job.price)}</span>
                        </div>

                        {job.amount_paid > 0 && (
                            <div className="bg-emerald-500/10 rounded-lg p-4 flex justify-between items-center mt-4 border border-emerald-500/20 print:bg-emerald-50 print:border-emerald-100">
                                <span className="text-emerald-400 font-medium print:text-emerald-700">Amount Paid</span>
                                <span className="text-emerald-400 font-bold print:text-emerald-700">{formatCurrency(job.amount_paid)}</span>
                            </div>
                        )}

                        {job.price - job.amount_paid > 0 && (
                            <div className="bg-white/5 rounded-lg p-4 flex justify-between items-center mt-2 print:bg-slate-50">
                                <span className="text-secondary-text font-medium print:text-slate-700">Balance Due</span>
                                <span className="text-white font-extrabold print:text-slate-900">{formatCurrency(job.price - job.amount_paid)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment History */}
                {payments.filter(p => p.job_id === job.id).length > 0 && (
                    <div className="border-t border-white/5 bg-white/5 p-8 md:p-12 print:hidden">
                        <h4 className="font-bold text-white mb-4">Payment History</h4>
                        <div className="space-y-3">
                            {payments.filter(p => p.job_id === job.id).map(payment => (
                                <div key={payment.id} className="flex justify-between text-sm">
                                    <span className="text-secondary-text">{new Date(payment.payment_date).toLocaleDateString()}</span>
                                    <span className="text-white font-medium">{formatCurrency(payment.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="bg-white/5 p-8 md:p-12 border-t border-white/5 print:bg-slate-50 print:border-slate-100">
                    <h4 className="font-bold text-white mb-2 print:text-black">Payment Info</h4>
                    <p className="text-sm text-secondary-text mb-1 print:text-slate-500">Bank Name: GT Bank</p>
                    <p className="text-sm text-secondary-text mb-1 print:text-slate-500">Account Name: Etiusen Michael</p>
                    <p className="text-sm text-secondary-text print:text-slate-500">Account Number: 0751344205</p>

                    <div className="mt-8 pt-8 border-t border-white/5 print:border-slate-200 text-center text-xs text-secondary-text/60 print:text-slate-400">
                        <p>Thank you for your business!</p>
                    </div>
                </div>
            </div>
            {/* Payment Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#131320] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Record Payment</h3>
                            <button
                                onClick={() => setIsPaymentModalOpen(false)}
                                className="text-secondary-text hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleRecordPayment} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary-text mb-2">
                                    Current Balance: <span className="text-white font-bold">{formatCurrency(job.price - (job.amount_paid || 0))}</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-text font-bold">
                                        {currency === 'NGN' ? '₦' : currency === 'GBP' ? '£' : '$'}
                                    </span>
                                    <input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        placeholder="Enter amount to add..."
                                        className="w-full bg-[#0b0b15] border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white placeholder-secondary-text/50 focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent transition-all text-lg font-medium"
                                        autoFocus
                                    />
                                </div>
                                <p className="text-xs text-secondary-text mt-2">
                                    This amount will be added to the existing paid total of {formatCurrency(job.amount_paid || 0)}.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <CreditCard size={20} /> Use Payment
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
