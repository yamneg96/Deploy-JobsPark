import { useEffect } from 'react';
import { FaBookmark, FaMapMarkerAlt } from 'react-icons/fa';

const JobCard = ({ job, toggleBookmark, bookmark, toggleApplied, showDetails, listView = false, setShowApplyForm }) => {

  const dateString = job.updatedAt;

  // The string is separated by 'T'
  const [datePart, timePart] = dateString.split('T');

  // The time part can be further split by ':'
  const [hours, minutes] = timePart.split(':');

  const formattedDate = datePart; // "yyyy-mm-dd"
  const formattedTime = `${hours}:${minutes}`; // "hr:min"

  return (
    <div
      className={`relative rounded-2xl shadow-lg p-6 transition-all duration-300 ease-in-out border border-gray-200 hover:shadow-xl ${
        listView ? 'flex justify-between items-center' : 'h-full flex flex-col'
      }`}
    >
      {/* Bookmark button */}
      <button
        onClick={() => toggleBookmark(job._id)}
        className={`cursor-pointer absolute top-4 right-4 rounded-full p-2 transition-all duration-300 ${
          bookmark
            ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md'
            : 'bg-white text-gray-400 shadow-sm hover:bg-gray-100'
        }`}
        aria-label="Bookmark job"
        title={bookmark ? 'Remove Bookmark' : 'Bookmark Job'}
      >
        <FaBookmark size={18} /> 
      </button>

      <div className={`flex ${listView ? 'items-center space-x-6' : 'justify-between items-start mb-4'}`}>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img
              src={job.client_id.image} //We should use client pic or job posting image.
              alt={`${job.description} logo`}
              className="h-16 w-16 rounded-full object-contain border-2 border-white shadow-sm bg-white p-1"
            />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-800">{job.title}</h4>
            <p className="text-gray-600 text-sm">{job.description}</p>
            <p className="text-gray-500 text-xs">{`${formattedDate}, ${formattedTime}`}</p>
          </div>
        </div>
      </div>

      <div className={`${listView ? 'flex items-center space-x-6' : 'mt-4'}`}>
        <div className={`${listView ? 'flex flex-col space-y-1' : ''}`}>
          <p className="text-sm text-gray-700 flex items-center">
            <FaMapMarkerAlt className="mr-1 text-gray-500" size={12} />
            {job.location}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-white/80 text-xs px-2 py-1 rounded-full shadow-sm">
              {job.type}
            </span>
            {/* {job.tags.map(tag => (
              <span key={tag} className="bg-white/80 text-xs px-2 py-1 rounded-full shadow-sm">
                {tag}
              </span> Notify Chala about array dataStructure.
            ))} */}
              <span className="bg-white/80 text-xs px-2 py-1 rounded-full shadow-sm">
                {job.category}
              </span>
          </div>
          <p className="text-blue-600 font-bold text-lg mt-2">{job.salaryStr}</p>
        </div>

        <div className="flex items-center space-x-3 mt-3 md:mt-0">
          {job.applied ? (
            <>
              <button
                onClick={() => {
                  toggleApplied(job._id); 
                  setShowApplyForm(true)}}
                className="cursor-pointer px-4 py-2 rounded-full font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                disabled
                className="px-4 py-2 rounded-full font-semibold bg-blue-100 text-blue-600 shadow-sm cursor-not-allowed"
              >
                Applied
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => showDetails(job)}
                className="cursor-pointer px-4 py-2 rounded-full font-semibold bg-white text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
              >
                View Details
              </button>
              <button
                onClick={() => toggleApplied(job._id)}
                className="cursor-pointer px-4 py-2 rounded-full font-semibold bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-md transition-all duration-300"
              >
                Apply Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
