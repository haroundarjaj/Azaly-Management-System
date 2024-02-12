import i18next from 'i18next';

import en from './i18n/en';
import ar from './i18n/ar';
import fr from './i18n/fr';
import Categories from './Categories';

i18next.addResourceBundle('en', 'categoriesPage', en);
i18next.addResourceBundle('ar', 'categoriesPage', ar);
i18next.addResourceBundle('fr', 'categoriesPage', fr);

const CategoriesConfig = {
  settings: {
    layout: {
      config: {},
    },
    permissionName: 'PRODUCT_CATEGORY'
  },
  routes: [
    {
      path: 'categories',
      element: <Categories />,
    },
  ],
};

export default CategoriesConfig;
