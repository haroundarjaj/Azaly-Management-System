import i18next from 'i18next';

import en from './i18n/en';
import ar from './i18n/ar';
import fr from './i18n/fr';
import Clients from './Clients';

i18next.addResourceBundle('en', 'clientsPage', en);
i18next.addResourceBundle('ar', 'clientsPage', ar);
i18next.addResourceBundle('fr', 'clientsPage', fr);

const ClientsConfig = {
  settings: {
    layout: {
      config: {},
    },
    permissionName: 'CLIENT',
  },
  routes: [
    {
      path: 'clients',
      element: <Clients />,
    },
  ],
};

export default ClientsConfig;
