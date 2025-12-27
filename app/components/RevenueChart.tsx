"use client";

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';

export default function RevenueChart() {
    const { jobs, currency } = useDashboard();

    // Aggregate data by month
    const data = jobs.reduce((acc: any[], job) => {
        const date = new Date(job.created_at);
        const month = date.toLocaleString('default', { month: 'short' });
        const existing = acc.find(item => item.name === month);

        if (existing) {
            existing.total += job.price;
            if (job.type === 'website') existing.website += job.price;
            if (job.type === 'graphic_design') existing.design += job.price;
        } else {
            acc.push({
                name: month,
                total: job.price,
                website: job.type === 'website' ? job.price : 0,
                design: job.type === 'graphic_design' ? job.price : 0,
            });
        }
        return acc;
    }, []).sort((a, b) => {
        // Simple sort by month index could be added here, currently simplified
        return 0;
    });

    if (data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-secondary-text bg-white/5 rounded-xl border border-white/5">
                No data available for charts
            </div>
        )
    }

    return (
        <div className="bg-[#131320] border border-white/5 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6">Revenue Overview</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} axisLine={false} />
                        <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} tickFormatter={(value) => `${currency === 'NGN' ? '₦' : currency === 'GBP' ? '£' : '$'}${value / 1000}k`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ fill: '#ffffff05' }}
                        />
                        <Bar dataKey="website" name="Website" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="design" name="Design" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
