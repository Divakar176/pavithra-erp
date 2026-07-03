import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DEFAULT_COMPANY_DETAILS = {
    name: 'Pavithra Enterprises',
    address: '123 Transport Nagar, Logistics Hub',
    city: 'Chennai, Tamil Nadu 600001',
    phone: '+91 98765 43210',
    email: 'info@pavithraenterprises.in',
    gstin: '33AABCP1234D1Z5'
};

const getCompanyDetails = () => {
    try {
        const saved = localStorage.getItem('companyDetails');
        if (saved) return JSON.parse(saved);
    } catch (e) {
        console.error("Error reading company details", e);
    }
    return DEFAULT_COMPANY_DETAILS;
};

export const setupHeader = (doc, title) => {
    const details = getCompanyDetails();
    
    doc.setFillColor(216, 98, 28); // #D8621C (Primary Orange)
    doc.rect(0, 0, doc.internal.pageSize.width, 45, 'F');
    
    // 1. Company Name (Top Left)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(details.name, 14, 16);
    
    // 2. Address (Below Company Name, max width 110 to avoid hitting the right side)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const addressText = `${details.address}, ${details.city}`;
    const splitAddress = doc.splitTextToSize(addressText, 110);
    doc.text(splitAddress, 14, 23);
    
    // 3. Phone & Email (Below Address)
    let nextY = 23 + (splitAddress.length * 4);
    doc.text(`Phone: ${details.phone} | GSTIN: ${details.gstin || 'N/A'}`, 14, nextY);
    if (details.email) {
        doc.text(`Email: ${details.email}`, 14, nextY + 4);
    }
    
    doc.setTextColor(0, 0, 0); // Reset text color
    
    // 4. Document Title (Centered Below Header, on same line as Date)
    const afterHeaderY = 55; 
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, doc.internal.pageSize.width / 2, afterHeaderY, { align: 'center' });
    
    return afterHeaderY; // Return Y position for the Date and subsequent content
};

