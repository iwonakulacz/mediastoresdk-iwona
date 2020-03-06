/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { shallow, mount } from 'enzyme';
import Input from 'components/Input';
import PasswordReset, { PurePasswordReset } from './PasswordReset';
import Button from '../Button';
import EmailInput from '../EmailInput/EmailInput';
import ResetPasswordRequest from '../../api/resetPassword';
import { FormStyled } from './PasswordResetStyled';

jest.mock('../../api/resetPassword');
jest.mock('react-router-dom', () => {
  return {
    Link: () => {
      return <div />;
    }
  };
});

const mockUrlProps = {
  location: { search: '?offer=123123' }
};

jest.mock('containers/labeling', () => () => Component => props => (
  <Component t={k => k} {...props} />
));

jest.mock('react-i18next', () => ({
  withTranslation: () => Component => props => (
    <Component t={k => k} {...props} />
  )
}));

const MockEmailValue = 'mock@email.com';
const MockInvalidEmailValue = 'mock@.com';
const MockOfferId = '762736382';
const FuncMock = jest.fn();
const MockResetPasswordFetch = jest.fn();

describe('PasswordReset', () => {
  beforeEach(() => {
    FuncMock.mockClear();
  });
  describe('@renders', () => {
    it('should render initial state', () => {
      const wrapper = mount(
        <PasswordReset onSuccess={jest.fn()} urlProps={mockUrlProps} />
      );
      const inputComponent = wrapper.find(Input);
      expect(inputComponent).toHaveLength(1);
      expect(inputComponent.props().error).toBe('');
      expect(inputComponent.props().value).toBe('');
      expect(inputComponent.props().icon).toBe('test-file-stub');

      const buttons = wrapper.find(Button);
      expect(buttons).toHaveLength(2);
    });
  });
  describe('@events', () => {
    it('should update state on email input change', () => {
      const wrapper = shallow(
        <PurePasswordReset onSuccess={jest.fn()} urlProps={mockUrlProps} />
      );
      const inputComponent = wrapper.find(EmailInput);

      inputComponent.simulate('change', MockEmailValue);
      expect(wrapper.state().value).toBe(MockEmailValue);
    });
  });
  describe('@onSubmit', () => {
    it('should call onSuccess cb when email valid', done => {
      ResetPasswordRequest.mockImplementationOnce(
        MockResetPasswordFetch.mockResolvedValue({
          errors: []
        })
      );
      const wrapper = mount(
        <PurePasswordReset onSuccess={FuncMock} urlProps={mockUrlProps} />
      );
      const formComponent = wrapper.find(FormStyled);
      wrapper.setState({
        value: MockEmailValue,
        offerId: MockOfferId
      });

      formComponent.simulate('submit');
      setImmediate(() => {
        expect(wrapper.state().message).toBe('');
        expect(FuncMock).toHaveBeenCalled();
        done();
      });
    });

    it('should not call onSuccess cb when email is not correct', done => {
      ResetPasswordRequest.mockImplementationOnce(
        MockResetPasswordFetch.mockResolvedValue({
          errors: MockEmailValue
        })
      );
      const wrapper = mount(
        <PurePasswordReset onSuccess={FuncMock} urlProps={mockUrlProps} />
      );
      const formComponent = wrapper.find(FormStyled);
      wrapper.setState({
        value: MockEmailValue,
        offerId: MockOfferId
      });

      formComponent.simulate('submit');
      setImmediate(() => {
        expect(wrapper.state().message).not.toBe('');
        expect(FuncMock).not.toHaveBeenCalled();
        done();
      });
    });

    it('should set error when email is not properly formatted', done => {
      const wrapper = mount(
        <PurePasswordReset onSuccess={FuncMock} urlProps={mockUrlProps} />
      );
      const formComponent = wrapper.find(FormStyled);
      wrapper.setState({
        value: MockInvalidEmailValue,
        offerId: MockOfferId
      });

      formComponent.simulate('submit');
      setImmediate(() => {
        expect(wrapper.state().message).not.toBe('');
        expect(FuncMock).not.toHaveBeenCalled();
        done();
      });
    });
  });
});