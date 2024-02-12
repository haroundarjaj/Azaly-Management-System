import { lazy } from 'react';
import i18next from 'i18next';

import en from './i18n/en';
import ar from './i18n/ar';
import fr from './i18n/fr';

i18next.addResourceBundle('en', 'dashboard', en);
i18next.addResourceBundle('ar', 'dashboard', ar);
i18next.addResourceBundle('fr', 'dashboard', fr);

const Dashboard = lazy(() => import('./Dashboard'));

const DashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'dashboard',
      element: <Dashboard />,
    },
  ],
};

export default DashboardConfig;
