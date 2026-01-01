"use client";

import React, { useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import StatCard from '../components/StatCard';
import JobForm from '../components/JobForm';
import RevenueChart from '../components/RevenueChart';
import { useRouter } from 'next/navigation';
import { FileText, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import JobList from '../components/JobList';
import { generateMonthlyReport } from '../lib/reports';

export default function Home() {
  const { jobs, loading, user, formatCurrency } = useDashboard();
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = React.useState<string>('All Time');

  const months = [
    'All Time', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter jobs based on selected month
  const filteredJobs = React.useMemo(() => {
    if (selectedMonth === 'All Time') return jobs;
    return jobs.filter(job => {
      const jobDate = new Date(job.created_at); // Assuming created_at is the relevant date
      const jobMonth = jobDate.toLocaleString('default', { month: 'long' });
      return jobMonth === selectedMonth;
    });
  }, [jobs, selectedMonth]);

  // Calculate stats based on filtered jobs
  const stats = React.useMemo(() => {
    const totalSales = filteredJobs.reduce((acc, job) => acc + (job.price || 0), 0);
    const websiteSales = filteredJobs
      .filter((job) => job.type === 'website')
      .reduce((acc, job) => acc + (job.price || 0), 0);
    const designSales = filteredJobs
      .filter((job) => job.type === 'graphic_design')
      .reduce((acc, job) => acc + (job.price || 0), 0);

    const totalCollected = filteredJobs.reduce((acc, job) => acc + (job.amount_paid || 0), 0);
    const totalOutstanding = totalSales - totalCollected;

    return { totalSales, websiteSales, designSales, totalCollected, totalOutstanding };
  }, [filteredJobs]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="h-full flex items-center justify-center text-primary-text">
        <div className="animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }


  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary-text mb-2">
            Dashboard
          </h1>
          <p className="text-secondary-text">Welcome back, {user.email?.split('@')[0] || 'Developer'}.</p>
        </div>
        <div className="flex items-center gap-6">
          {/* Month Filter */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-[#131320] text-secondary-text border border-white/10 rounded-xl px-4 py-2 pr-8 focus:outline-none focus:border-primary-accent hover:border-white/20 transition-colors"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary-text">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-secondary-text uppercase tracking-widest mb-1">Total Outstanding</p>
            <p className="text-2xl font-bold text-secondary-accent">
              {formatCurrency(stats.totalOutstanding)}
            </p>
          </div>
        </div>
      </header>

      {/* Overview Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" amount={stats.totalSales} type="primary" />
        <StatCard title="Website Sales" amount={stats.websiteSales} type="secondary" />
        <StatCard title="Design Sales" amount={stats.designSales} type="secondary" />
        <StatCard title="Cash Collected" amount={stats.totalCollected} type="neutral" />
      </section>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Actions Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[#131320] border border-white/5 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Add New Project</h3>
            <JobForm />
          </div>

          <div className="bg-[#131320] border border-white/5 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => generateMonthlyReport(stats)}
                className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-secondary-text hover:text-white transition-all duration-200 flex items-center gap-4 group"
              >
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/20 transition-colors">
                  <FileText size={20} />
                </div>
                <span className="font-medium">Export Monthly Report</span>
              </button>
              <button
                onClick={() => router.push('/clients')}
                className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-secondary-text hover:text-white transition-all duration-200 flex items-center gap-4 group"
              >
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:text-purple-300 group-hover:bg-purple-500/20 transition-colors">
                  <Users size={20} />
                </div>
                <span className="font-medium">Manage Clients</span>
              </button>
            </div>
          </div>
        </div>

        {/* Charts & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          <RevenueChart />

          {/* Recent Jobs (Preview) */}
          <div className="bg-[#131320] rounded-3xl p-6 border border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Projects</h2>
              <Link href="/website" className="text-sm font-medium text-secondary-text hover:text-white flex items-center gap-2 transition-colors px-3 py-1 rounded-full hover:bg-white/5">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <JobList filterType="website" />
          </div>
        </div>
      </div>
    </div>
  );
}
