export const generateMonthlyReport = (stats: any) => {
    // Current date for filename
    const date = new Date().toISOString().split('T')[0];
    const filename = `monthly_report_${date}.csv`;

    // Static headers for now, can be expanded based on actual data shape
    const headers = ['Category', 'Amount', 'Currency'];

    // Prepare data rows
    const rows = [
        ['Total Sales', stats.totalSales, 'NGN'],
        ['Website Sales', stats.websiteSales, 'NGN'],
        ['Design Sales', stats.designSales, 'NGN'],
        ['Total Collected', stats.totalCollected, 'NGN'],
        ['Total Outstanding', stats.totalOutstanding, 'NGN'],
    ];

    // Convert to CSV format
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
