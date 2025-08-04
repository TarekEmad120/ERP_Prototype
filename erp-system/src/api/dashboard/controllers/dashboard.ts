/**
 * Dashboard controller
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return `EGP ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Helper function to add header with company info
const addPDFHeader = async (page: any, title: string, boldFont: any, font: any) => {
  const { width, height } = page.getSize();
  
  // Company header section
  page.drawRectangle({
    x: 40,
    y: height - 80,
    width: width - 80,
    height: 60,
    color: rgb(0.95, 0.95, 0.95),
  });
  
  // Company name
  page.drawText('ERP PROTOTYPE COMPANY', {
    x: 50,
    y: height - 50,
    size: 16,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });
  
  // Report title
  page.drawText(title, {
    x: 50,
    y: height - 70,
    size: 14,
    font: boldFont,
    color: rgb(0, 0.3, 0.6),
  });
  
  // Date and time
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeStr = currentDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  page.drawText(`Generated on: ${dateStr} at ${timeStr}`, {
    x: width - 250,
    y: height - 50,
    size: 10,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });
  
  return height - 100; // Return starting Y position for content
};

// Helper function to add line separator
const addSeparatorLine = (page: any, yPosition: number, width: number) => {
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  return yPosition - 15;
};

// Helper function to add section header
const addSectionHeader = (page: any, text: string, yPosition: number, boldFont: any) => {
  page.drawText(text, {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: rgb(0, 0.3, 0.6),
  });
  return yPosition - 25;
};

// Helper function to add financial line item
const addFinancialLine = (page: any, label: string, amount: number, yPosition: number, font: any, isTotal = false, isNegative = false) => {
  const fontSize = isTotal ? 12 : 11;
  const textFont = font; 
  const color = isNegative && amount < 0 ? rgb(0.8, 0, 0) : rgb(0, 0, 0);
  
  // Add background for totals
  if (isTotal) {
    page.drawRectangle({
      x: 45,
      y: yPosition - 5,
      width: 500,
      height: 20,
      color: rgb(0.97, 0.97, 0.97),
    });
  }
  
  page.drawText(label, {
    x: 70,
    y: yPosition,
    size: fontSize,
    font: textFont,
    color: color,
  });
  
  const amountText = formatCurrency(Math.abs(amount));
  const amountX = 450 - (amountText.length * 6); // Right align
  
  page.drawText(amountText, {
    x: amountX,
    y: yPosition,
    size: fontSize,
    font: textFont,
    color: color,
  });
  
  return yPosition - (isTotal ? 30 : 20);
};

export default {
  async kpi(ctx) {
    try {
      // Get real data from the database
      const [
        salesOrders,
        purchaseOrders,
        employees,
        products
      ] = await Promise.all([
        ctx.strapi.entityService.findMany('api::sales-order.sales-order'),
        ctx.strapi.entityService.findMany('api::purchase-order.purchase-order'),
        ctx.strapi.entityService.findMany('api::employee.employee'),
        ctx.strapi.entityService.findMany('api::product.product')
      ]);

      // Calculate real KPIs
      const totalRevenue = salesOrders.reduce((sum, order) => {
        return sum + (order.total_number || 0);
      }, 0);

      const totalExpenses = purchaseOrders.reduce((sum, order) => {
        return sum + (order.total_amount || 0);
      }, 0);

      const netProfit = totalRevenue - totalExpenses;
      const activeEmployees = employees.length;

      const inventoryValue = products.reduce((sum, product) => 
        sum + ((product.stock_quantity || 0) * (product.unit_price || 0)), 0);

      ctx.body = {
        data: {
          totalRevenue,
          totalExpenses,
          netProfit,
          activeEmployees,
          salesOrders: salesOrders.length,
          purchaseOrders: purchaseOrders.length,
          inventoryValue
        }
      };
    } catch (error) {
      ctx.throw(500, `Failed to get KPI data: ${error.message}`);
    }
  },

  async general(ctx) {
    try {
      ctx.body = {
        data: {
          revenueExpensesData: {
            months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            revenueData: [65000, 70000, 75000, 80000, 85000, 90000],
            expenseData: [45000, 50000, 55000, 60000, 65000, 70000]
          },
          invoicesSummary: { paid: 45, unpaid: 12, overdue: 3 },
          topProducts: [
            { name: 'Product A', sales: 150 },
            { name: 'Product B', sales: 130 },
            { name: 'Product C', sales: 120 },
            { name: 'Product D', sales: 110 },
            { name: 'Product E', sales: 100 }
          ]
        }
      };
    } catch (error) {
      ctx.throw(500, `Failed to get general analytics: ${error.message}`);
    }
  },

  async hr(ctx) {
    try {
      const employees = await ctx.strapi.entityService.findMany('api::employee.employee', {
        populate: ['department']
      });

      // Employee count by department
      const departmentCounts = employees.reduce((acc, emp) => {
        const deptName = emp.department?.name || 'Unassigned';
        acc[deptName] = (acc[deptName] || 0) + 1;
        return acc;
      }, {});

      ctx.body = {
        data: {
          departmentCounts,
          salaryRanges: {
            '30-40k': 5,
            '40-50k': 12,
            '50-60k': 18,
            '60-70k': 15,
            '70-80k': 8,
            '80k+': 4
          },
          newHiresData: [2, 3, 1, 4, 2, 3]
        }
      };
    } catch (error) {
      ctx.throw(500, `Failed to get HR analytics: ${error.message}`);
    }
  },

  async finance(ctx) {
    try {
      ctx.body = {
        data: {
          accountBalances: {
            'Cash': 125000,
            'Accounts Receivable': 85000,
            'Inventory': 450000,
            'Equipment': 275000
          },
          expenseBreakdown: {
            Salaries: 45,
            Rent: 20,
            Utilities: 15,
            Marketing: 12,
            Other: 8
          },
          cashFlowData: {
            inflow: [65000, 70000, 75000, 80000, 85000, 90000],
            outflow: [45000, 50000, 55000, 60000, 65000, 70000]
          }
        }
      };
    } catch (error) {
      ctx.throw(500, `Failed to get finance analytics: ${error.message}`);
    }
  },

  async sales(ctx) {
    try {
      const salesOrders = await ctx.strapi.entityService.findMany('api::sales-order.sales-order');
      
      // Orders status distribution
      const orderStatusCounts = salesOrders.reduce((acc, order) => {
        const status = order.order_status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      ctx.body = {
        data: {
          salesOverTimeData: [45000, 52000, 48000, 61000, 55000, 67000],
          orderStatusCounts,
          topCustomers: [
            { name: 'Customer A', revenue: 45000 },
            { name: 'Customer B', revenue: 38000 },
            { name: 'Customer C', revenue: 32000 },
            { name: 'Customer D', revenue: 28000 },
            { name: 'Customer E', revenue: 25000 }
          ]
        }
      };
    } catch (error) {
      ctx.throw(500, `Failed to get sales analytics: ${error.message}`);
    }
  },

  async procurement(ctx) {
    try {
      const purchaseOrders = await ctx.strapi.entityService.findMany('api::purchase-order.purchase-order');
      
      // PO status distribution
      const statusCounts = purchaseOrders.reduce((acc, po) => {
        const status = po.po_status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      ctx.body = {
        data: {
          supplierCounts: {
            'Supplier A': 15,
            'Supplier B': 12,
            'Supplier C': 8,
            'Supplier D': 5
          },
          statusCounts,
          monthlySpendData: [25000, 28000, 32000, 30000, 35000, 38000]
        }
      };
    } catch (error) {
      ctx.throw(500, `Failed to get procurement analytics: ${error.message}`);
    }
  },

  async inventory(ctx) {
    try {
      const products = await ctx.strapi.entityService.findMany('api::product.product');
      
      // Stock levels
      const stockLevels = products.map(product => ({
        name: product.name,
        stock: product.stock_quantity || 0,
        alertLevel: 50
      }));

      ctx.body = {
        data: {
          stockLevels,
          movementData: {
            stockIn: [500, 600, 450, 700, 550, 650],
            stockOut: [450, 520, 480, 620, 590, 580]
          },
          warehouseStock: {
            'Main Warehouse': 450,
            'Secondary Warehouse': 200,
            'Retail Store': 150
          }
        }
      };
    } catch (error) {
      ctx.throw(500, `Failed to get inventory analytics: ${error.message}`);
    }
  },

  async generateIncomeStatement(ctx) {
    try {
      // Fetch financial data from the database
      const [
        salesOrders,
        purchaseOrders,
        transactions,
        products
      ] = await Promise.all([
        strapi.entityService.findMany('api::sales-order.sales-order'),
        strapi.entityService.findMany('api::purchase-order.purchase-order'),
        strapi.entityService.findMany('api::transaction.transaction'),
        strapi.entityService.findMany('api::product.product')
      ]);

      // Calculate revenue from sales orders
      const totalRevenue = salesOrders.reduce((sum, order) => sum + (order.total_number || 0), 0);
      
      // Calculate cost of goods sold from purchase orders
      const totalCOGS = purchaseOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      
      // Calculate operating expenses from transactions
      const operatingExpenses = transactions
        .filter(t => (t.amount || 0) < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);

      const grossProfit = totalRevenue - totalCOGS;
      const netIncome = grossProfit - operatingExpenses;

      // Generate PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const { width, height } = page.getSize();
      
      // Add header
      let yPosition = await addPDFHeader(page, 'INCOME STATEMENT', boldFont, font);
      
      // Period information
      yPosition = addSectionHeader(page, 'For the Period Ended:', yPosition, boldFont);
      page.drawText(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), {
        x: 70,
        y: yPosition,
        size: 11,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
      yPosition -= 30;

      // REVENUE SECTION
      yPosition = addSectionHeader(page, 'REVENUE', yPosition, boldFont);
      yPosition = addFinancialLine(page, 'Sales Revenue', totalRevenue, yPosition, font);
      yPosition = addSeparatorLine(page, yPosition, width);
      yPosition = addFinancialLine(page, 'Total Revenue', totalRevenue, yPosition, boldFont, true);
      yPosition -= 20;

      // COST OF GOODS SOLD SECTION
      yPosition = addSectionHeader(page, 'COST OF GOODS SOLD', yPosition, boldFont);
      yPosition = addFinancialLine(page, 'Cost of Goods Sold', totalCOGS, yPosition, font);
      yPosition = addSeparatorLine(page, yPosition, width);
      yPosition = addFinancialLine(page, 'Total Cost of Goods Sold', totalCOGS, yPosition, boldFont, true);
      yPosition -= 20;

      // GROSS PROFIT
      yPosition = addFinancialLine(page, 'GROSS PROFIT', grossProfit, yPosition, boldFont, true, grossProfit < 0);
      yPosition -= 20;

      // OPERATING EXPENSES SECTION
      yPosition = addSectionHeader(page, 'OPERATING EXPENSES', yPosition, boldFont);
      yPosition = addFinancialLine(page, 'Operating Expenses', operatingExpenses, yPosition, font);
      yPosition = addSeparatorLine(page, yPosition, width);
      yPosition = addFinancialLine(page, 'Total Operating Expenses', operatingExpenses, yPosition, boldFont, true);
      yPosition -= 30;

      // NET INCOME
      page.drawRectangle({
        x: 45,
        y: yPosition - 5,
        width: 500,
        height: 25,
        color: netIncome >= 0 ? rgb(0.9, 0.98, 0.9) : rgb(0.98, 0.9, 0.9),
      });
      
      yPosition = addFinancialLine(page, 'NET INCOME', netIncome, yPosition, boldFont, true, netIncome < 0);

      // Add footer with summary statistics
      yPosition = 120;
      yPosition = addSeparatorLine(page, yPosition, width);
      yPosition -= 15;
      
      page.drawText('Summary Statistics:', {
        x: 50,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0, 0.3, 0.6),
      });
      yPosition -= 20;
      
      page.drawText(`• Total Sales Orders: ${salesOrders.length}`, {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPosition -= 15;
      
      page.drawText(`• Total Purchase Orders: ${purchaseOrders.length}`, {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPosition -= 15;
      
      const profitMargin = totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(2) : '0.00';
      page.drawText(`• Profit Margin: ${profitMargin}%`, {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });

      const pdfBytes = await pdfDoc.save();

      ctx.set('Content-Type', 'application/pdf');
      ctx.set('Content-Disposition', 'attachment; filename="income-statement.pdf"');
      ctx.body = Buffer.from(pdfBytes);
    } catch (error) {
      console.error('Error generating income statement:', error);
      ctx.throw(500, 'Error generating income statement');
    }
  },

  async generateBalanceSheet(ctx) {
    try {
      // Fetch financial data
      const [
        products,
        transactions,
        salesOrders,
        purchaseOrders
      ] = await Promise.all([
        strapi.entityService.findMany('api::product.product'),
        strapi.entityService.findMany('api::transaction.transaction'),
        strapi.entityService.findMany('api::sales-order.sales-order'),
        strapi.entityService.findMany('api::purchase-order.purchase-order')
      ]);

      // Calculate assets
      const inventoryValue = products.reduce((sum, product) => 
        sum + ((product.stock_quantity || 0) * (product.unit_price || 0)), 0);
      
      const accountsReceivable = salesOrders
        .filter(order => order.order_status !== 'completed')
        .reduce((sum, order) => sum + (order.total_number || 0), 0);

      const cash = transactions
        .filter(t => (t.amount || 0) > 0)
        .reduce((sum, t) => sum + (t.amount || 0), 0) -
        transactions
        .filter(t => (t.amount || 0) < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);

      const totalAssets = inventoryValue + accountsReceivable + Math.max(cash, 0);

      // Calculate liabilities
      const accountsPayable = purchaseOrders
        .filter(order => order.po_status !== 'closed')
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);

      // Calculate equity (simplified)
      const retainedEarnings = salesOrders.reduce((sum, order) => sum + (order.total_number || 0), 0) -
                              purchaseOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      const totalLiabilitiesAndEquity = accountsPayable + retainedEarnings;

      // Generate PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const { width, height } = page.getSize();
      
      // Add header
      let yPosition = await addPDFHeader(page, 'BALANCE SHEET', boldFont, font);
      
      // Date information
      yPosition = addSectionHeader(page, 'As of:', yPosition, boldFont);
      page.drawText(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), {
        x: 70,
        y: yPosition,
        size: 11,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
      yPosition -= 30;

      // ASSETS SECTION
      yPosition = addSectionHeader(page, 'ASSETS', yPosition, boldFont);
      
      page.drawText('Current Assets:', {
        x: 60,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPosition -= 20;
      
      yPosition = addFinancialLine(page, 'Cash and Cash Equivalents', Math.max(cash, 0), yPosition, font);
      yPosition = addFinancialLine(page, 'Accounts Receivable', accountsReceivable, yPosition, font);
      yPosition = addFinancialLine(page, 'Inventory', inventoryValue, yPosition, font);
      
      yPosition = addSeparatorLine(page, yPosition, width);
      yPosition = addFinancialLine(page, 'Total Assets', totalAssets, yPosition, boldFont, true);
      yPosition -= 30;

      // LIABILITIES SECTION
      yPosition = addSectionHeader(page, 'LIABILITIES', yPosition, boldFont);
      
      page.drawText('Current Liabilities:', {
        x: 60,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPosition -= 20;
      
      yPosition = addFinancialLine(page, 'Accounts Payable', accountsPayable, yPosition, font);
      
      yPosition = addSeparatorLine(page, yPosition, width);
      yPosition = addFinancialLine(page, 'Total Liabilities', accountsPayable, yPosition, boldFont, true);
      yPosition -= 30;

      // EQUITY SECTION
      yPosition = addSectionHeader(page, 'STOCKHOLDERS\' EQUITY', yPosition, boldFont);
      yPosition = addFinancialLine(page, 'Retained Earnings', retainedEarnings, yPosition, font, false, retainedEarnings < 0);
      
      yPosition = addSeparatorLine(page, yPosition, width);
      yPosition = addFinancialLine(page, 'Total Stockholders\' Equity', retainedEarnings, yPosition, boldFont, true, retainedEarnings < 0);
      yPosition -= 20;
      
      yPosition = addSeparatorLine(page, yPosition, width);
      
      // Total Liabilities and Equity with highlighting
      page.drawRectangle({
        x: 45,
        y: yPosition - 5,
        width: 500,
        height: 25,
        color: rgb(0.9, 0.95, 1),
      });
      yPosition = addFinancialLine(page, 'TOTAL LIABILITIES & EQUITY', totalLiabilitiesAndEquity, yPosition, boldFont, true);

      // Add footer with balance verification
      yPosition = 120;
      yPosition = addSeparatorLine(page, yPosition, width);
      yPosition -= 15;
      
      page.drawText('Balance Verification:', {
        x: 50,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0, 0.3, 0.6),
      });
      yPosition -= 20;
      
      const balanceDifference = totalAssets - totalLiabilitiesAndEquity;
      const isBalanced = Math.abs(balanceDifference) < 0.01;
      
      page.drawText(`• Balance Status: ${isBalanced ? 'BALANCED' : 'NOT BALANCED'}`, {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
        color: isBalanced ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0),
      });
      yPosition -= 15;
      
      if (!isBalanced) {
        page.drawText(`• Difference: ${formatCurrency(balanceDifference)}`, {
          x: 70,
          y: yPosition,
          size: 10,
          font: font,
          color: rgb(0.8, 0, 0),
        });
        yPosition -= 15;
      }
      
      page.drawText(`• Total Products in Inventory: ${products.length}`, {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });

      const pdfBytes = await pdfDoc.save();

      ctx.set('Content-Type', 'application/pdf');
      ctx.set('Content-Disposition', 'attachment; filename="balance-sheet.pdf"');
      ctx.body = Buffer.from(pdfBytes);
    } catch (error) {
      console.error('Error generating balance sheet:', error);
      ctx.throw(500, 'Error generating balance sheet');
    }
  },

  async generateCashFlowStatement(ctx) {
    try {
      // Fetch transactions
      const [
        transactions,
        salesOrders,
        purchaseOrders
      ] = await Promise.all([
        strapi.entityService.findMany('api::transaction.transaction'),
        strapi.entityService.findMany('api::sales-order.sales-order'),
        strapi.entityService.findMany('api::purchase-order.purchase-order')
      ]);

      // Categorize cash flows
      const operatingCashFlows = transactions.filter(t => 
        Math.abs(t.amount || 0) > 0
      );

      const investingCashFlow = 0;
      const financingCashFlow = 0;

      // Calculate net cash flows
      const operatingCashFlow = operatingCashFlows.reduce((sum, t) => 
        sum + (t.amount || 0), 0);

      const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;

      // Calculate cash from sales and purchases
      const cashFromSales = salesOrders.reduce((sum, order) => sum + (order.total_number || 0), 0);
      const cashToPurchases = purchaseOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      // Generate PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const { width, height } = page.getSize();
      
      // Add header
      let yPosition = await addPDFHeader(page, 'CASH FLOW STATEMENT', boldFont, font);
      
      // Period information
      yPosition = addSectionHeader(page, 'For the Period Ended:', yPosition, boldFont);
      page.drawText(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), {
        x: 70,
        y: yPosition,
        size: 11,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
      yPosition -= 30;

      // OPERATING ACTIVITIES SECTION
      yPosition = addSectionHeader(page, 'CASH FLOWS FROM OPERATING ACTIVITIES', yPosition, boldFont);
      
      yPosition = addFinancialLine(page, 'Cash received from customers', cashFromSales, yPosition, font);
      yPosition = addFinancialLine(page, 'Cash paid to suppliers', -cashToPurchases, yPosition, font);
      
      const otherOperatingCash = operatingCashFlow - cashFromSales + cashToPurchases;
      if (Math.abs(otherOperatingCash) > 0.01) {
        yPosition = addFinancialLine(page, 'Other operating cash flows', otherOperatingCash, yPosition, font);
      }
      
      yPosition = addSeparatorLine(page, yPosition, width);
      yPosition = addFinancialLine(page, 'Net cash from operating activities', operatingCashFlow, yPosition, boldFont, true, operatingCashFlow < 0);
      yPosition -= 30;

      // INVESTING ACTIVITIES SECTION
      yPosition = addSectionHeader(page, 'CASH FLOWS FROM INVESTING ACTIVITIES', yPosition, boldFont);
      yPosition = addFinancialLine(page, 'No investing activities recorded', investingCashFlow, yPosition, font);
      yPosition = addSeparatorLine(page, yPosition, width);
      yPosition = addFinancialLine(page, 'Net cash from investing activities', investingCashFlow, yPosition, boldFont, true);
      yPosition -= 30;

      // FINANCING ACTIVITIES SECTION
      yPosition = addSectionHeader(page, 'CASH FLOWS FROM FINANCING ACTIVITIES', yPosition, boldFont);
      yPosition = addFinancialLine(page, 'No financing activities recorded', financingCashFlow, yPosition, font);
      yPosition = addSeparatorLine(page, yPosition, width);
      yPosition = addFinancialLine(page, 'Net cash from financing activities', financingCashFlow, yPosition, boldFont, true);
      yPosition -= 40;

      // NET CHANGE IN CASH
      page.drawRectangle({
        x: 45,
        y: yPosition - 5,
        width: 500,
        height: 25,
        color: netCashFlow >= 0 ? rgb(0.9, 0.98, 0.9) : rgb(0.98, 0.9, 0.9),
      });
      yPosition = addFinancialLine(page, 'NET CHANGE IN CASH AND CASH EQUIVALENTS', netCashFlow, yPosition, boldFont, true, netCashFlow < 0);

      // Add supplementary information
      yPosition = 140;
      yPosition = addSeparatorLine(page, yPosition, width);
      yPosition -= 15;
      
      page.drawText('Supplementary Information:', {
        x: 50,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0, 0.3, 0.6),
      });
      yPosition -= 20;
      
      page.drawText(`• Total transactions processed: ${transactions.length}`, {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPosition -= 15;
      
      page.drawText(`• Total sales orders: ${salesOrders.length}`, {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPosition -= 15;
      
      page.drawText(`• Total purchase orders: ${purchaseOrders.length}`, {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPosition -= 15;
      
      const cashFlowRatio = cashFromSales > 0 ? (operatingCashFlow / cashFromSales * 100).toFixed(2) : '0.00';
      page.drawText(`• Operating cash flow ratio: ${cashFlowRatio}%`, {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });

      const pdfBytes = await pdfDoc.save();

      ctx.set('Content-Type', 'application/pdf');
      ctx.set('Content-Disposition', 'attachment; filename="cash-flow-statement.pdf"');
      ctx.body = Buffer.from(pdfBytes);
    } catch (error) {
      console.error('Error generating cash flow statement:', error);
      ctx.throw(500, 'Error generating cash flow statement');
    }
  }
};
