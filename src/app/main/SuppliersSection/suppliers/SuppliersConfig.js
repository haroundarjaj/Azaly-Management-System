import i18next from 'i18next';

import en from './i18n/en';
import ar from './i18n/ar';
import fr from './i18n/fr';
import Suppliers from './Suppliers';

i18next.addResourceBundle('en', 'suppliersPage', en);
i18next.addResourceBundle('ar', 'suppliersPage', ar);
i18next.addResourceBundle('fr', 'suppliersPage', fr);

const SuppliersConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'suppliers',
      element: <Suppliers />,
    },
  ],
};

export default SuppliersConfig;