export const generateInvoice = (trip) => {
    const doc = new jsPDF();
    let currentY = setupHeader(doc, 'TAX INVOICE');

    // Invoice Meta Details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Invoice No: INV-${trip.id.toString().padStart(5, '0')}`, 14, currentY);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width - 14, currentY, { align: 'right' });
    currentY += 10;

    // Customer Details
    doc.setFontSize(12);
    doc.setFillColor(240, 240, 240);
    doc.rect(14, currentY, doc.internal.pageSize.width - 28, 8, 'F');
    doc.text('Billed To:', 16, currentY + 6);
    currentY += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Customer Name: ${trip.customer?.name || 'N/A'}`, 14, currentY);
    doc.setFont('helvetica', 'normal');
    if (trip.customer?.phone) doc.text(`Phone: ${trip.customer.phone}`, 14, currentY + 6);
    currentY += 20;

    // Trip Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 240);
    doc.rect(14, currentY, doc.internal.pageSize.width - 28, 8, 'F');
    doc.text('Trip Details:', 16, currentY + 6);
    currentY += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Vehicle No: ${trip.vehicle?.vehicleNumber}`, 14, currentY);
    doc.text(`Material: ${trip.material}`, doc.internal.pageSize.width / 2, currentY);
    currentY += 6;
    doc.text(`Route: ${trip.source} to ${trip.destination}`, 14, currentY);
    doc.text(`Distance: ${trip.distanceKm} KM`, doc.internal.pageSize.width / 2, currentY);
    currentY += 15;

    // Financial Table
    autoTable(doc, {
        startY: currentY,
        head: [['Description', 'Amount (INR)']],
        body: [
            ['Total Freight Charges', `Rs. ${trip.tripCharges?.toLocaleString() || '0'}`],
            ['Advance Paid', `Rs. ${trip.advancePaid?.toLocaleString() || '0'}`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [34, 34, 34] }, // Dark grey
        styles: { fontSize: 10, cellPadding: 5 }
    });

    currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY + 30) + 10;
    
    const balance = (trip.tripCharges || 0) - (trip.advancePaid || 0);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Balance Due: Rs. ${balance.toLocaleString()}`, doc.internal.pageSize.width - 14, currentY, { align: 'right' });

    currentY += 40;
    doc.setFontSize(10);
    doc.text('Authorized Signatory', doc.internal.pageSize.width - 14, currentY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text('For Pavithra Enterprises', doc.internal.pageSize.width - 14, currentY + 5, { align: 'right' });

    doc.save(`Invoice_${trip.id}.pdf`);
};

export const generatePayslip = (driver) => {
    const doc = new jsPDF();
    let currentY = setupHeader(doc, 'DRIVER SETTLEMENT');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Date: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width - 14, currentY, { align: 'right' });
    currentY += 10;

    doc.setFontSize(12);
    doc.setFillColor(240, 240, 240);
    doc.rect(14, currentY, doc.internal.pageSize.width - 28, 8, 'F');
    doc.text('Driver Information:', 16, currentY + 6);
    currentY += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Name: ${(driver.driverName || 'N/A').toUpperCase()}`, 14, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Driver ID: DRV-${driver.driverId}`, 14, currentY + 6);
    if (driver.mobile) doc.text(`Phone: ${driver.mobile}`, 14, currentY + 12);
    currentY += 25;

    autoTable(doc, {
        startY: currentY,
        head: [['Description', 'Amount (INR)']],
        body: [
            ['Total Earned (Trip Salaries)', `Rs. ${driver.totalTripSalary?.toLocaleString() || '0'}`],
            ['Total Advances Taken', `Rs. ${driver.totalAdvances?.toLocaleString() || '0'}`]
        ],
        theme: 'grid',
        headStyles: { fillColor: [34, 34, 34] },
        styles: { fontSize: 10, cellPadding: 5 }
    });

    currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY + 30) + 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const net = (driver.totalTripSalary || 0) - (driver.totalAdvances || 0);
    doc.text(`Net Payable: Rs. ${net.toLocaleString()}`, doc.internal.pageSize.width - 14, currentY, { align: 'right' });

    currentY += 40;
    doc.setFontSize(10);
    doc.text('Authorized Signatory', doc.internal.pageSize.width - 14, currentY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text('For Pavithra Enterprises', doc.internal.pageSize.width - 14, currentY + 5, { align: 'right' });

    doc.save(`Payslip_${driver.driverName}.pdf`);
};

export const generatePnLReport = (kpis, dateRangeStr) => {
    const doc = new jsPDF();
    let currentY = setupHeader(doc, 'P&L REPORT');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Period: ${dateRangeStr}`, 14, currentY);
    doc.text(`Generated On: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width - 14, currentY, { align: 'right' });
    currentY += 15;

    // Income Table
    autoTable(doc, {
        startY: currentY,
        head: [['Income Source', 'Amount (INR)']],
        body: [
            ['Total Freight Revenue', `Rs. ${kpis.totalRevenue?.toLocaleString() || '0'}`],
            ['Other Income', 'Rs. 0'] // Placeholder for future
        ],
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] }, // Green
        styles: { fontSize: 10, cellPadding: 5 }
    });
    currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY + 30) + 10;

    // Expense Table
    autoTable(doc, {
        startY: currentY,
        head: [['Expense Category', 'Amount (INR)']],
        body: [
            ['Fuel Costs', `Rs. ${kpis.totalFuelCost?.toLocaleString() || '0'}`],
            ['Driver Salaries & Food', `Rs. ${kpis.totalDriverSalary?.toLocaleString() || '0'}`],
            ['Maintenance & Parts', `Rs. ${kpis.totalMaintenance?.toLocaleString() || '0'}`],
            ['Tolls & Permits', `Rs. ${kpis.totalTolls?.toLocaleString() || '0'}`]
        ],
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] }, // Red
        styles: { fontSize: 10, cellPadding: 5 }
    });
    currentY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY + 40) + 10;

    // Summary Box
    doc.setFillColor(34, 34, 34);
    doc.rect(14, currentY, doc.internal.pageSize.width - 28, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('NET PROFIT:', 20, currentY + 13);
    doc.text(`Rs. ${kpis.netProfit?.toLocaleString() || '0'}`, doc.internal.pageSize.width - 20, currentY + 13, { align: 'right' });

    doc.save(`PnL_Report_${dateRangeStr}.pdf`);
};
