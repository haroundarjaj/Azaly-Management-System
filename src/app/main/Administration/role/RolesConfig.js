import i18next from 'i18next';

import en from './i18n/en';
import ar from './i18n/ar';
import fr from './i18n/fr';
import Roles from './Roles';

i18next.addResourceBundle('en', 'rolesPage', en);
i18next.addResourceBundle('ar', 'rolesPage', ar);
i18next.addResourceBundle('fr', 'rolesPage', fr);

const RolesConfig = {
  settings: {
    layout: {
      config: {},
    },
    permissionName: 'ROLE',
  },
  routes: [
    {
      path: 'roles',
      element: <Roles />,
    },
  ],
};

export default RolesConfig;
