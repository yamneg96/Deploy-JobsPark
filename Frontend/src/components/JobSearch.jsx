import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const JobSearch = ({ filters, setFilters }) => {
  const { user, userRole } = useAuth();
  
  const handleKeywordChange = (e) => {
    setFilters(prev => ({ ...prev, keyword: e.target.value }));
  };

  const handleLocationChange = (e) => {
    setFilters(prev => ({ ...prev, location: e.target.value }));
  };

  return (
    <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 mb-8 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Find Your 
        {(user && userRole === 'client' ? 
          (
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent"> Nearby Workers</span>
          ) : (
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent"> Next Opportunity</span>
          )
        )}
      </h2>
      <p className="text-gray-600 mb-6">
        Discover jobs that match your skills and preferences
      </p>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative w-full md:w-5/12">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Job title, company, or keywords"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.keyword}
            onChange={handleKeywordChange}
          />
        </div>

        <div className="relative w-full md:w-5/12">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaMapMarkerAlt className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Location (e.g. Addis Ababa)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.location}
            onChange={handleLocationChange}
          />
        </div>

        <button className="w-full md:w-2/12 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-700 hover:to-green-700 cursor-pointer">
          Search Jobs
        </button>
      </div>
    </section>
  );
};

export default JobSearch;