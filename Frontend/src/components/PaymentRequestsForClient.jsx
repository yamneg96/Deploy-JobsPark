import React, { useEffect, useState } from 'react';
import { useJobs } from '../context/JobsContext';
import { DollarSign, MessageSquare, UserCheck, XCircle, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PaymentRequestsForClient = () => {
  const { 
    clientPaymentReqs, 
    clientPaymentReqLoading, 
    clientPaymentReqError, 
    updateClientPaymentStatus,
    handlePayment
  } = useJobs();
  const { user, wPic } = useAuth();

  // useEffect(() => {
  //   console.log(clientPaymentReqs);
  // }, [user]);
  
  const handleUpdateStatus = async (requestId, newStatus) => {
    await updateClientPaymentStatus(requestId, newStatus);
  };

  const handlePay = async (workerId, amount) => {
    await handlePayment(workerId, amount);
  };

  if (clientPaymentReqLoading) {
    return <div className="text-center p-4">Loading payment requests...</div>;
  }

  if (clientPaymentReqError) {
    return <div className="text-center p-4 text-red-500">{clientPaymentReqError}</div>;
  }

  if (clientPaymentReqs.length === 0) {
    return <div className="text-center p-4 text-gray-500">You have no payment requests.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Worker's Payment Requests</h1>
      <div className="space-y-4">
        {clientPaymentReqs.map((request) => (
          <div key={request._id} className="bg-white rounded-3xl hover:shadow-md overflow-hidden p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={request.worker_id.image || wPic}
                  alt={request.worker_id.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-400"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-700">{request.worker_id.name}</h2>
                  <p className="text-sm text-gray-500">{request.worker_id.email}</p>
                </div>
              </div>
              <span 
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
            
            <div className="space-y-2 text-gray-600 mb-4">
              <div className="flex items-center">
                <DollarSign size={20} className="mr-2 text-green-500" />
                <p>
                  <span className="font-bold">Amount(ETB):</span> {request.amount}
                </p>
              </div>
              <div className="flex items-start">
                <MessageSquare size={20} className="mr-2 text-blue-500" />
                <p>
                  <span className="font-bold">Message:</span> {request.message}
                </p>
              </div>
            </div>
            
            {request.status === 'pending' && (
              <div className="flex space-x-4 justify-end">
                <button
                  onClick={() => handleUpdateStatus(request._id, 'accepted')}
                  className="cursor-pointer flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <CheckCheck size={20} className="mr-2" /> Accept
                </button>
                <button
                  onClick={() => handleUpdateStatus(request._id, 'rejected')}
                  className="cursor-pointer flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <XCircle size={20} className="mr-2" /> Decline
                </button>
              </div>
            )}
            {request.status === 'accepted' && (
              <div className="flex space-x-4 justify-end">
                <button
                  onClick={() => handlePay(request.worker_id._id, request.amount)}
                  className="cursor-pointer flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <UserCheck size={20} className="mr-2" /> Pay
                </button>
                <button
                  onClick={() => handleUpdateStatus(request._id, 'rejected')}
                  className="cursor-pointer flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <XCircle size={20} className="mr-2" /> Decline
                </button>
              </div>
            )}
            {request.status === 'rejected' && (
              <div className="flex space-x-4 justify-end">
                <button
                  onClick={() => handleUpdateStatus(request._id, 'accepted')}
                  className="cursor-pointer flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <CheckCheck size={20} className="mr-2" /> Re-accept
                </button>
                <button
                  disabled
                  className="cursor-not-allowed flex items-center px-4 py-2 bg-red-500 text-white rounded-lg transition-colors opacity-50"
                >
                  <XCircle size={20} className="mr-2" /> Declined
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentRequestsForClient;
