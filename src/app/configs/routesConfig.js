import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import AccessDeniedPage from '../main/403/AccessDeniedPage';
import ExampleConfig from '../main/example/ExampleConfig';
import DashboardConfig from '../main/dashboard/DashboardConfig';
import ClientsConfig from '../main/ClientsSection/clients/ClientsConfig';
import OrdersConfig from '../main/ClientsSection/orders/OrdersConfig';
import ProductsConfig from '../main/ProductsSection/products/ProductsConfig';
import SuppliersConfig from '../main/SuppliersSection/suppliers/SuppliersConfig';
import PurchasesConfig from '../main/SuppliersSection/purchases/PurchasesConfig';
import FeedstockConfig from '../main/SuppliersSection/feedstock/FeedstockConfig';
import CategoriesConfig from '../main/ProductsSection/categories/CategoriesConfig';
import UsersConfig from '../main/Administration/user/UsersConfig';
import RolesConfig from '../main/Administration/role/RolesConfig';

const routeConfigs = [
  ExampleConfig,
  DashboardConfig,
  ClientsConfig,
  OrdersConfig,
  SuppliersConfig,
  PurchasesConfig,
  FeedstockConfig,
  ProductsConfig,
  CategoriesConfig,
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  UsersConfig,
  RolesConfig
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '403',
    element: <AccessDeniedPage />,
  },
  {
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '*',
    element: <Navigate to="404" />,
  },
];

export default routes;
