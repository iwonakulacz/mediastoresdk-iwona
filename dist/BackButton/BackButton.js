"use strict";

var _interopRequireDefault = require("/Users/iwonakulacz/Documents/repos/msd-package-2/media-store-sdk/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PureBackButton = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactI18next = require("react-i18next");

var _Button = _interopRequireDefault(require("components/Button"));

var _labeling = _interopRequireDefault(require("containers/labeling"));

var BackButton = function BackButton(_ref) {
  var isMyAccount = _ref.isMyAccount,
      onClickFn = _ref.onClickFn,
      t = _ref.t;
  return /*#__PURE__*/_react.default.createElement(_Button.default, {
    isLink: !onClickFn,
    to: {
      pathname: isMyAccount ? '/my-account/login' : '/login'
    },
    onClickFn: onClickFn,
    theme: "navLink"
  }, t('Back to login'));
};

exports.PureBackButton = BackButton;
BackButton.defaultProps = {
  isMyAccount: false,
  onClickFn: null,
  t: function t(k) {
    return k;
  }
};

var _default = (0, _reactI18next.withTranslation)()((0, _labeling.default)()(BackButton));

exports.default = _default;