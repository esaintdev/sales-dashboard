"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Client, Job, JobType, Payment } from '../types';

interface DashboardContextType {
    clients: Client[];
    jobs: Job[];
    loading: boolean;
    user: any;
    refreshData: () => Promise<void>;
    addClient: (client: Omit<Client, 'id' | 'created_at'>) => Promise<Client | null>;
    addJob: (job: Omit<Job, 'id' | 'created_at' | 'clients'>) => Promise<Job | null>;
    deleteJob: (id: string) => Promise<void>;
    deleteClient: (id: string) => Promise<void>;
    updateClient: (id: string, updates: Partial<Client>) => Promise<void>;

    updateJobStatus: (id: string, status: Job['status'], amountPaid?: number) => Promise<void>;
    addPayment: (jobId: string, amount: number, notes?: string) => Promise<void>;
    payments: Payment[];
    currency: 'NGN' | 'USD' | 'GBP';
    setCurrency: (currency: 'NGN' | 'USD' | 'GBP') => void;
    formatCurrency: (amount: number) => string;
    getStats: () => {
        totalSales: number;
        websiteSales: number;
        designSales: number;
        totalCollected: number;
        totalOutstanding: number;
    };
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [clients, setClients] = useState<Client[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    const refreshData = async () => {
        setLoading(true);
        try {
            // 1. Kick off Auth Check
            const authPromise = fetch('/api/auth/me').then(res => res.json());

            // 2. Kick off Supabase Data Fetches (Parallel)
            // Create a timeout promise to prevent hanging
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), 8000)
            );

