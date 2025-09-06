import React, { useEffect, useState } from 'react';
import { useJobs } from '../context/JobsContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { verifyPayment } from '../services/paymentAPI';
import {Link} from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa';
import { X } from 'lucide-react'

const PayReturn = () => {
    const { clientId, userRole } = useAuth();
    const {payStatus, setPayStatus} = useJobs();
    const location = useLocation();
    const [returnPayInfo, setReturnPayInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const verifyPaymentInfo = async (tx_ref) => {
        try {
            const res = await verifyPayment(tx_ref);
            console.log(res);
            setReturnPayInfo(res);
            setPayStatus(res.success);
        } catch (error) {
            console.log('Error verifying payment:', error);
            setError("Failed to verify payment.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const txRefFromQuery = query.get('tx_ref');
        if (txRefFromQuery) {
            verifyPaymentInfo(txRefFromQuery);
        }
    }, [location]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-gray-600 text-lg">Verifying payment, please wait...</div>
        </div>;
    }

    const isSuccess = returnPayInfo?.chapa?.status === 'success';
    const cardColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    const cardShadow = isSuccess ? 'shadow-green-200' : 'shadow-red-200';
    const icon = isSuccess ? <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto" /> : <X className="w-16 h-16 text-red-500 mx-auto" />;

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4'>
            <h1 className='text-center font-bold text-5xl mb-8 p-2 bg-gradient-to-r bg-clip-text from-blue-600 to-green-600 text-transparent'>
                Payment Summary
            </h1>
            {error && <div className="text-red-600 font-medium mb-4">{error}</div>}
            
            <div className={`w-full max-w-xl p-8 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 ${cardColor} ${cardShadow}`}>
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    {icon}
                    <h2 className={`text-3xl font-bold ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                        {isSuccess ? 'Payment Successful!' : 'Payment Failed!'}
                    </h2>
                    <p className="text-gray-600 text-lg">
                        {isSuccess ? 'Thank you for your payment. Details are below.' : 'Your payment could not be processed. Please try again or contact support.'}
                    </p>
                </div>

                {isSuccess && (
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between items-center border-b pb-2 border-gray-300">
                            <span className="text-gray-500 font-medium">Customer Name:</span>
                            <span className="text-gray-900 font-semibold text-lg">{returnPayInfo?.chapa?.data?.first_name} {returnPayInfo?.chapa?.data?.last_name}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2 border-gray-300">
                            <span className="text-gray-500 font-medium">Customer Email:</span>
                            <span className="text-gray-900 font-semibold text-lg">{returnPayInfo?.chapa?.data?.email}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2 border-gray-300">
                            <span className="text-gray-500 font-medium">Amount:</span>
                            <span className="text-gray-900 font-semibold text-lg">{returnPayInfo?.chapa?.data?.amount} {returnPayInfo?.chapa?.data?.currency}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2 border-gray-300">
                            <span className="text-gray-500 font-medium">Charge:</span>
                            <span className="text-gray-900 font-semibold text-lg">{returnPayInfo?.chapa?.data?.charge} {returnPayInfo?.chapa?.data?.currency}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2 border-gray-300">
                            <span className="text-gray-500 font-medium">Status:</span>
                            <span className="text-green-600 font-semibold text-lg capitalize">{returnPayInfo?.chapa?.status}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2 border-gray-300">
                            <span className="text-gray-500 font-medium">Transaction Reference:</span>
                            <span className="text-gray-900 font-semibold text-lg">{returnPayInfo?.chapa?.data?.tx_ref}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium">Date:</span>
                            <span className="text-gray-900 font-semibold text-lg">{new Date(returnPayInfo?.chapa?.data?.created_at).toLocaleString()}</span>
                        </div>
                        <div className='flex justify-end items-center text-white font-bold'>
                          <Link 
                          to={`${BASE_URL}/review-page`}
                          className='cursor-pointer bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl p-3'>
                            Done
                          </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PayReturn;