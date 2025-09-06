import API from './axios';

// 1. Initiate Subscription Payment
export const initiateSubscriptionPayment = async (subscriptionType) => {
    try {
        const res = await API.post('/subscription-payments/initiate', { subscriptionType });
        return res.data;
    } catch (error) {
        console.error('Error initiating subscription payment:', error.res?.data || error.message);
        throw error;
    }
};

// 2. Verify Subscription Payment
export const verifySubscriptionPayment = async (txRef) => {
    try {
        const res = await API.get(`/subscription-payments/verify/${txRef}`);
        return res.data;
    } catch (error) {
        console.error('Error verifying subscription payment:', error.res?.data || error.message);
        throw error;
    }
};

// 3. Get My Subscription Payments
export const getMySubscriptionPayments = async () => {
    try {
        const res = await API.get('/subscription-payments/my-payments');
        return res.data;
    } catch (error) {
        console.error('Error fetching user payments:', error.res?.data || error.message);
        throw error;
    }
};

// 4. Get All Payments (for admin)
export const getAllSubscriptionPayments = async () => {
    try {
        const res = await API.get('/subscription-payments/all');
        return res.data;
    } catch (error) {
        console.error('Error fetching all payments:', error.res?.data || error.message);
        throw error;
    }
};