import DashboardIcon from './components/DashboardIcon';
import DashboardPage from './pages/DashboardPage';
import pluginId from './pluginId';

export default {
  register(app: any) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: DashboardIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Dashboard',
      },
      Component: async () => DashboardPage,
      permissions: [],
    });

    app.registerPlugin({
      id: pluginId,
      initializer: () => null,
      isReady: false,
      name: 'ERP Dashboard',
    });
  },

  bootstrap() {
    console.log('ERP Dashboard plugin loaded successfully');
  },
};
