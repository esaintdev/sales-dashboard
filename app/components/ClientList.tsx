"use client";

import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Trash2, Edit2, Mail, Phone, Building } from 'lucide-react';

import { Client } from '../types';

interface ClientListProps {
    onEdit: (client: Client) => void;
}

export default function ClientList({ onEdit }: ClientListProps) {
    const { clients, deleteClient, loading } = useDashboard();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this client? Associated jobs will also be removed.')) {
            setDeletingId(id);
            await deleteClient(id);
            setDeletingId(null);
        }
    };

    if (loading) {
        return <div className="text-secondary-text animate-pulse">Loading clients...</div>;
    }

    if (clients.length === 0) {
        return (
            <div className="text-center py-12 text-secondary-text">
                <p>No clients found.</p>
                <p className="text-sm mt-2">Add your first client to get started.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
                <div
                    key={client.id}
                    className="bg-[#131320] border border-white/5 rounded-2xl p-6 hover:bg-[#1c1c2e] transition-colors group relative"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">{client.name}</h3>
                            {client.company && (
                                <div className="flex items-center gap-2 text-secondary-text text-sm mt-1">
                                    <Building size={14} />
                                    <span>{client.company}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onEdit(client)}
                                className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(client.id)}
                                className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                            >
                                {deletingId === client.id ? (
                                    <span className="animate-spin">⌛</span>
                                ) : (
                                    <Trash2 size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {client.email && (
                            <div className="flex items-center gap-3 text-secondary-text text-sm">
                                <Mail size={14} className="text-secondary-accent" />
                                <a href={`mailto:${client.email}`} className="hover:text-white transition-colors">
                                    {client.email}
                                </a>
                            </div>
                        )}
                        {client.phone && (
                            <div className="flex items-center gap-3 text-secondary-text text-sm">
                                <Phone size={14} className="text-secondary-accent" />
                                <a href={`tel:${client.phone}`} className="hover:text-white transition-colors">
                                    {client.phone}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
