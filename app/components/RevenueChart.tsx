"use client";

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
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
        // Simple sort logic (can be improved if dates span years)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.indexOf(a.name) - months.indexOf(b.name);
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
            <h3 className="text-lg font-bold text-white mb-2">Performance Overview</h3>
            <p className="text-secondary-text text-sm mb-6">Monthly performance metrics across all projects</p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#6b7280"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#6b7280"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ stroke: '#ffffff10', strokeWidth: 2 }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />

                        {/* Website Sales - Blue/Cyan */}
                        <Line
                            type="monotone"
                            dataKey="website"
                            name="Website"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 8, fill: '#3b82f6', stroke: '#131320', strokeWidth: 2 }}
                        />

                        {/* Design Sales - Purple/Pink */}
                        <Line
                            type="monotone"
                            dataKey="design"
                            name="Design"
                            stroke="#d946ef"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 8, fill: '#d946ef', stroke: '#131320', strokeWidth: 2 }}
                        />

                        {/* Total Sales - Orange */}
                        <Line
                            type="monotone"
                            dataKey="total"
                            name="Total Revenue"
                            stroke="#f97316"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 8, fill: '#f97316', stroke: '#131320', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
