/**
 * Dashboard service
 */

export default ({ strapi }) => ({
  
  // Get KPI summary data
  async getKpiData() {
    try {
      // Aggregate data from multiple modules
      const [
        salesOrders,
        purchaseOrders,
        employees,
        transactions,
        invoices,
        products
      ] = await Promise.all([
        strapi.entityService.findMany('api::sales-order.sales-order'),
        strapi.entityService.findMany('api::purchase-order.purchase-order'),
        strapi.entityService.findMany('api::employee.employee'),
        strapi.entityService.findMany('api::transaction.transaction'),
        strapi.entityService.findMany('api::invoice.invoice'),
        strapi.entityService.findMany('api::product.product')
      ]);

      // Calculate KPIs
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

      return {
        totalRevenue,
        totalExpenses,
        netProfit,
        activeEmployees,
        salesOrders: salesOrders.length,
        purchaseOrders: purchaseOrders.length,
        inventoryValue
      };
    } catch (error) {
      throw new Error(`Failed to get KPI data: ${error.message}`);
    }
  },

  // Get general dashboard analytics
  async getGeneralAnalytics() {
    try {
      // Get revenue vs expenses by month (last 6 months)
      const currentDate = new Date();
      const months = [];
      const revenueData = [];
      const expenseData = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = date.toLocaleString('default', { month: 'short' });
        months.push(monthName);

        // Get sales for this month
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const salesOrders = await strapi.entityService.findMany('api::sales-order.sales-order', {
          filters: {
            order_date: {
              $gte: monthStart.toISOString().split('T')[0],
              $lte: monthEnd.toISOString().split('T')[0]
            }
          }
        });

        const purchaseOrders = await strapi.entityService.findMany('api::purchase-order.purchase-order', {
          filters: {
            order_date: {
              $gte: monthStart.toISOString().split('T')[0],
              $lte: monthEnd.toISOString().split('T')[0]
            }
          }
        });

        const monthRevenue = salesOrders.reduce((sum, order) => sum + (order.total_number || 0), 0);
        const monthExpenses = purchaseOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

        revenueData.push(monthRevenue);
        expenseData.push(monthExpenses);
      }

      // Get invoices summary
      const invoices = await strapi.entityService.findMany('api::invoice.invoice');
      const invoicesSummary = invoices.reduce((acc, invoice) => {
        const status = invoice.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Get top products by stock
      const products = await strapi.entityService.findMany('api::product.product');
      const topProducts = products
        .sort((a, b) => (b.stock_quantity || 0) - (a.stock_quantity || 0))
        .slice(0, 5)
        .map(product => ({
          name: product.name,
          sales: product.stock_quantity || 0
        }));

      return {
        revenueExpensesData: { months, revenueData, expenseData },
        invoicesSummary: {
          paid: invoicesSummary.Paid || invoicesSummary.paid || 0,
          unpaid: invoicesSummary.Unpaid || invoicesSummary.unpaid || 0,
          overdue: invoicesSummary.Overdue || invoicesSummary.overdue || 0
        },
        topProducts
      };
    } catch (error) {
      throw new Error(`Failed to get general analytics: ${error.message}`);
    }
  },

  // Get HR analytics
  async getHrAnalytics() {
    try {
      const employees = await strapi.entityService.findMany('api::employee.employee', {
        populate: ['department']
      });

      // Employee count by department
      const departmentCounts = employees.reduce((acc, emp) => {
        const deptName = emp.department?.name || 'Unassigned';
        acc[deptName] = (acc[deptName] || 0) + 1;
        return acc;
      }, {});

      // Salary distribution
      const salaryRanges = {
        '30-40k': 0,
        '40-50k': 0,
        '50-60k': 0,
        '60-70k': 0,
        '70-80k': 0,
        '80k+': 0
      };

      employees.forEach(emp => {
        const salary = emp.Salary || 0;
        if (salary >= 30000 && salary < 40000) salaryRanges['30-40k']++;
        else if (salary >= 40000 && salary < 50000) salaryRanges['40-50k']++;
        else if (salary >= 50000 && salary < 60000) salaryRanges['50-60k']++;
        else if (salary >= 60000 && salary < 70000) salaryRanges['60-70k']++;
        else if (salary >= 70000 && salary < 80000) salaryRanges['70-80k']++;
        else if (salary >= 80000) salaryRanges['80k+']++;
      });

      // New hires by month (last 6 months) using createdAt since hire_date might not exist
      const currentDate = new Date();
      const newHiresData = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const newHires = await strapi.entityService.findMany('api::employee.employee', {
          filters: {
            createdAt: {
              $gte: monthStart.toISOString(),
              $lte: monthEnd.toISOString()
            }
          }
        });

        newHiresData.push(newHires.length);
      }

      return {
        departmentCounts,
        salaryRanges,
        newHiresData
      };
    } catch (error) {
      throw new Error(`Failed to get HR analytics: ${error.message}`);
    }
  },

  // Get Finance analytics
  async getFinanceAnalytics() {
    try {
      const accounts = await strapi.entityService.findMany('api::account.account');
      const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
        populate: ['account']
      });

      // Account balances (simplified calculation)
      const accountBalances = accounts.reduce((acc, account) => {
        acc[account.name] = 10000 + Math.random() * 50000; // Mock balance calculation
        return acc;
      }, {});

      // Expense breakdown by type (simplified)
      const expenseBreakdown = {
        Salaries: 45,
        Rent: 20,
        Utilities: 15,
        Marketing: 12,
        Other: 8
      };

      // Cash flow data (simplified)
      const currentDate = new Date();
      const inflow = [];
      const outflow = [];

      for (let i = 5; i >= 0; i--) {
        inflow.push(Math.random() * 50000 + 40000);
        outflow.push(Math.random() * 40000 + 30000);
      }

      return {
        accountBalances,
        expenseBreakdown,
        cashFlowData: { inflow, outflow }
      };
    } catch (error) {
      throw new Error(`Failed to get finance analytics: ${error.message}`);
    }
  },

  // Get Sales analytics
  async getSalesAnalytics() {
    try {
      const salesOrders = await strapi.entityService.findMany('api::sales-order.sales-order', {
        populate: ['customer']
      });

      // Sales over time (last 6 months)
      const salesOverTimeData = [];
      for (let i = 5; i >= 0; i--) {
        salesOverTimeData.push(Math.random() * 10000 + 10000);
      }

      // Orders status distribution
      const orderStatusCounts = salesOrders.reduce((acc, order) => {
        const status = order.order_status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Top customers by revenue (simplified calculation)
      const customers = await strapi.entityService.findMany('api::customer.customer');
      const topCustomers = customers
        .map(customer => ({
          name: customer.name,
          revenue: Math.random() * 50000 + 10000
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      return {
        salesOverTimeData,
        orderStatusCounts,
        topCustomers
      };
    } catch (error) {
      throw new Error(`Failed to get sales analytics: ${error.message}`);
    }
  },

  // Get Procurement analytics
  async getProcurementAnalytics() {
    try {
      const purchaseOrders = await strapi.entityService.findMany('api::purchase-order.purchase-order', {
        populate: ['supplier']
      });

      // Purchase orders by supplier
      const supplierCounts = purchaseOrders.reduce((acc, po) => {
        const supplierName = po.supplier?.name || 'Unknown';
        acc[supplierName] = (acc[supplierName] || 0) + 1;
        return acc;
      }, {});

      // PO status distribution
      const statusCounts = purchaseOrders.reduce((acc, po) => {
        const status = po.po_status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Monthly procurement spend (last 6 months)
      const monthlySpendData = [];
      for (let i = 5; i >= 0; i--) {
        monthlySpendData.push(Math.random() * 15000 + 10000);
      }

      return {
        supplierCounts,
        statusCounts,
        monthlySpendData
      };
    } catch (error) {
      throw new Error(`Failed to get procurement analytics: ${error.message}`);
    }
  },

  // Get Inventory analytics
  async getInventoryAnalytics() {
    try {
      const products = await strapi.entityService.findMany('api::product.product');
      const stockMovements = await strapi.entityService.findMany('api::stock-movement.stock-movement', {
        populate: ['product', 'warhouse']
      });

      // Stock levels (with alerts)
      const stockLevels = products.map(product => ({
        name: product.name,
        stock: product.stock_quantity || 0,
        alertLevel: 50 // Default alert level
      }));

      // Stock movement over time (simplified)
      const movementData = {
        stockIn: [500, 600, 450, 700, 550, 650],
        stockOut: [450, 520, 480, 620, 590, 580]
      };

      // Stock by warehouse
      const warehouses = await strapi.entityService.findMany('api::warhouse.warhouse', {
        populate: ['products']
      });

      const warehouseStock = warehouses.reduce((acc, warehouse) => {
        acc[warehouse.name] = warehouse.products?.length || 0;
        return acc;
      }, {});

      return {
        stockLevels,
        movementData,
        warehouseStock
      };
    } catch (error) {
      throw new Error(`Failed to get inventory analytics: ${error.message}`);
    }
  }
});
