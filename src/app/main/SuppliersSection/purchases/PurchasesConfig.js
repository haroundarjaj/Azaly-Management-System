import i18next from 'i18next';

import en from './i18n/en';
import ar from './i18n/ar';
import fr from './i18n/fr';
import Purchases from './Purchases';

i18next.addResourceBundle('en', 'purchasesPage', en);
i18next.addResourceBundle('ar', 'purchasesPage', ar);
i18next.addResourceBundle('fr', 'purchasesPage', fr);

const PurchasesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'purchases',
      element: <Purchases />,
    },
  ],
};

export default PurchasesConfig;
