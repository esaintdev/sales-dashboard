import * as XLSX from 'xlsx';

export const generateMonthlyReport = (stats: any) => {
    // Current date for filename
    const date = new Date().toISOString().split('T')[0];
    const filename = `monthly_report_${date}.xlsx`;

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

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Report");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, filename);
};
