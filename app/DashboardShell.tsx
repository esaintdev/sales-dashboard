"use client";

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { Menu } from 'lucide-react';

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar Component */}
            <Sidebar
                isOpen={isMobileOpen}
                isCollapsed={isDesktopCollapsed}
                onClose={() => setIsMobileOpen(false)}
                onToggleCollapse={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            />

            {/* Main Content Area */}
            <div
                className={`flex-1 overflow-y-auto transition-all duration-300
            ${isDesktopCollapsed ? 'md:ml-20' : 'md:ml-64'}
        `}
            >
                {/* Mobile Header Trigger */}
                <div className="md:hidden p-4 flex items-center justify-between border-b border-white/5 bg-background sticky top-0 z-30">
                    <span className="font-bold text-white">My Workspace</span>
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="p-2 text-secondary-text hover:text-white"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
