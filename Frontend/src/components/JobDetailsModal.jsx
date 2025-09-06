import { FaTimes, FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

const JobDetailsModal = ({ 
  showJobDetails, 
  setShowJobDetails, 
  selectedJob, 
  setCurrentJob, 
  setShowApplyForm 
}) => {
  if (!showJobDetails || !selectedJob) return null;
  const { user, userRole } = useAuth();
  const handleRequestNow = () => {
    toast.success('Request sent successfully!');
  };

  return (
    <div className="fixed backdrop-blur-xs inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">

      <div className="absolute inset-0  "></div>
      
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4 border border-gray-200">
        <button 
          onClick={() => setShowJobDetails(false)}
          className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FaTimes size={20} />
        </button>
        
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-shrink-0">
            <img
              src={selectedJob.client_id.image}
              alt={`${selectedJob.client_id.image} logo`}
              className="h-20 w-20 rounded-full object-contain border-2 border-white shadow-sm bg-white p-1"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800">{selectedJob.title}</h3>
            <p className="text-gray-600 text-lg">{selectedJob.category}</p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <span>{selectedJob.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaBriefcase className="mr-2" />
                <span>{selectedJob.type}</span>
              </div>
              <div className="flex items-center text-blue-600 font-medium">
                <FaMoneyBillWave className="mr-2" />
                <span>{selectedJob.salaryStr}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Job Description</h4>
            <p className="text-gray-600">{selectedJob.description}</p>
          </div>
          
          {/* <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Requirements</h4>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              {selectedJob.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div> */}
        </div>
        {user ? (userRole === 'worker' ?( 
        <div className="flex justify-end mt-8">
          <button
            onClick={() => {
              setShowJobDetails(false);
              setCurrentJob(selectedJob);
              setShowApplyForm(true);
            }}
            className="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300"
          >
            Apply Now
          </button>
        </div>) :(
          <div className="flex justify-end mt-8">
            <button
              onClick={handleRequestNow}
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300"
            >
              Request Now
            </button>
          </div>
        )):(
        <div className="flex justify-center mt-8">
            <Link 
            className="cursor-pointer px-6 py-3 bg-gradient-to-r from-yellow-600 to-red-600 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300"
            to='/register'>Register to Apply/Request a job</Link>
        </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsModal;