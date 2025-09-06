import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircleCheckBig, XCircle, ArrowLeft } from 'lucide-react';
import { useJobs } from '../context/JobsContext';

const SubsPay = () => {
    const location = useLocation();

    const { userRole } = useAuth();
    const {verifyPayment} = useJobs();

    const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'success', 'failed'
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const txRefFromQuery = query.get('tx_ref');

        const verifyPaymentStatus = async () => {
            if (!txRefFromQuery) {
                setVerificationStatus('failed');
                setError('No transaction reference found in the URL.');
                return;
            }

            try {
                const data = await verifyPayment(txRefFromQuery);
                
                setPaymentDetails(data);
                if (data && data.status === 'success') {
                    setVerificationStatus('success');
                } else {
                    setVerificationStatus('failed');
                    setError(data.message || 'Payment verification failed.');
                }
            } catch (err) {
                setVerificationStatus('failed');
                setError(err.message || 'An error occurred during verification.');
            }
        };
    verifyPaymentStatus();
    }, [location, verificationStatus]);

    const renderContent = () => {
        switch (verificationStatus) {
            case 'pending':
                return (
                    <div className="flex flex-col items-center">
                        <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-gray-700">Verifying your payment, please wait...</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center">
                        <CircleCheckBig className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
                        <p className="text-lg text-gray-600 mb-6">Your subscription has been activated.</p>
                        <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Subscription Details</h2>
                            {paymentDetails && (
                                <div className="space-y-2 text-left">
                                    <p><strong>Amount Paid:</strong> {paymentDetails.amount} ETB</p>
                                    <p><strong>Subscription Type:</strong> {paymentDetails.subscriptionType}</p>
                                    <p><strong>Transaction Ref:</strong> {paymentDetails.chapaTxRef}</p>
                                    <p><strong>Date:</strong> {new Date(paymentDetails.createdAt).toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'failed':
                return (
                    <div className="text-center">
                        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Payment Failed</h1>
                        <p className="text-lg text-red-600 mb-6">{error || 'There was an issue processing your payment.'}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl w-full">
                {renderContent()}
                <div className="mt-8 text-center">
                    <Link to={`/${userRole}`} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Go to your Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SubsPay;