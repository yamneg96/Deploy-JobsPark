import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaHeart, FaStar, FaTools, FaCalendarCheck } from 'react-icons/fa';
import JobRequest from './JobRequest';
import { useAuth } from '../context/AuthContext';

const WorkerCard = ({ worker, user, name, image, handleViewDetails, handleRequestNow, handleFavoriteClick, isFavorite }) => {

//To Be used incase the worker.profile[0].image didn't work.
  // const {workers} = useAuth();
  // const workerImage = () => {
  //   workers.map(worker => {
  //     return worker.image;
  //   })
  // }

  // Modal state for different pop-up windows
  const [isJobReqOpen, setIsJobReqOpen] = useState(false);
  const handleJobReqClose = () => {
    setIsJobReqOpen(false);
  };

  return (
    <div className="relative rounded-3xl p-6 transition-all duration-300 ease-in-out border border-gray-200 hover:shadow-xl flex items-center">
      {/* Favorite Heart Icon */}
      <button 
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
      >
        <FaHeart size={20} color={isFavorite ? 'currentColor' : 'red'} />
      </button>

      {/* Worker Image */}
      <div className="flex-shrink-0 mr-6">
        <img
          src={image}
          alt="Worker profile"
          className="h-24 w-24 rounded-full object-cover border-2 border-white shadow-sm"
        />
      </div>

      {/* Worker Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xl font-bold text-gray-800 truncate">
          {name}
        </h4>
        <p className="text-gray-600 text-sm font-semibold m-2 truncate">{worker.services[0] || worker.skills[0] || 'Worker'}</p>
        <p className="text-gray-600 text-sm mb-2 truncate">{worker.bio}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
          {/* Experience */}
          <div className="flex items-center text-gray-700">
            <FaTools className="mr-1 text-blue-500" size={16} />
            <span className="font-semibold text-sm">{worker.experience_years} Years Exp.</span>
          </div>

          {/* Rating */}
          <div className="flex items-center text-gray-700">
            <FaStar className="mr-1 text-yellow-500" size={16} />
            <span className="font-semibold text-sm">{worker.rating} Rating</span>
          </div>
        </div>

        {/* Services/Skills Tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {worker.services.slice(0, 3).map((service, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {service}
            </span>
          ))}
          {worker.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
        
        {/* Availability */}
        <div className="flex items-center mt-4">
          <FaCalendarCheck className="mr-2" size={16} color={worker.availability_status === 'Available' ? 'green' : 'red'} />
          <span className={`text-sm font-semibold ${worker.availability_status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>
            {worker.availability_status}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center ml-auto pl-6 space-y-2">
        <button
          onClick={() => handleViewDetails(worker, image)}
          className="cursor-pointer px-6 py-2 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300"
        >
          View Details
        </button>
        {user && (
          <button
            onClick={() => {handleRequestNow(worker); setIsJobReqOpen(true)}}
            className="cursor-pointer bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-lg hover:shadow-md transition-all duration-300"
          >
            Request Now
          </button>
        )}
      </div>
      {/* Modals */}
      <JobRequest isOpen={isJobReqOpen} onClose={handleJobReqClose}/>
    </div>
  );
};

export default WorkerCard;