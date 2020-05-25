/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallow } from 'enzyme';
import getCustomerSubscriptionsRequest from 'api/getCustomerSubscriptions';
import getCustomerRequest from 'api/getCustomer';
import getCustomerConsentsRequest from 'api/getCustomerConsents';

import MyAccount from './MyAccount.component';

jest.mock('../../api/getCustomerSubscriptions');
jest.mock('../../api/getCustomer');
jest.mock('../../api/getCustomerConsents');

jest.mock('containers/labeling', () => () => Component => props => (
  <Component t={k => k} {...props} />
));
jest.mock('react-i18next', () => ({
  withTranslation: () => Component => props => (
    <Component t={k => k} {...props} />
  )
}));
const getCustomerSubscriptionsMock = jest.fn();
const getCustomerMock = jest.fn();
const getCustomerConsentsMock = jest.fn();

const customerData = {
  id: 338816933,
  email: 'user@example.com',
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  country: 'GB',
  companyName: null,
  phoneNumber: null,
  addressLine1: null,
  addressLine2: null,
  city: null,
  state: null,
  postalCode: null,
  regDate: '2020-02-12 15:18:56',
  lastLoginDate: '2020-02-21 07:13:49',
  transactions: '6',
  payment: 'mc',
  termsAccepted: 'no',
  marketingOptIn: 'no',
  lastUserIp: '213.156.120.102',
  externalId: '',
  externalData: null
};
const subscriptionsData = {
  items: [
    {
      offerId: 'S937144802_UA',
      status: 'active',
      expiresAt: 1582706082,
      nextPaymentPrice: 14.4,
      nextPaymentCurrency: 'EUR',
      paymentGateway: 'adyen',
      paymentMethod: 'mc',
      offerTitle: 'Monthly subscription with 7 days trial',
      period: 'month'
    },
    {
      offerId: 'S249781156_UA',
      status: 'active',
      expiresAt: 1597917717,
      nextPaymentPrice: 45.04,
      nextPaymentCurrency: 'EUR',
      paymentGateway: 'adyen',
      paymentMethod: 'mc',
      offerTitle: '6-Month without trial',
      period: '6months'
    }
  ]
};
const customerConsents = [
  {
    customerId: '338816933',
    name: 'broadcaster_marketing',
    required: false,
    state: 'declined',
    version: '2',
    needsUpdate: false,
    label:
      'Yes, I want to receive Very important company and d3.ru updates by email. TEST',
    value:
      'Yes, I want to receive Very important company and d3.ru updates by email. TEST',
    newestVersion: '2',
    date: 1588942073
  },
  {
    customerId: '338816933',
    name: 'terms',
    required: true,
    state: 'accepted',
    version: '1',
    needsUpdate: false,
    label:
      'I accept the <a href="https://cleeng.com/cleeng-user-agreement" target="_blank">Terms and Conditions</a> of Cleeng.',
    value: 'https://cleeng.com/cleeng-user-agreement',
    newestVersion: '1',
    date: 1588942073
  }
];
const setCurrentPlanMock = jest.fn();
const setCurrentUserMock = jest.fn();
const setConsentsMock = jest.fn();
const setConsentsErrorMock = jest.fn();

