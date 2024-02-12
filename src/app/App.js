import { useState, useEffect } from 'react';
import BrowserRouter from '@fuse/core/BrowserRouter';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import { SnackbarProvider } from 'notistack';
import { useSelector } from 'react-redux';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { selectCurrentLanguageDirection } from 'app/store/i18nSlice';
import { selectUser } from 'app/store/userSlice';
import themeLayouts from 'app/theme-layouts/themeLayouts';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import settingsConfig from 'app/configs/settingsConfig';
import withAppProviders from './withAppProviders';
import { AuthProvider } from './auth/AuthContext';
import { HashRouter, useLocation } from 'react-router-dom';
import i18next from 'i18next';
import axios from 'axios';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { Ability } from '@casl/ability';
import { AbilityContext } from './auth/Can';

/**
 * Axios HTTP Request defaults
 */
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';


import en from './utils/GeneralTranslations/en';
import ar from './utils/GeneralTranslations/ar';
import fr from './utils/GeneralTranslations/fr';
import UserService from './services/UserService';

i18next.addResourceBundle('en', 'generalTranslations', en);
i18next.addResourceBundle('ar', 'generalTranslations', ar);
i18next.addResourceBundle('fr', 'generalTranslations', fr);

const emotionCacheOptions = {
  rtl: {
    key: 'muirtl',
    stylisPlugins: [rtlPlugin],
    insertionPoint: document.getElementById('emotion-insertion-point'),
  },
  ltr: {
    key: 'muiltr',
    stylisPlugins: [],
    insertionPoint: document.getElementById('emotion-insertion-point'),
  },
};

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const langDirection = useSelector(selectCurrentLanguageDirection);
  const mainTheme = useSelector(selectMainTheme);

  const [abilities, setAbilities] = useState(
    new Ability([])
  );
  const [location, setLocation] = useState('/');

  function usePageViews() {
    const currentPath = useLocation();
    useEffect(() => {
      setLocation(currentPath.pathname);

      // ga.send(['pageview', location.pathname]);
    }, [currentPath]);
  }

  usePageViews();

  useEffect(() => {
    console.log(location)
    if ((location === "/dashboard" || location === "/") && user) {
      UserService.getUserInfo(user.id).then(response => {
        console.log(response)
        let roles = response.data?.roles;
        if (roles?.length !== 0) {
          let permissions = [];
          roles.forEach(role => {
            role.permissions?.forEach(permission => { permissions.push({ action: permission.action, subject: permission.subject }) });
          })
          setAbilities(new Ability(permissions));
        }
      })
    }
  }, [location]);

  return (
    <AbilityContext.Provider value={abilities}>
      <CacheProvider value={createCache(emotionCacheOptions[langDirection])}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <FuseTheme theme={mainTheme} direction={langDirection}>
            <AuthProvider>
              <FuseAuthorization
                loginRedirectUrl={settingsConfig.loginRedirectUrl}
              >
                <SnackbarProvider
                  maxSnack={5}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  classes={{
                    containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
                  }}
                >
                  <FuseLayout layouts={themeLayouts} />
                </SnackbarProvider>
              </FuseAuthorization>
            </AuthProvider>
          </FuseTheme>
        </LocalizationProvider>
      </CacheProvider>
    </AbilityContext.Provider>
  );
};

export default withAppProviders(App)();
