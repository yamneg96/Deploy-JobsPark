import API from './axios';

//PAYMENT API Request.
export const createPaymentRequest = async (clientId, amount, message) => {
  try {
    const res = await API.post('/payment-requests/', {
      client_id: clientId,
      amount,
      message,
    });
    return res.data;
  } catch (error) {
    console.error("Failed to request: ", error); // Changed from console.log to console.error
    throw error; // Propagate the error to the caller
  }
};

// New function to fetch client's payment requests
export const getClientPaymentRequests = async () => {
  try {
    const res = await API.get('/payment-requests/client');
    // console.log(res.data);
    return res.data; // The server sends an object with a 'requests' key
  } catch (error) {
    console.error("Failed to fetch client payment requests: ", error);
    throw error;
  }
};

// New function to fetch client's payment requests for worker.
export const getWorkerPaymentRequests = async () => {
  try {
    const res = await API.get('/payment-requests/worker');
    return res.data; // The server sends an object with a 'requests' key
  } catch (error) {
    console.error("Failed to fetch worker payment requests: ", error);
    throw error;
  }
};

// New function to update a payment request's status
export const updatePaymentRequestStatus = async (requestId, status) => {
  try {
    const res = await API.put(`/payment-requests/${requestId}`, { status });
    return res.data;
  } catch (error) {
    console.error("Failed to update payment request status: ", error);
    throw error;
  }
};

//Payment Initiate API.
export const initiatePayment = async (workerId, amount) => {
  try {
    const res = await API.post('/payments', { workerId, amount });
    return res.data;
  } catch (error) {
    console.error("Failed to initiate payment:", error);
    throw error;
  }
};

//Verify Payment
export const verifyPayment = async(tx_ref) => {
  try {
    const res = await API.get(`/payments/verify/${tx_ref}`);
    return res.data;
  } catch (error) {
    console.log('payment verification failed.', error);
  }
};

//Webhook
export const webhook = async() => {
  try {
    const res = await API.post('/applications/webhook');
    return res.data;
  } catch (error) {
    console.log('Error getting webhook', error);
  }
}