            const clientsPromise = supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });

            const jobsPromise = supabase
                .from('jobs')
                .select('*, clients(*)')
                .order('created_at', { ascending: false });

            const paymentsPromise = supabase
                .from('payments')
                .select('*, jobs(description, clients(name))')
                .order('payment_date', { ascending: false });

            // 3. Wait for everything
            // 3. Wait for everything
            const values = await Promise.all([
                authPromise,
                Promise.race([clientsPromise, timeoutPromise]) as Promise<any>,
                Promise.race([jobsPromise, timeoutPromise]) as Promise<any>,
                Promise.race([paymentsPromise, timeoutPromise]) as Promise<any>
            ]);

            // Destructure properly based on Promise.all order
            const sessionData = values[0];
            const clientsRes = values[1];
            const jobsRes = values[2];
            const paymentsRes = values[3];

            const currentUser = sessionData.user;
            setUser(currentUser);

            if (!currentUser) {
                setLoading(false);
                return;
            }

            // 4. Process Data
            const { data: clientsData, error: clientsError } = clientsRes;
            const { data: jobsData, error: jobsError } = jobsRes;
            const { data: paymentsData, error: paymentsError } = paymentsRes;

            if (clientsError) console.error('Error fetching clients:', clientsError);
            if (jobsError) console.error('Error fetching jobs:', jobsError);

            if (clientsData) setClients(clientsData);
            if (jobsData) setJobs(jobsData);
            if (paymentsData) setPayments(paymentsData);

            // Set currency from user preference if available, BUT prioritize localStorage
            console.log('User Currency Preference:', currentUser?.currency); // Debug log

            const localCurrency = localStorage.getItem('dashboard_currency');
            if (localCurrency && ['NGN', 'USD', 'GBP'].includes(localCurrency)) {
                // If local exists, ensure it is the active state (it should already be from mount effect, but just in case)
                setCurrencyState(localCurrency as 'NGN' | 'USD' | 'GBP');

                // If server differs from local, sync server to match local (self-healing)
                if (currentUser?.currency && currentUser.currency !== localCurrency) {
                    setCurrency(localCurrency as 'NGN' | 'USD' | 'GBP');
                }
            } else if (currentUser?.currency) {
                // Only fall back to server if no local preference
                setCurrencyState(currentUser.currency);
                localStorage.setItem('dashboard_currency', currentUser.currency);
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const addClient = async (newClient: Omit<Client, 'id' | 'created_at'>) => {
        const { data, error } = await supabase
            .from('clients')
            .insert([newClient])
            .select()
            .single();

        if (error) {
            console.error('Error adding client:', error);
            return null;
        }
        setClients((prev) => [data, ...prev]);
        return data;
    };

    const addJob = async (newJob: Omit<Job, 'id' | 'created_at' | 'clients'>) => {
        const { data, error } = await supabase
            .from('jobs')
            .insert([newJob])
            .select('*, clients(*)')
            .single();

        if (error) {
            console.error('Error adding job:', error);
            return null;
        }
        setJobs((prev) => [data, ...prev]);
        return data;
    };

    const deleteJob = async (id: string) => {
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (error) {
            console.error('Error deleting job:', error);
            return;
        }
        setJobs((prev) => prev.filter((job) => job.id !== id));
    };

    const deleteClient = async (id: string) => {
        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (error) {
            console.error('Error deleting client:', error);
            return;
        }
        setClients((prev) => prev.filter((client) => client.id !== id));
        // Jobs will cascade delete on DB side, but we should update local state too
        setJobs((prev) => prev.filter((job) => job.client_id !== id));
    };

    const updateClient = async (id: string, updates: Partial<Client>) => {
        const { error } = await supabase
            .from('clients')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating client:', error);
            return;
        }
        setClients((prev) => prev.map((client) => (client.id === id ? { ...client, ...updates } : client)));
    };

    const updateJobStatus = async (id: string, status: Job['status'], amountPaid?: number) => {
        const updates: any = { status };
        if (amountPaid !== undefined) updates.amount_paid = amountPaid;

        const { error } = await supabase
            .from('jobs')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating job:', error);
            return;
        }
        setJobs((prev) => prev.map((job) => (job.id === id ? { ...job, ...updates } : job)));
    };

    const addPayment = async (jobId: string, amount: number, notes?: string) => {
        // 1. Insert into payments
        const { data: payment, error: paymentError } = await supabase
            .from('payments')
            .insert([{ job_id: jobId, amount, notes }])
            .select('*, jobs(description, clients(name))')
            .single();

        if (paymentError) {
            console.error('Error adding payment:', paymentError);
            return;
        }

        // 2. Update Job locally and in DB
        const job = jobs.find(j => j.id === jobId);
        if (job) {
            const newTotalPaid = (job.amount_paid || 0) + amount;
            const newStatus = newTotalPaid >= job.price ? 'paid' : 'pending';

            await updateJobStatus(jobId, newStatus, newTotalPaid);
        }

        // 3. Update Payments State
        if (payment) {
            setPayments(prev => [payment, ...prev]);
        }
    };

    const getStats = () => {
        const totalSales = jobs.reduce((acc, job) => acc + (job.price || 0), 0);
        const websiteSales = jobs
            .filter((job) => job.type === 'website')
            .reduce((acc, job) => acc + (job.price || 0), 0);
        const designSales = jobs
            .filter((job) => job.type === 'graphic_design')
            .reduce((acc, job) => acc + (job.price || 0), 0);

        const totalCollected = jobs.reduce((acc, job) => acc + (job.amount_paid || 0), 0);
        const totalOutstanding = totalSales - totalCollected;

        return { totalSales, websiteSales, designSales, totalCollected, totalOutstanding };
    };

    const [currency, setCurrencyState] = useState<'NGN' | 'USD' | 'GBP'>('NGN');

    useEffect(() => {
        // Load currency from localStorage on mount
        const savedCurrency = localStorage.getItem('dashboard_currency');
        if (savedCurrency && ['NGN', 'USD', 'GBP'].includes(savedCurrency)) {
            setCurrencyState(savedCurrency as 'NGN' | 'USD' | 'GBP');
        }
    }, []);

    const setCurrency = async (newCurrency: 'NGN' | 'USD' | 'GBP') => {
        // Optimistic update
        setCurrencyState(newCurrency);
        localStorage.setItem('dashboard_currency', newCurrency);

        try {
            await fetch('/api/settings/currency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currency: newCurrency }),
            });
        } catch (error) {
            console.error('Failed to save currency preference:', error);
            // Optionally revert state here if strict consistency is needed
        }
    };

    const [exchangeRates, setExchangeRates] = useState({
        NGN: 1,
        USD: 0.000645, // Fallback
        GBP: 0.000512, // Fallback
    });

    const fetchRates = async () => {
        try {
            const res = await fetch('https://open.er-api.com/v6/latest/NGN');
            const data = await res.json();
            if (data && data.rates) {
                setExchangeRates(prev => ({
                    ...prev,
                    USD: data.rates.USD,
                    GBP: data.rates.GBP
                }));
            }
        } catch (error) {
            console.error('Failed to fetch live exchange rates:', error);
        }
    };

    useEffect(() => {
        fetchRates();
    }, []);

    const formatCurrency = (amount: number) => {
        const convertedAmount = amount * exchangeRates[currency];
        const locale = currency === 'NGN' ? 'en-NG' : currency === 'USD' ? 'en-US' : 'en-GB';

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: currency === 'NGN' ? 0 : 2,
            maximumFractionDigits: 2,
        }).format(convertedAmount);
    };

    return (
        <DashboardContext.Provider
            value={{
                clients,
                jobs,
                loading,
                user,
                currency,
                setCurrency,
                formatCurrency,
                refreshData,
                addClient,
                addJob,
                deleteJob,

                deleteClient,
                updateClient,
                updateJobStatus,
                addPayment,
                payments,
                getStats
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}
