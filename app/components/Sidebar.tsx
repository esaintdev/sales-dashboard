"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Globe, Palette, Settings, LogOut, X, ChevronLeft, ChevronRight, Receipt, CreditCard } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean; // Mobile open state
    isCollapsed: boolean; // Desktop collapsed state
    onClose: () => void; // Close mobile menu
    onToggleCollapse: () => void; // Toggle desktop collapse
}

export default function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Website Projects', path: '/website', icon: Globe },
        { name: 'Graphic Design', path: '/design', icon: Palette },
        { name: 'Invoices', path: '/invoices', icon: Receipt },
        { name: 'Transactions', path: '/transactions', icon: CreditCard },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    // Classes for the sidebar container
    // Mobile: fixed overlay. Desktop: transition width.
    const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 bg-[#0b0b15] border-r border-white/5 flex flex-col transition-all duration-300
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
    md:translate-x-0 
    ${isCollapsed ? 'md:w-20' : 'md:w-64'}
  `;

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <div className={sidebarClasses}>
                {/* Header */}
                <div className={`p-6 flex items-center justify-between ${isCollapsed ? 'md:justify-center' : ''}`}>
                    {!isCollapsed && (
                        <div>
                            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary-text whitespace-nowrap">
                                My Workspace
                            </h1>
                            <p className="text-xs text-secondary-text mt-1 whitespace-nowrap">Business Management</p>
                        </div>
                    )}
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="md:hidden text-secondary-text hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => onClose()} // Close on mobile navigation
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive
                                        ? 'bg-primary-accent/10 text-primary-accent border border-primary-accent/20'
                                        : 'text-secondary-text hover:bg-white/5 hover:text-white'
                                    }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                                title={isCollapsed ? item.name : ''}
                            >
                                <item.icon size={20} className={`shrink-0 ${isActive ? 'text-primary-accent' : 'text-secondary-text group-hover:text-white transition-colors'}`} />

                                {!isCollapsed && (
                                    <span className="font-medium text-sm whitespace-nowrap overflow-hidden">{item.name}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-white/5 mx-4 mb-4 space-y-2">
                    {/* Collapse Toggle (Desktop Only) */}
                    <button
                        onClick={onToggleCollapse}
                        className="hidden md:flex items-center justify-center w-full p-2 text-secondary-text hover:text-white transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>

                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-secondary-text hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}
                        title="Log Out"
                    >
                        <LogOut size={20} className="shrink-0" />
                        {!isCollapsed && (
                            <span className="font-medium text-sm whitespace-nowrap">Log Out</span>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
