const JobFilters = ({ filters, setFilters }) => {
  return (
    <aside className="bg-white p-6 rounded-2xl shadow-xl w-full md:w-1/4 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-lg text-gray-800">Filter Jobs</h4>
        <button
          className="text-sm text-blue-500 hover:underline hover:text-blue-700 transition-colors"
          onClick={() =>
            setFilters({
              keyword: '',
              location: '',
              type: '',
              category: '',
              salaryMin: '',
              salaryMax: '',
            })
          }
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Job Type */}
        <div className="border-b border-gray-200 pb-4">
          <h5 className="font-semibold text-gray-700 mb-2">Job Type</h5>
          <div className="space-y-2">
            {['Remote', 'Full-Time', 'Part-Time', 'Contract', 'Internship'].map((type) => (
              <label key={type} className="flex items-center space-x-2 group">
                <input
                  type="radio"
                  name="jobType"
                  checked={filters.type === type}
                  onChange={() => setFilters((prev) => ({ ...prev, type: type }))}
                  className="rounded-full text-blue-600 focus:ring-blue-500 group-hover:ring-2 group-hover:ring-blue-200"
                />
                <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{type}</span>
              </label>
            ))}
            <label className="flex items-center space-x-2 group">
              <input
                type="radio"
                name="jobType"
                checked={filters.type === ''}
                onChange={() => setFilters((prev) => ({ ...prev, type: '' }))}
                className="rounded-full text-blue-600 focus:ring-blue-500 group-hover:ring-2 group-hover:ring-blue-200"
              />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Any</span>
            </label>
          </div>
        </div>

        {/* Category */}
        <div className="border-b border-gray-200 pb-4">
          <h5 className="font-semibold text-gray-700 mb-2">Category</h5>
          <div className="space-y-2">
            {['IT & Software', 'Design', 'Marketing', 'Sales', 'AI', 'Research', 'Creative', 'Banking', 'Fintech', 'Telecom'].map((cat) => (
              <label key={cat} className="flex items-center space-x-2 group">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat}
                  onChange={() => setFilters((prev) => ({ ...prev, category: cat }))}
                  className="rounded-full text-blue-600 focus:ring-blue-500 group-hover:ring-2 group-hover:ring-blue-200"
                />
                <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{cat}</span>
              </label>
            ))}
            <label className="flex items-center space-x-2 group">
              <input
                type="radio"
                name="category"
                checked={filters.category === ''}
                onChange={() => setFilters((prev) => ({ ...prev, category: '' }))}
                className="rounded-full text-blue-600 focus:ring-blue-500 group-hover:ring-2 group-hover:ring-blue-200"
              />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors">Any</span>
            </label>
          </div>
        </div>

        {/* Salary Range */}
        <div className="pb-4">
          <h5 className="font-semibold text-gray-700 mb-2">Salary Range (ETB/yr)</h5>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.salaryMin}
              onChange={(e) => setFilters((prev) => ({ ...prev, salaryMin: e.target.value }))}
              className="w-1/2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.salaryMax}
              onChange={(e) => setFilters((prev) => ({ ...prev, salaryMax: e.target.value }))}
              className="w-1/2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default JobFilters;