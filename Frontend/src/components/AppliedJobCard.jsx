import React from 'react';
import { FaCheckCircle, FaClock, FaTimesCircle, FaLink } from 'react-icons/fa';
import { GoArrowUpRight } from "react-icons/go";
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';
import { useState, useEffect } from 'react';
import { X, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';

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

const AppliedJobCard = ({ application, onUpdate}) => {

  const {wPic, user} = useAuth();
  const {appliedStatus} = useJobs();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(application.status);
  // Function to determine the status icon and styling

  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup visibility

  useEffect(() => {
    console.log(application);
  }, [application])

  const handleRequestUpdate = async (status) => {
  setIsUpdating(true);
  try {
    const updated = await replyRequest(application._id, status);
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
      const res = await createPaymentRequest(application.client_id._id, amount, message);
      console.log('Payment request sent successfully:', res);
      toast.success('Payment request sent successfully!');
    } catch (error) {
      console.error('Failed to send payment request:', error);
      toast.error('Failed to send payment request. Please try again.');
    }
  };

  const clientName = application.client_id?.name || 'Client Name';
  // const reqMessage = request.message;

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'applied':
        return (
          <div className="flex items-center text-blue-500 font-semibold bg-blue-50 p-2 rounded-full text-xs">
            <FaCheckCircle className="mr-1" />
            Applied
          </div>
        );
      case 'accepted':
        return (
          <div className="flex items-center text-green-500 font-semibold bg-blue-50 p-2 rounded-full text-xs">
            <FaCheckCircle className="mr-1" />
            Accepted
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-yellow-600 font-semibold bg-yellow-50 p-2 rounded-full text-xs">
            <FaClock className="mr-1" />
            Pending
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center text-red-500 font-semibold bg-red-50 p-2 rounded-full text-xs">
            <FaTimesCircle className="mr-1" />
            Rejected
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-500 font-semibold bg-gray-50 p-2 rounded-full text-xs">
            <FaClock className="mr-1" />
            Status Unknown
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col p-6 bg-white rounded-2xl shadow-xl border border-gray-200 transform hover:scale-[1.02] transition-all duration-300">
        <>
        <div className="flex justify-between items-start mb-4">
        <div>
          {/* Job Title or Placeholder, since it's not in the applied data */}
          <h4 className="text-xl font-bold text-gray-800 mb-1">
            Job Application
          </h4>
          <p className="text-gray-600 font-medium">Applicant: {application?.job?.category}</p>
        </div>
        {getStatusDisplay(application.status)}
      </div>

      <div className="space-y-2 text-gray-600 mb-4">
        <div className="flex items-center">
          <FaLink className="mr-2 text-blue-500" />
          <span className="text-sm">Applicant Job: {application?.job?.title}</span>
        </div>
        <div className="flex items-center">
          <FaLink className="mr-2 text-blue-500" />
          <span className="text-sm">Job Location: {application?.job?.location}</span>
        </div>
        <div className="flex items-center">
          <FaLink className="mr-2 text-green-500" />
          <span className="text-sm">Job Description: {application?.job?.description}</span>
        </div>
        <div className="flex items-center">
          <GoArrowUpRight className="mr-2 text-yellow-500" />
          <span className="text-sm">Submitted on: {new Date(application?.appliedAt).toLocaleDateString()}</span>
        </div>
        {appliedStatus === true ? (
        <button 
        className="cursor-pointer flex items-end justify-end bg-white border-2 border-red-500 rounded-2xl py-3 px-4">
          <X className="mr-2 text-red-500" />
          <p className='text-red-500 font-semibold'>Stop Application</p>
        </button>) : (
          <>
        <button className=" cursor-not-allowed flex justify-end bg-white border-2 border-red-500 rounded-2xl py-3 px-4">
          <X className="mr-2 text-red-300" />
          <p className='text-red-300 font-semibold'>Stop Application</p>
        </button>
        <button 
        className="cursor-pointer flex justify-end bg-white border-2 border-green-500 rounded-2xl py-3 px-4">
          <BadgeCheck className="mr-2 text-green-500" />
          <p className='text-green-500 font-semibold'>Re-Apply</p>
        </button>
        </>
        )}
        {currentStatus === 'accepted' ? (
          <button
            onClick={handlePaymentRequest}
            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-500 to-red-500 text-white hover:text-white rounded-xl text-sm shadow-lg transition-colors"
            disabled={isUpdating}
          >
            Request Payment
          </button>
        ) : (
          <p className='text-gray-400'>Client must be accept your application to request a payment.</p>
        )}
      </div>
      </>
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

export default AppliedJobCard;
