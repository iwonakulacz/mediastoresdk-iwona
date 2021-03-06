import { getData } from 'util/appConfigHelper';
import fetchWithJWT from 'util/fetchHelper';

const submitPayPalPayment = async () => {
  const orderId = parseInt(getData('CLEENG_ORDER_ID') || '0', 10);
  const url = `https://mediastoreapi-sandbox.cleeng.com/connectors/paypal/v1/tokens`;

  const redirectUrls = {
    successUrl:
      getData('CLEENG_PP_SUCCESS') || `${window.location.origin}/thankyou`,
    cancelUrl: getData('CLEENG_PP_CANCEL') || `${window.location.origin}/offer`,
    errorUrl: getData('CLEENG_PP_ERROR') || `${window.location.origin}/offer`
  };

  try {
    const res = await fetchWithJWT(url, {
      method: 'POST',
      body: JSON.stringify({ orderId, ...redirectUrls })
    });
    return res.json();
  } catch (e) {
    return e;
  }
};

export default submitPayPalPayment;
