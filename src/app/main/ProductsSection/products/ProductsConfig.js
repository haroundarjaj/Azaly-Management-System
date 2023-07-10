import i18next from 'i18next';

import en from './i18n/en';
import ar from './i18n/ar';
import fr from './i18n/fr';
import Products from './Products';

i18next.addResourceBundle('en', 'productsPage', en);
i18next.addResourceBundle('ar', 'productsPage', ar);
i18next.addResourceBundle('fr', 'productsPage', fr);

const ProductsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'products',
      element: <Products />,
    },
  ],
};

export default ProductsConfig;
