import i18next from 'i18next';

import en from './i18n/en';
import ar from './i18n/ar';
import fr from './i18n/fr';
import Users from './Users';

i18next.addResourceBundle('en', 'usersPage', en);
i18next.addResourceBundle('ar', 'usersPage', ar);
i18next.addResourceBundle('fr', 'usersPage', fr);

const UsersConfig = {
  settings: {
    layout: {
      config: {},
    },
    permissionName: 'USER',
  },
  routes: [
    {
      path: 'users',
      element: <Users />,
    },
  ],
};

export default UsersConfig;
