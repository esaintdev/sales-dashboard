# Sales Dashboard & Business Management System

This is a comprehensive business management application designed to streamline sales tracking, client management, invoicing, and payment processing. It features a premium, dark-themed user interface ("Deep Universe" aesthetic) and robust tools for managing a creative or service-based business.

## Overview

The Sales Dashboard serves as a central hub for managing daily business operations. It replaces manual tracking methods with a unified digital system, offering real-time insights into revenue, outstanding balances, and project statuses. The application is built with a focus on visual elegance and high performance.

## Key Features

### 1. Dashboard & Analytics
- **Real-Time Overview**: View total sales, revenue collected, and outstanding balances at a glance.
- **Smart Currency Conversion**: Automatically converts and displays financial data in Naira (NGN), US Dollars (USD), or British Pounds (GBP) using real-time exchange rates.
- **Visual Charts**: Interactive charts provide visual breakdowns of revenue streams.

### 2. Project & Client Management
- **Client Database**: Store and manage client details including contact information and companies.
- **Project Tracking**: Create and track projects (Website Development, Graphic Design, etc.) with statuses like Pending, Completed, and Paid.
- **Quick Actions**: Add new projects or clients directly from the main dashboard or specific list views.

### 3. Integrated Invoicing System
- **Professional Invoices**: Generate clean, professional invoices automatically from project data.
- **Print & PDF**: Optimized print view for creating PDF invoices or printing directly to paper.
- **Email Integration**: One-click option to open the default mail client with a pre-filled professional message and invoice details.
- **Dark Mode UI**: A stunning viewing experience for invoices within the application.

### 4. Advanced Payment Processing
- **Partial Payments**: Record deposits or installment payments against any invoice. The system automatically tracks the remaining balance.
- **Transaction History**: A dedicated global view of all payments received, plus detailed history within each specific invoice.
- **Manual Overrides**: Full control to manually update project statuses (e.g., mark as Paid, Pending, or Completed) regardless of the payment record, ensuring flexibility for real-world scenarios.

## Technical Stack

- **Framework**: Next.js (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Authentication**: Custom JWT-based authentication with Next.js API Routes

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- A Supabase account and project.

### Installation

1.  Clone the repository to your local machine.
2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env.local` file in the root directory and add your Supabase credentials and JWT secret:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    JWT_SECRET=your_secure_random_string
    ```

4.  Run the Development Server:

    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.



## License

Private. All rights reserved.
