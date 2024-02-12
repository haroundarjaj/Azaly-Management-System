import FuseUtils from '@fuse/utils';
import AppContext from 'app/AppContext';
import { Component, useContext } from 'react';
import { matchRoutes } from 'react-router-dom';
import withRouter from '@fuse/core/withRouter';
import history from '@history';
import { AbilityContext } from 'src/app/auth/Can';
import AccessDeniedPage from 'src/app/main/403/AccessDeniedPage';

let loginRedirectUrl = null;
const allowedPaths = ["/", "/dashboard", "/sign-in", "/sign-up", "/sign-out", "/404", "/403"]

function FuseAuthorizationFunc(props) {
  const ability = useContext(AbilityContext);

  return <FuseAuthorization {...props} ability={ability} />
}
class FuseAuthorization extends Component {
  constructor(props, context) {
    super(props);
    const { routes } = context;
    this.state = {
      accessGranted: true,
      routes,
    };
    this.defaultLoginRedirectUrl = props.loginRedirectUrl || '/';
  }

  componentDidMount() {
    if (!localStorage.getItem('user')) {
      this.redirectRoute();
    } else if (!this.state.accessGranted) {
      history.push('/403')
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.accessGranted !== this.state.accessGranted;
  }

  componentDidUpdate() {
    if (!localStorage.getItem('user')) {
      this.redirectRoute();
    }
    else if (!this.state.accessGranted) {
      history.push('/403')
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { location } = props;
    const { pathname } = location;
    const matchedRoutes = matchRoutes(state.routes, pathname);
    const matched = matchedRoutes ? matchedRoutes[0] : false;
    return {
      accessGranted: allowedPaths.includes(pathname) || props.ability.can("ACCESS", matched.route?.settings?.permissionName),
    };
  }

  redirectRoute() {
    const { location } = this.props;
    const { pathname } = location;
    const userRoles = JSON.parse(localStorage.getItem('user'))?.roles;

    const redirectUrl = loginRedirectUrl || this.defaultLoginRedirectUrl;
    /*
        User is guest
        Redirect to Login Page
        */
    if (!userRoles || userRoles.length === 0) {
      setTimeout(() => history.push('/sign-in'), 0);
      loginRedirectUrl = pathname;
    } else {
      /*
        User is member
        User must be on unAuthorized page or just logged in
        Redirect to dashboard or loginRedirectUrl
        */
      setTimeout(() => history.push(redirectUrl), 0);
      loginRedirectUrl = this.defaultLoginRedirectUrl;
    }
  }

  render() {
    // console.info('Fuse Authorization rendered', this.state.accessGranted);
    // return this.state.accessGranted ? <>{this.props.children}</> : null;
    return this.state.accessGranted ? <>{this.props.children}</> : null;
  }
}

FuseAuthorization.contextType = AppContext;

export default withRouter(FuseAuthorizationFunc);
