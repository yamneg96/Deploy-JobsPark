import React from 'react'
import { sendRequest } from '../services/requestAPI';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const JobRequest = ({isOpen, onClose}) => {

  const { user, userId, workerId, workerName } = useAuth();

  //States for Requesting
  const [clientId, setClientId] = useState(userId);
  const [idWorker, setIdWorker] = useState(workerId);
  const [jobId, setJobId] = useState(workerId);
  const [message, setMessage] = useState('');
  const [stat, setStat] = useState('pending');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setMessage('');
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setTimeout(()=>{
      setClientId(userId);
      setIdWorker(workerId);
      setJobId(workerId);
    }, 1000)
  }, [user, userId]);

  const handleRequestNow = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const jobRequest = await sendRequest({
        client_id: clientId, 
        worker_id: idWorker,
        job_id: jobId,
        message,
      });
      onClose();
      toast.success('Request sent successfully!');
      console.log(jobRequest);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send a request.');
      toast.error('Job Requesting Failed');
    } finally {
      setLoading(false);
    }
  };


  return (
isOpen && (
      <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-xl w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Send Request to {workerName}</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleRequestNow} className="w-full space-y-4">
              <input 
              type="hidden" 
              name="clientId"
              value={clientId}
              required
              />
              <input 
              type="hidden" 
              name="idWorker"
              value={workerId}
              required
              />
              <input 
              type="hidden" 
              name="jobId"
              value={jobId}
              />
              <textarea
                placeholder="message for worker"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows='4'
                required
              />
              {/* <select
                value={stat}
                onChange={(e) => setStat(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select> */}

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                >
                  {loading ? 'Requesting...' : 'Request Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  )
}

export default JobRequest;