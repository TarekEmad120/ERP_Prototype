import type { StrapiApp } from '@strapi/strapi/admin';

const config = {
  config: {
    head: {
      favicon: '/favicon.png',
    },
    auth: {
      logo: './favicon.png',
    },
    menu: {
      logo: './favicon.png',
    },
    tutorials: false,
    notifications: { releases: false },
    theme: {
      light: {
        colors: {
          primary100: '#f0f8ff',
          primary200: '#b3d9ff',
          primary500: '#007bff',
          primary600: '#0056b3',
          primary700: '#004085',
        },
      },
    },
    locales: ['en'],
  },
  bootstrap(app: StrapiApp) {
    console.log('Admin configuration loaded successfully');
    
    // Add Dashboard menu item
    app.addMenuLink({
      to: '/dashboard',
      icon: () => '📊',
      intlLabel: {
        id: 'dashboard.menu.title',
        defaultMessage: 'Dashboard',
      },
      Component: () => import('./pages/Dashboard'),
      permissions: [],
    });

    // Add Financial Journals menu item
    app.addMenuLink({
      to: '/financial-journals',
      icon: () => '📋',
      intlLabel: {
        id: 'financial-journals.menu.title',
        defaultMessage: 'Financial Journals',
      },
      Component: () => import('./pages/FinancialJournals'),
      permissions: [],
    });
  },
};

export default config;
