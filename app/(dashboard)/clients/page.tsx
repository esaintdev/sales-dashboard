import React, { useState } from 'react';
import ClientList from '../../components/ClientList';
import ClientForm from '../../components/ClientForm';
import { Plus } from 'lucide-react';
import { Client } from '../../types';

export default function ClientsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);

    const handleEdit = (client: Client) => {
        setEditingClient(client);
        setIsFormOpen(true);
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setEditingClient(undefined);
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary-text mb-2">
                        Manage Clients
                    </h1>
                    <p className="text-secondary-text">View and manage your client list.</p>
                </div>
                {!isFormOpen && (
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-accent text-background font-bold rounded-xl hover:scale-105 transition-transform"
                    >
                        <Plus size={20} />
                        Add New Client
                    </button>
                )}
            </header>

            {isFormOpen ? (
                <div className="bg-[#131320] border border-white/5 rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {editingClient ? 'Edit Client' : 'Add New Client'}
                        </h2>
                        <p className="text-secondary-text">
                            {editingClient ? 'Update client details below.' : 'Enter client details below.'}
                        </p>
                    </div>
                    <ClientForm onClose={handleClose} initialData={editingClient} />
                </div>
            ) : (
                <ClientList onEdit={handleEdit} />
            )}
        </div>
    );
}
