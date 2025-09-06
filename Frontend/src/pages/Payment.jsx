import React, { useState, useEffect } from 'react';
import { CircleCheckBig, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initiateSubscriptionPayment } from '../services/subscriptionAPI';
import toast from 'react-hot-toast';
import { useJobs } from '../context/JobsContext';

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const { userRole } = useAuth();
  const { subsDetail, subsTxRef, verifyPayment } = useJobs();
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'success', 'failed'
  const [err, setErr] = useState(null);

  // ✅ Helper to calculate next payment date
  const getNextPaymentDate = (type, createdAt) => {
    if (!createdAt) return null;
    const baseDate = new Date(createdAt);
    if (type === 'monthly') {
      baseDate.setMonth(baseDate.getMonth() + 1);
    } else {
      baseDate.setFullYear(baseDate.getFullYear() + 1);
    }
    return baseDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      if (!subsTxRef) {
        setVerificationStatus('failed');
        setErr('No transaction reference found. Please try again from the payment page.');
        return;
      }

      try {
        const data = await verifyPayment(subsTxRef);
        if (data && data.status === 'success') {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('failed');
          setErr(data?.message || 'Payment verification failed.');
        }
      } catch (err) {
        setVerificationStatus('failed');
        setErr(err.message || 'An error occurred during verification.');
      }
    };

    verifyPaymentStatus();
  }, [subsTxRef]);

  const monthbill = 100;
  const yearlyBill = 1000;

  const handleInitiatePayment = async (subscriptionType) => {
    setLoading(true);
    try {
      const res = await initiateSubscriptionPayment(subscriptionType);
      toast.success("Payment Initiated Successfully.");
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
      }
    } catch (err) {
      console.error('Failed to initiate payment:', err);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

//   const hasPaid = subsDetail?.status === 'success';
const statusP = subsDetail?.status === 'success';
const roleCheck = subsDetail?.payRole === userRole;
const hasPaid = statusP  && roleCheck;
  const nextDueDate = getNextPaymentDate(subsDetail?.subscriptionType, subsDetail?.createdAt);

  return (
    <div className="min-h-screen font-sans bg-gray-50 flex items-center justify-center p-4">
      <div className="container mx-auto max-w-5xl bg-white rounded-3xl shadow-lg p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <Link
            to={`/${userRole}`}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="inline mr-2" />
            Go Back
          </Link>
          <h1 className="text-xl font-bold text-gray-900 text-center flex-grow">
            Choose how you would like to pay
          </h1>
          <div className="w-20"></div>
        </header>

        {loading && <div className="text-center text-blue-500 mb-4">Processing payment...</div>}
        {err && <div className="text-center text-red-500 mb-4">{err}</div>}

        {hasPaid && (
          <div className="text-green-500 p-2 mb-2 text-center font-semibold">
            {`Current ${subsDetail.subscriptionType} bill is done, next payment is on: ${nextDueDate}`}
          </div>
        )}

        {/* Payment Cards */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Monthly Payment */}
          <div
            className={`flex-1 rounded-3xl p-8 flex flex-col justify-between ${
              hasPaid ? 'bg-gray-200 cursor-not-allowed' : 'bg-white border-3 border-blue-600'
            }`}
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Monthly Subscription</h2>
              <p className="text-5xl font-extrabold text-blue-600 mb-6">
                {monthbill}ETB{' '}
                <span className="text-lg font-medium text-gray-500">per Month</span>
              </p>
              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-start space-x-3">
                  <CircleCheckBig />
                  <span className="flex-1 leading-relaxed">
                    <strong className="font-semibold">Flexibility:</strong> Ideal for short-term
                    needs or testing the service.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CircleCheckBig />
                  <span className="flex-1 leading-relaxed">
                    <strong className="font-semibold">No Long-term Commitment:</strong> Cancel
                    anytime without penalty.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CircleCheckBig />
                  <span className="flex-1 leading-relaxed">
                    <strong className="font-semibold">Lower Initial Cost:</strong> Easier upfront
                    payment for those on a tight budget.
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => handleInitiatePayment('monthly')}
                className={`mt-6 w-full text-center font-bold py-4 rounded-xl shadow-lg transition-colors ${
                  hasPaid
                    ? 'bg-gray-400 text-gray-700'
                    : 'text-white bg-blue-600 hover:bg-blue-700 cursor-pointer'
                }`}
                disabled={loading || hasPaid}
              >
                {hasPaid
                  ? 'Already Subscribed'
                  : loading
                  ? 'Processing...'
                  : 'Pay for monthly access'}
              </button>
            </div>
          </div>

          {/* Yearly Payment */}
          <div
            className={`flex-1 rounded-3xl shadow-xl p-8 relative flex flex-col justify-between ${
              hasPaid ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-900 text-white'
            }`}
          >
            <div className="absolute top-6 -right-3 transform rotate-45 bg-red-500 text-white text-xs font-bold px-8 py-1 rounded-full shadow-md">
              Save 20%
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Yearly Subscription</h2>
              <p className="text-5xl font-extrabold text-green-400 mb-6">
                {yearlyBill}ETB{' '}
                <span className="text-lg font-medium text-gray-300">per Year</span>
              </p>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-start space-x-3">
                  <CircleCheckBig />
                  <span className="flex-1 leading-relaxed">
                    <strong className="font-semibold">Cost Savings:</strong> Save 20% compared to
                    paying monthly.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CircleCheckBig />
                  <span className="flex-1 leading-relaxed">
                    <strong className="font-semibold">Continuous Access:</strong> Ensures
                    uninterrupted service.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CircleCheckBig />
                  <span className="flex-1 leading-relaxed">
                    <strong className="font-semibold">Exclusive Features:</strong> Access to
                    members-only content.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CircleCheckBig />
                  <span className="flex-1 leading-relaxed">
                    <strong className="font-semibold">Priority Support:</strong> Faster customer
                    service response times.
                  </span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleInitiatePayment('yearly')}
              className={`mt-8 w-full text-center font-bold py-4 rounded-xl shadow-lg transition-colors ${
                hasPaid
                  ? 'bg-gray-400 text-gray-700'
                  : 'text-white bg-green-500 hover:bg-green-600 cursor-pointer'
              }`}
              disabled={loading || hasPaid}
            >
              {hasPaid
                ? 'Already Subscribed'
                : loading
                ? 'Processing...'
                : 'Pay for yearly access'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
