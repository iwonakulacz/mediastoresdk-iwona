import jwtDecode from 'jwt-decode';
import { getData, setData, removeData } from 'util/appConfigHelper';
import { getCaptureStatus, getCustomerConsents } from 'api';
import history from '../history';

class Auth {
  constructor() {
    this.isAuthenticated = false;
    this.myAccount = {
      mainPage: '/my-account/plan-details',
      loginPage: '/my-account/login'
    };
    this.checkout = {
      mainPage: '/offer',
      loginPage: '/login'
    };
    this.capturePage = '/capture';
    this.consentsPage = '/consents';
  }

  login(isMyAccount = false, email, jwt, cb = () => {}, args = []) {
    this.isAuthenticated = true;
    setData('CLEENG_AUTH_TOKEN', jwt);
    setData('CLEENG_CUSTOMER_EMAIL', email);
    cb.apply(this, args);
    const redirectUrl = isMyAccount
      ? this.myAccount.mainPage
      : this.checkout.mainPage;

    let shouldConsentsBeDisplayed = false;
    let shouldCaptureBeDisplayed = false;
    let data = {};

    const consentsResponse = getCustomerConsents().then(resp => {
      const { consents } = resp.responseData;
      shouldConsentsBeDisplayed = consents.some(
        consent =>
          consent.newestVersion > consent.version ||
          consent.needsUpdate === true
      );
    });

    const captureResponse = getCaptureStatus().then(resp => {
      if (resp.responseData.shouldCaptureBeDisplayed === true) {
        shouldCaptureBeDisplayed = true;
        data = {
          ...data,
          settings: resp.responseData.settings
        };
      }
    });

    Promise.allSettled([consentsResponse, captureResponse]).then(() => {
      data = {
        ...data,
        redirectUrl: [
          shouldCaptureBeDisplayed ? this.capturePage : null,
          shouldConsentsBeDisplayed ? this.consentsPage : null,
          redirectUrl
        ].filter(Boolean)
      };
      const currentRedirection = data.redirectUrl.shift();
      history.push(currentRedirection, data);
    });
  }

  logout(isMyAccount = false, queryParam = '') {
    this.isAuthenticated = false;
    removeData('CLEENG_AUTH_TOKEN');
    removeData('CLEENG_ORDER_ID');
    removeData('CLEENG_PP_SUCCESS');
    removeData('CLEENG_PP_CANCEL');
    removeData('CLEENG_PP_ERROR');

    history.push(
      isMyAccount
        ? this.myAccount.loginPage + queryParam
        : this.checkout.loginPage
    );
  }

  isLogged() {
    const jwt = getData('CLEENG_AUTH_TOKEN');
    if (!jwt) {
      this.isAuthenticated = false;
      return this.isAuthenticated;
    }

    const decoded = jwtDecode(jwt);
    const now = Date.now() / 1000;
    const isExpired = now > decoded.exp;
    if (isExpired) {
      this.logout();
    } else {
      this.isAuthenticated = true;
    }
    return this.isAuthenticated;
  }
}

export default new Auth();