describe('<MyAccount/>', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const defaultProps = {
    setCurrentPlan: setCurrentPlanMock,
    setCurrentUser: setCurrentUserMock,
    setConsents: setConsentsMock,
    setConsentsError: setConsentsErrorMock
  };
  describe('@renders', () => {
    it('should fetch currentPlan, customer and consents on componentDidMount', done => {
      getCustomerSubscriptionsRequest.mockImplementationOnce(
        getCustomerSubscriptionsMock.mockResolvedValue({
          responseData: subscriptionsData,
          errors: []
        })
      );
      getCustomerRequest.mockImplementationOnce(
        getCustomerMock.mockResolvedValue({
          responseData: customerData,
          errors: []
        })
      );
      getCustomerConsentsRequest.mockImplementationOnce(
        getCustomerConsentsMock.mockResolvedValue({
          responseData: { consents: customerConsents },
          errors: []
        })
      );
      shallow(
        <MyAccount
          {...defaultProps}
          planDetails={{ currentPlan: [] }}
          userProfile={{ user: null, consents: [] }}
        />
      );
      setImmediate(() => {
        expect(setCurrentUserMock).toHaveBeenCalled();
        expect(setCurrentUserMock).toHaveBeenCalledWith(customerData);
        expect(setCurrentPlanMock).toHaveBeenCalledWith(
          subscriptionsData.items
        );
        expect(setConsentsMock).toHaveBeenCalledWith(customerConsents);
        done();
      });
    });
    it('should store errors if cannot fetch getCustomerSubscriptions', done => {
      const returnedErrors = ['Some error'];
      getCustomerSubscriptionsRequest.mockImplementationOnce(
        getCustomerSubscriptionsMock.mockResolvedValue({
          responseData: {},
          errors: returnedErrors
        })
      );
      const wrapper = shallow(
        <MyAccount
          {...defaultProps}
          planDetails={{ currentPlan: [] }}
          userProfile={{
            user: { email: 'example@user.com' },
            consents: [{ name: 'mock' }]
          }}
        />
      );
      setImmediate(() => {
        expect(setCurrentPlanMock).not.toHaveBeenCalled();
        expect(wrapper.state('errors')).toEqual(returnedErrors);
        done();
      });
    });
    it('should store errors if cannot fetch getCustomer', done => {
      const returnedErrors = ['Some error'];
      getCustomerRequest.mockImplementationOnce(
        getCustomerMock.mockResolvedValue({
          responseData: {},
          errors: returnedErrors
        })
      );
      const wrapper = shallow(
        <MyAccount
          {...defaultProps}
          planDetails={{ currentPlan: subscriptionsData.items }}
          userProfile={{ user: null, consents: [{ name: 'mock' }] }}
        />
      );
      setImmediate(() => {
        expect(wrapper.state().errors).toEqual(returnedErrors);
        expect(setCurrentUserMock).not.toHaveBeenCalled();
        done();
      });
    });
    it('should store errors if cannot fetch getCustomerConsents', done => {
      const returnedErrors = ['Some error'];
      getCustomerConsentsRequest.mockImplementationOnce(
        getCustomerConsentsMock.mockResolvedValue({
          responseData: {},
          errors: returnedErrors
        })
      );
      shallow(
        <MyAccount
          {...defaultProps}
          planDetails={{ currentPlan: subscriptionsData.items }}
          userProfile={{ user: { email: 'example@user.com' }, consents: [] }}
        />
      );
      setImmediate(() => {
        expect(setConsentsMock).not.toHaveBeenCalled();
        expect(setConsentsErrorMock).toHaveBeenCalled();
        done();
      });
    });
    it('should setConsentsError if cannot fetch getCustomerConsents', done => {
      const returnedErrors = ['Some error'];
      getCustomerConsentsRequest.mockImplementationOnce(
        getCustomerConsentsMock.mockRejectedValue([...returnedErrors])
      );
      shallow(
        <MyAccount
          {...defaultProps}
          planDetails={{ currentPlan: subscriptionsData.items }}
          userProfile={{ user: { email: 'example@user.com' }, consents: [] }}
        />
      );
      setImmediate(() => {
        expect(setConsentsMock).not.toHaveBeenCalled();
        expect(setConsentsErrorMock).toHaveBeenCalled();
        done();
      });
    });
  });
  describe('@update', () => {
    const CONSENTS = {
      termsUpdateRequired: [
        {
          customerId: '338816933',
          name: 'terms',
          required: true,
          state: 'declined',
          version: '1',
          needsUpdate: false,
          label:
            'I accept the <a href="https://cleeng.com/cleeng-user-agreement" target="_blank">Terms and Conditions</a> of Cleeng.',
          value: 'https://cleeng.com/cleeng-user-agreement',
          newestVersion: '2',
          date: 1588942073
        }
      ],
      consentsUpdateRequired: [
        {
          customerId: '338816933',
          name: 'broadcaster_marketing',
          required: false,
          state: 'declined',
          version: '1',
          needsUpdate: true,
          label:
            'I accept the <a href="https://cleeng.com/cleeng-user-agreement" target="_blank">Terms and Conditions</a> of Cleeng.',
          value: 'https://cleeng.com/cleeng-user-agreement',
          newestVersion: '2',
          date: 1588942073
        }
      ],
      notCheckedTerms: [
        {
          customerId: '338816933',
          name: 'terms',
          required: true,
          state: 'declined',
          version: '1',
          needsUpdate: false,
          label:
            'I accept the <a href="https://cleeng.com/cleeng-user-agreement" target="_blank">Terms and Conditions</a> of Cleeng.',
          value: 'https://cleeng.com/cleeng-user-agreement',
          newestVersion: '1',
          date: 1588942073
        }
      ],
      defaultConsents: [
        {
          customerId: '338816933',
          name: 'terms',
          required: true,
          state: 'accepted',
          version: '1',
          needsUpdate: false,
          label:
            'I accept the <a href="https://cleeng.com/cleeng-user-agreement" target="_blank">Terms and Conditions</a> of Cleeng.',
          value: 'https://cleeng.com/cleeng-user-agreement',
          newestVersion: '1',
          date: 1588942073
        }
      ],
      hidePopup: [
        {
          customerId: '338816933',
          name: 'terms',
          required: true,
          state: 'accepted',
          version: '1',
          needsUpdate: false,
          label:
            'I accept the <a href="https://cleeng.com/cleeng-user-agreement" target="_blank">Terms and Conditions</a> of Cleeng.',
          value: 'https://cleeng.com/cleeng-user-agreement',
          newestVersion: '1',
          date: 1588942073
        }
      ]
    };
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should render notCheckedTerms layout', () => {
      const wrapper = shallow(
        <MyAccount
          {...defaultProps}
          planDetails={{ currentPlan: subscriptionsData.items }}
          userProfile={{
            user: { email: 'example@user.com' },
            consents: CONSENTS.defaultConsents
          }}
        />
      );
      wrapper.setProps({ userProfile: { consents: CONSENTS.notCheckedTerms } });
      expect(wrapper.state('isTermsPopupOpen')).toBe(true);
      expect(wrapper.state('popupType')).toBe('notCheckedTerms');
      expect(wrapper.state('popupConsents')).toEqual(CONSENTS.notCheckedTerms);
    });
    it('should render complexUpdate layout', () => {
      const wrapper = shallow(
        <MyAccount
          {...defaultProps}
          planDetails={{ currentPlan: subscriptionsData.items }}
          userProfile={{
            user: { email: 'example@user.com' },
            consents: CONSENTS.defaultConsents
          }}
        />
      );
      wrapper.setProps({
        userProfile: {
          consents: [
            ...CONSENTS.consentsUpdateRequired,
            ...CONSENTS.termsUpdateRequired
          ]
        }
      });
      expect(wrapper.state('isTermsPopupOpen')).toBe(true);
      expect(wrapper.state('popupType')).toBe('complexUpdate');
      expect(wrapper.state('popupConsents')).toEqual([
        ...CONSENTS.termsUpdateRequired,
        ...CONSENTS.consentsUpdateRequired
      ]);
    });
    it('should render termsUpdateRequired layout', () => {
      const wrapper = shallow(
        <MyAccount
          {...defaultProps}
          planDetails={{ currentPlan: subscriptionsData.items }}
          userProfile={{
            user: { email: 'example@user.com' },
            consents: CONSENTS.defaultConsents
          }}
        />
      );
      wrapper.setProps({
        userProfile: { consents: CONSENTS.termsUpdateRequired }
      });
      expect(wrapper.state('isTermsPopupOpen')).toBe(true);
      expect(wrapper.state('popupType')).toBe('termsUpdateRequired');
      expect(wrapper.state('popupConsents')).toEqual(
        CONSENTS.termsUpdateRequired
      );
    });

    it('should render consentsUpdateRequired layout', () => {
      const wrapper = shallow(
        <MyAccount
          {...defaultProps}
          planDetails={{ currentPlan: subscriptionsData.items }}
          userProfile={{
            user: { email: 'example@user.com' },
            consents: CONSENTS.defaultConsents
          }}
        />
      );
      wrapper.setProps({
        userProfile: { consents: CONSENTS.consentsUpdateRequired }
      });
      expect(wrapper.state('isTermsPopupOpen')).toBe(true);
      expect(wrapper.state('popupType')).toBe('consentsUpdateRequired');
      expect(wrapper.state('popupConsents')).toEqual(
        CONSENTS.consentsUpdateRequired
      );
    });

    it('should hidepopup if consents are valid', () => {
      const wrapper = shallow(
        <MyAccount
          {...defaultProps}
          planDetails={{ currentPlan: subscriptionsData.items }}
          userProfile={{
            user: { email: 'example@user.com' },
            consents: CONSENTS.defaultConsents
          }}
        />
      );
      wrapper.setProps({
        userProfile: { consents: CONSENTS.hidePopup }
      });
      expect(wrapper.state('isTermsPopupOpen')).toBe(false);
      expect(wrapper.state('popupType')).toBe('');
      expect(wrapper.state('popupConsents')).toEqual([]);
    });
  });
});
