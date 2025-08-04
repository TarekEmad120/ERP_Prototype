/**
 * Dashboard routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/dashboard/kpi',
      handler: 'dashboard.kpi',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/dashboard/general',
      handler: 'dashboard.general',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/dashboard/hr',
      handler: 'dashboard.hr',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/dashboard/finance',
      handler: 'dashboard.finance',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/dashboard/sales',
      handler: 'dashboard.sales',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/dashboard/procurement',
      handler: 'dashboard.procurement',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/dashboard/inventory',
      handler: 'dashboard.inventory',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/dashboard/income-statement',
      handler: 'dashboard.generateIncomeStatement',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/dashboard/balance-sheet',
      handler: 'dashboard.generateBalanceSheet',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/dashboard/cash-flow-statement',
      handler: 'dashboard.generateCashFlowStatement',
      config: {
        auth: false,
      },
    },
  ],
};
