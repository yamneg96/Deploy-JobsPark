import React, { useState, useEffect } from 'react';
import { MapPin, Briefcase, X, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';
import { replyRequest } from '../services/requestAPI';
import { createPaymentRequest } from '../services/paymentAPI'; // Import the API function

// Popup component for payment request
const PaymentRequestPopup = ({ onClose, onSend, clientName }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount) {
      onSend(amount, message);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl relative w-full max-w-md mx-4">
        <button onClick={onClose} className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">Request Payment to {clientName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount (ETB)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              placeholder="e.g., Payment for completed job on [date]."
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-xl hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-2 px-4 rounded-xl transition-colors"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main RequestCard component
const RequestCard = ({ request, onUpdate }) => {
  const { cPic, wPic } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(request.status);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup visibility

  const {clientPaymentReqs} = useJobs();

  useEffect(() => {
    console.log(request);
  }, [request])

  
  const handleRequestUpdate = async (status) => {
  setIsUpdating(true);
  try {
    const updated = await replyRequest(request._id, status);
    setCurrentStatus(status);
    if (onUpdate) {
      onUpdate(updated);
    }
    toast.success(`Request ${status} successfully!`);
  } catch (error) {
    console.error("Failed to update request:", error);
    toast.error("Failed to update request. Please try again.");
  } finally {
    setIsUpdating(false);
  }
};


  const handlePaymentRequest = () => {
    setIsPopupOpen(true);
  };

  const handleSendPaymentRequest = async (amount, message) => {
    setIsPopupOpen(false);
    try {
      const res = await createPaymentRequest(request.client_id._id, amount, message);
      console.log('Payment request sent successfully:', res);
      toast.success('Payment request sent successfully!');
    } catch (error) {
      console.error('Failed to send payment request:', error);
      toast.success('Failed to send payment request. Please try again.');
    }
  };

  const clientName = request.client_id?.name || 'Client Name';
  const reqMessage = request.message;

  return (
    <div className="space-y-4 m-4">
      {/* The main card content */}
      <div className="relative rounded-2xl shadow-lg p-6 transition-all duration-300 ease-in-out border border-gray-200 hover:shadow-xl flex flex-col lg:flex-row md:flex-row sm:flex-col items-center gap-4 justify-between">
        <div className="flex gap-5 flex-col lg:flex-row md:flex-row sm:flex-col items-center">
          <img
            src={wPic}
            alt="Client Profile Picture"
            className='h-24 w-24 rounded-full object-cover border-2 border-white shadow-sm'
          />
          <div className='flex-1 flex flex-col items-center md:items-start'>
            <p className="font-bold text-lg text-gray-800">
              {clientName}
              {/* The corrected code is below */}
              {clientPaymentReqs.map((req) => {
                // Check if the payment request belongs to the current job's client and worker
                if (request.client_id?._id === req.client_id._id && request.worker_id?._id === req.worker_id) {
                  return (
                    <BadgeCheck
                      key={req._id} // Added key for unique list items
                      alt={req.status}
                      className={`ml-2 ${req.status === 'accepted' ? 'text-green-500' : req.status === 'pending' ? 'text-yellow-500' : 'text-gray-500'}`}
                    />
                  );
                }
                return null; // Important: return null for non-matching items
              })}
            </p>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <Briefcase className="w-4 h-4 mr-1 text-gray-500" />
              {reqMessage}
            </p>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1 text-gray-500" />
              Client Location
            </p>
            {currentStatus && (
              <p className={`mt-2 font-semibold ${currentStatus === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                Status: {currentStatus}
              </p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 mt-3 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => handleRequestUpdate('rejected')}
            className="cursor-pointer px-4 py-2 font-bold hover:bg-red-500 hover:text-white rounded-xl text-sm shadow-lg text-red-500 bg-white"
            disabled={isUpdating}
          >
            Reject Request
          </button>
          <button
            onClick={() => handleRequestUpdate('accepted')}
            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white hover:text-white rounded-xl text-sm shadow-lg transition-colors"
            disabled={isUpdating}
          >
            Accept Request
          </button>
        </div>
        {currentStatus === 'accepted' ? (
          <button
            onClick={handlePaymentRequest}
            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-500 to-red-500 text-white hover:text-white rounded-xl text-sm shadow-lg transition-colors"
            disabled={isUpdating}
          >
            Request Payment
          </button>
        ) : (
          <p className='text-gray-400'>You need to accept client request to request a payment.</p>
        )}

      </div>

      {isPopupOpen && (
        <PaymentRequestPopup
          onClose={() => setIsPopupOpen(false)}
          onSend={handleSendPaymentRequest}
          clientName={clientName}
        />
      )}
    </div>
  );
};

export default RequestCard;