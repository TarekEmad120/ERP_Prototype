module.exports = (plugin) => {
  plugin.routes['content-api'].routes.push({
    method: 'GET',
    path: '/dashboard/kpi',
    handler: async (ctx) => {
      try {
        // Get real data from the database
        const [
          salesOrders,
          purchaseOrders,
          employees,
          products
        ] = await Promise.all([
          strapi.entityService.findMany('api::sales-order.sales-order'),
          strapi.entityService.findMany('api::purchase-order.purchase-order'),
          strapi.entityService.findMany('api::employee.employee'),
          strapi.entityService.findMany('api::product.product')
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
    config: {
      auth: false,
    },
  });

  plugin.routes['content-api'].routes.push({
    method: 'GET',
    path: '/dashboard/general',
    handler: async (ctx) => {
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
    },
    config: {
      auth: false,
    },
  });

  return plugin;
};
