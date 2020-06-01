import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ErrorPage from 'components/ErrorPage';
import googleIcon from 'assets/images/google.png';
import fbIcon from 'assets/images/fb.svg';
import Button from 'components/Button';
import Header from 'components/Header';
import Footer from 'components/Footer';
import saveOfferId from 'util/offerIdHelper';
import savePublisherId from 'util/publisherIdHelper';
import labeling from 'containers/labeling';
import Auth from 'services/auth';

import {
  ContentWrapperStyled,
  SocialStyled,
  SeparatorStyled
} from './LoginStyled';
import LoginForm from './LoginForm';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offerId: '',
      publisherId: '',
      isOfferError: false
    };
  }

  componentDidMount() {
    const { urlProps } = this.props;
    saveOfferId(urlProps.location, this.setOfferId);
    savePublisherId(urlProps.location, this.setPublisherId);
    Auth.isLogged();
  }

  setOfferId = value => this.setState({ offerId: value });

  setPublisherId = value => this.setState({ publisherId: value });

  setOfferError = value => this.setState({ isOfferError: value });

  render() {
    const { isOfferError, offerId, publisherId } = this.state;
    const { isMyAccount, t } = this.props;
    return isOfferError ? (
      <ErrorPage
        type="offerNotExist"
        resetError={() => this.setOfferError(false)}
      />
    ) : (
      <>
        <Header />
        <ContentWrapperStyled>
          <LoginForm
            t={t}
            offerId={offerId}
            publisherId={publisherId}
            setOfferError={this.setOfferError}
            isMyAccount={isMyAccount}
          />
          {!isMyAccount && (
            <>
              <Button isLink to={{ pathname: '/register' }} theme="secondary">
                {t('Go to register')}
              </Button>
              <SocialStyled>
                <SeparatorStyled>{t('Or sign in with')}</SeparatorStyled>
                <Button
                  theme="simple"
                  size="small"
                  fontSize="13px"
                  label={t('Sign in with Facebook')}
                  icon={fbIcon}
                >
                  Facebook
                </Button>
                <Button
                  theme="simple"
                  size="small"
                  fontSize="13px"
                  label={t('Sign in with Google')}
                  icon={googleIcon}
                >
                  Google
                </Button>
              </SocialStyled>
            </>
          )}
          <Button
            isLink
            to={{
              pathname: '/reset-password',
              fromMyAccount: isMyAccount
            }}
            theme="link"
          >
            {t('Forgot password?')}
          </Button>
        </ContentWrapperStyled>
        <Footer />
      </>
    );
  }
}
Login.propTypes = {
  urlProps: PropTypes.shape({
    location: PropTypes.shape({ search: PropTypes.string })
  }),
  isMyAccount: PropTypes.bool,
  t: PropTypes.func
};
Login.defaultProps = {
  urlProps: {},
  isMyAccount: false,
  t: k => k
};

export { Login as PureLogin };

export default withTranslation()(labeling()(Login));
