import i18next from 'i18next';

import en from './i18n/en';
import ar from './i18n/ar';
import fr from './i18n/fr';
import Orders from './Orders';

i18next.addResourceBundle('en', 'ordersPage', en);
i18next.addResourceBundle('ar', 'ordersPage', ar);
i18next.addResourceBundle('fr', 'ordersPage', fr);

const OrdersConfig = {
  settings: {
    layout: {
      config: {},
    },
    permissionName: 'ORDER',
  },
  routes: [
    {
      path: 'orders',
      element: <Orders />,
    },
  ],
};

export default OrdersConfig;
