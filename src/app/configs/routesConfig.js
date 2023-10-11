import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import ExampleConfig from '../main/example/ExampleConfig';
import DashboardConfig from '../main/dashboard/DashboardConfig';
import ClientsConfig from '../main/ClientsSection/clients/ClientsConfig';
import ProductsConfig from '../main/ProductsSection/products/ProductsConfig';
import CategoriesConfig from '../main/ProductsSection/categories/CategoriesConfig';
import OrdersConfig from '../main/ClientsSection/orders/OrdersConfig';

const routeConfigs = [ExampleConfig, DashboardConfig, ClientsConfig, OrdersConfig, ProductsConfig, CategoriesConfig, SignOutConfig, SignInConfig, SignUpConfig];

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
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '*',
    element: <Navigate to="404" />,
  },
];

export default routes;
