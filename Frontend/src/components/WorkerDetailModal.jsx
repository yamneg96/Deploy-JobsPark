import { FaTimes, FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaTools, FaStar, FaCalendarCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import JobRequest from './JobRequest';
import { useState } from 'react';

const WorkerDetailModal = ({ 
  showWorkerDetail, 
  setShowWorkerDetail, 
  selectedWorker,
  image, 
  handleRequestNow 
}) => {

  // Modal state for different pop-up windows
  const [isJobReqOpen, setIsJobReqOpen] = useState(false);
  const handleJobReqClose = () => {
    setIsJobReqOpen(false);
  };


  if (!showWorkerDetail || !selectedWorker) return null;
  const { user } = useAuth(); // Only need the user object to check for authentication

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 backdrop-blur-xs"></div>
      
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4 border border-gray-200">
        <button 
          onClick={() => setShowWorkerDetail(false)}
          className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FaTimes size={20} />
        </button>
        
        <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
          <div className="flex-shrink-0">
            <img
              src={image}
              alt="Worker profile"
              className="h-24 w-24 rounded-full object-cover border-2 border-white shadow-sm bg-white p-1"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800">{selectedWorker.services[0] || selectedWorker.skills[0] || 'Worker'}</h3>
            <p className="text-gray-600 text-lg mb-2">{selectedWorker.bio}</p>
            
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center text-gray-600">
                <FaTools className="mr-2" />
                <span>{selectedWorker.experience_years} Years Exp.</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaStar className="mr-2" />
                <span>{selectedWorker.rating} Rating</span>
              </div>
              <div className="flex items-center text-blue-600 font-medium">
                <FaMoneyBillWave className="mr-2" />
                <span>ETB {selectedWorker.pricing}/hr</span>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-6 border-gray-300" />
        
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Bio</h4>
            <p className="text-gray-600">{selectedWorker.bio}</p>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Skills & Services</h4>
            <ul className="flex flex-wrap gap-2 text-gray-600">
              {selectedWorker.skills.map((skill, index) => (
                <li key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {skill}
                </li>
              ))}
              {selectedWorker.services.map((service, index) => (
                <li key={index} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center text-gray-600">
            <FaCalendarCheck className="mr-2" size={16} color={selectedWorker.availability_status === 'Available' ? 'green' : 'red'} />
            <span className={`text-sm font-semibold ${selectedWorker.availability_status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>
                Availability: {selectedWorker.availability_status}
            </span>
          </div>
        </div>
        
        {/* Conditional rendering for the action button */}
        {user ? (
          <div className="flex justify-end mt-8">
            <button
              onClick={() => {handleRequestNow(selectedWorker); setIsJobReqOpen(true)}}
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300"
            >
              Request Now
            </button>
          </div>
        ) : (
          <div className="flex justify-center mt-8">
            <Link 
            className="cursor-pointer px-6 py-3 bg-gradient-to-r from-yellow-600 to-red-600 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300"
            to='/register'>Register to Request a Worker</Link>
          </div>
        )}
      </div>
      {/* Modals */}
      <JobRequest isOpen={isJobReqOpen} onClose={handleJobReqClose}/>
    </div>
  );
};

export default WorkerDetailModal;