import * as React from 'react';
import history from '@history';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';
import jwtService from './services/jwtService';
import UserService from '../services/UserService';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    jwtService.on('onAutoLogin', () => {
      dispatch(showMessage({ message: 'Signing in with JWT' }));
      const user = JSON.parse(localStorage.getItem('user'));
      success(user, 'Signed in with JWT');
    });

    jwtService.on('onLogin', (user) => {
      success(user, 'Signed in');
      history.push({
        pathname: '/dashboard',
      });
    });

    jwtService.on('onLogout', () => {
      pass('Signed out');
      history.push({
        pathname: '/sign-in',
      });
    });

    jwtService.on('onAutoLogout', (message) => {
      pass(message);

      dispatch(logoutUser());
    });

    jwtService.on('onNoAccessToken', () => {
      pass();
    });

    jwtService.init();

    function success(user, message) {
      if (message) {
        dispatch(showMessage({ message }));
      }
      console.log(user)
      localStorage.setItem('user', JSON.stringify(user));
      setTimeout(() => {
        setWaitAuthCheck(false);
        setIsAuthenticated(true);
      }, 100)
    }

    function pass(message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      setTimeout(() => {
        setWaitAuthCheck(false);
        setIsAuthenticated(false);
      }, 100)
    }
  }, [dispatch]);

  return waitAuthCheck ? (
    <FuseSplashScreen />
  ) : (
    <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
