export type JobType = 'website' | 'graphic_design';
export type JobStatus = 'pending' | 'completed' | 'paid';

export interface Client {
    id: string;
    created_at: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
}

export interface Job {
    id: string;
    created_at: string;
    client_id: string;
    type: JobType;
    description: string;
    price: number;
    amount_paid: number;
    status: JobStatus;
    due_date?: string;
    // Optional joined client data for display
    // Optional joined client data for display
    clients?: Client;
}

export interface Payment {
    id: string;
    job_id: string;
    amount: number;
    payment_date: string;
    method?: string;
    notes?: string;
    created_at: string;
    // Optional joined job data
    jobs?: Job;
}
