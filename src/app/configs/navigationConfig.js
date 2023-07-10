import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    subtitle: 'Unique dashboard designs',
    type: 'group',
    icon: 'heroicons-outline:home',
    titleTranslate: 'DASHBOARDS',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        icon: 'heroicons-outline:clipboard-check',
        url: 'dashboard',
      }
    ],
  },
  {
    id: 'clients-manager',
    title: 'Clients Manager',
    titleTranslate: 'CLIENTS_MANAGER',
    subtitle: 'Clients Management Section',
    subtitleTranslate: 'CLIENTS_SUB',
    type: 'group',
    icon: 'heroicons-outline:user-group',
    children: [
      {
        id: 'clients-component',
        title: 'Clients',
        titleTranslate: 'CLIENTS',
        type: 'item',
        icon: 'heroicons-outline:user-group',
        url: 'clients',
      },
      {
        id: 'orders-component',
        title: 'Orders',
        titleTranslate: 'ORDERS',
        type: 'item',
        icon: 'heroicons-outline:clipboard-list',
        url: 'orders',
      },
    ]
  },
  {
    id: 'products-manager',
    title: 'Products Manager',
    titleTranslate: 'PRODUCTS_MANAGER',
    subtitle: 'Products Management Section',
    subtitleTranslate: 'PRODUCTS_SUB',
    type: 'group',
    icon: 'heroicons-outline:user-group',
    children: [
      {
        id: 'products-component',
        title: 'Products',
        titleTranslate: 'PRODUCTS',
        type: 'item',
        icon: 'heroicons-outline:color-swatch',
        url: 'products',
      },
      {
        id: 'categories-component',
        title: 'Categories',
        titleTranslate: 'CATEGORIES',
        type: 'item',
        icon: 'heroicons-outline:view-boards',
        url: 'categories',
      },
    ]
  },
  {
    id: 'example-component',
    title: 'Example',
    titleTranslate: 'EXAMPLE',
    subtitle: 'example show',
    subtitleTranslate: 'EXAMPLE_SUB',
    type: 'group',
    icon: 'heroicons-outline:exclamation-circle',
    children: [
      {
        id: 'example-component',
        title: 'Example',
        titleTranslate: 'EXAMPLE',
        type: 'item',
        icon: 'heroicons-outline:exclamation-circle',
        url: 'example',
      },
    ]
  }
];

export default navigationConfig;
