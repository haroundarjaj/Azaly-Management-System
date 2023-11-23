import i18next from 'i18next';

import en from './i18n/en';
import ar from './i18n/ar';
import fr from './i18n/fr';
import Feedstock from './Feedstock';

i18next.addResourceBundle('en', 'feedstockPage', en);
i18next.addResourceBundle('ar', 'feedstockPage', ar);
i18next.addResourceBundle('fr', 'feedstockPage', fr);

const FeedstockConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'feedstock',
      element: <Feedstock />,
    },
  ],
};

export default FeedstockConfig;
