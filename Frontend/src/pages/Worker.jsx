import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaBookmark, FaThLarge, FaList,
  FaPhoenixFramework
} from 'react-icons/fa';

import ApplicationForm from '../components/ApplicationForm';
import JobDetailsModal from '../components/JobDetailsModal';
import JobSearch from '../components/JobSearch';
import JobFilters from '../components/JobFilters';
import JobCard from '../components/JobCard';
import AppliedJobCard from '../components/AppliedJobCard';
import RequestCard from '../components/RequestCard';

import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';

const Worker = () => {
  const [activeView, setActiveView] = useState('Find Jobs');
  const [viewType, setViewType] = useState('grid');
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    type: '',
    category: '',
    salaryMin: '',
    salaryMax: '',
  });

  const [isApplyFormOpen, setIsApplyFormOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [jobsBookmarked, setJobsBookmarked] = useState([]);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  const { user, workerId, clientId } = useAuth();
  const {
    jobs,
    clientReq,
    reqLen,
    reqStat,
    appliedJobsLen,
    applyJobs,

    clientPaymentReqs,

    saveJobBookmark,
    fetchBookmarkedJobs,
    fetchAppliedJobs,
    getWorkerRequests,
    appliedStatus
  } = useJobs();

  // Load bookmarks, applied jobs, and client requests
  useEffect(() => {
    console.log(jobs);
    const loadData = async () => {
      if (!workerId) return;

      setRequestsLoading(true);
      try {
        const bookmarkedRes = await fetchBookmarkedJobs();
        if (bookmarkedRes.success) {
          setJobsBookmarked(
            bookmarkedRes.data.jobs.map(job => ({ ...job, bookmarked: true }))
          );
        }

      } catch (err) {
        console.error("Error loading worker data:", err);
      } finally {
        setRequestsLoading(false);
      }
    };

    const fetchAppliedJobs = async(workerId) => {
        try {
            const res = await getAppliedJobs(workerId);
            const appliedJobs = res.applications;
            const appliedStatus = res.success;
            const appliedJobsLen = appliedJobs.length;
            console.log(appliedJobs);
            setAppliedJob(appliedJob);
            setAppliedStatus(appliedStatus);
            setAppliedJobsLen(appliedJobsLen);
            return { success: true, data: res };
        } catch (err) {
            console.error("Error fetching applied jobs:", err);
            toast.error("Failed to fetch applied jobs.");
            return { success: false, data: [] };
        }
    };

    loadData();
  }, [workerId, activeView]);

  const toggleBookmark = async (id) => {
    try {
      await saveJobBookmark(id);
      toast.success("Bookmark updated.");
      // refresh bookmarks list
      const bookmarkedRes = await fetchBookmarkedJobs();
      if (bookmarkedRes.success) {
        setJobsBookmarked(
          bookmarkedRes.data.jobs.map(job => ({ ...job, bookmarked: true }))
        );
      }
    } catch (error) {
      console.error("Error bookmarking:", error);
    }
  };

  const handleApplyClick = (job) => {
    setCurrentJob(job);
    setIsApplyFormOpen(true);
  };

  const handleApplyFormClose = () => {
    setIsApplyFormOpen(false);
    setCurrentJob(null);
  };

  const showDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const filteredJobs = jobs.filter(job => {
    const keywordMatch = filters.keyword === '' || 
      job.title.toLowerCase().includes(filters.keyword.toLowerCase());
    
    const locationMatch = filters.location === '' || 
      job.location.toLowerCase().includes(filters.location.toLowerCase());

    const typeMatch = filters.location === '' || 
      job.type.toLowerCase().includes(filters.type.toLowerCase());

    return keywordMatch && locationMatch;
  });

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <ToastContainer position="top-right" autoClose={1500} />

      <ApplicationForm
        isOpen={isApplyFormOpen}
        onClose={handleApplyFormClose}
        currentJob={currentJob}
      />

      <JobDetailsModal
        showJobDetails={showJobDetails}
        setShowJobDetails={setShowJobDetails}
        selectedJob={selectedJob}
        setCurrentJob={setCurrentJob}
        setShowApplyForm={setIsApplyFormOpen}
      />

      <div className={`container mx-auto px-4 py-8 max-w-7xl transition-all duration-300 ${
        (isApplyFormOpen || showJobDetails) ? 'blur-[1px] brightness-90' : ''
      }`}>
        {/* Tabs */}
        <div className="flex justify-center md:justify-end mb-6">
          {['Find Jobs','Bookmarked Jobs','Client Requests','AppliedJobs'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`ml-4 first:ml-0 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeView === tab
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border-green-500 border-2 cursor-pointer'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Find Jobs */}
        {activeView === 'Find Jobs' && (
          <>
            <JobSearch filters={filters} setFilters={setFilters} />
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              {/* <JobFilters filters={filters} setFilters={setFilters} /> */}
              <main className="w-full md:w-3/4">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-gray-600 font-medium">
                    Showing <span className="font-bold text-blue-600">{filteredJobs.length}</span> jobs
                  </h4>
                  <div className="flex items-center space-x-2 bg-white p-1 rounded-full shadow-sm border border-gray-200">
                    <button
                      onClick={() => setViewType('grid')}
                      className={`p-2 rounded-full ${viewType === 'grid' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                      <FaThLarge size={16} />
                    </button>
                    <button
                      onClick={() => setViewType('list')}
                      className={`p-2 rounded-full ${viewType === 'list' ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                      <FaList size={16} />
                    </button>
                  </div>
                </div>

                {viewType === 'grid' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredJobs.map(job => (
                      <JobCard
                        key={job._id}
                        job={job}
                        bookmark={job.bookmarked}
                        toggleBookmark={() => toggleBookmark(job._id)}
                        toggleApplied={() => handleApplyClick(job)}
                        showDetails={() => showDetails(job)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    {filteredJobs.map(job => (
                      <JobCard
                        key={job._id}
                        job={job}
                        bookmark={job.bookmarked}
                        toggleBookmark={() => toggleBookmark(job._id)}
                        toggleApplied={() => handleApplyClick(job)}
                        showDetails={() => showDetails(job)}
                        listView
                      />
                    ))}
                  </div>
                )}
              </main>
            </div>
          </>
        )}

        {/* Bookmarked Jobs */}
        {activeView === 'Bookmarked Jobs' && (
          jobsBookmarked.length === 0 ? (
            <div className="text-center mt-12">
              <FaBookmark className="text-4xl mx-auto mb-4 text-green-400"/>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookmarked jobs yet</h3>
              <p className="text-gray-600">Click the bookmark icon on jobs to save them here.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${viewType === 'grid' ? 'lg:grid-cols-2' : ''} gap-6`}>
              {jobsBookmarked.map(job => (
                <JobCard
                  key={job._id}
                  job={job}
                  bookmark={job.bookmarked}
                  toggleBookmark={() => toggleBookmark(job._id)}
                  toggleApplied={() => handleApplyClick(job)}
                  showDetails={() => showDetails(job)}
                  listView={viewType === 'list'}
                />
              ))}
            </div>
          )
        )}

        {/* Client Requests */}
        {activeView === 'Client Requests' && (
          requestsLoading ? (
            <p className="text-center text-gray-500 mt-12">Loading requests...</p>
          ) : reqLen === 0 ? (
            <div className="text-center mt-12">
              <FaPhoenixFramework className="text-4xl mx-auto mb-4 text-green-400"/>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No requested jobs yet</h3>
              <p className="text-gray-600">Client requests will appear here when submitted.</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {clientReq.map(req => (
                <RequestCard key={req._id} request={req} />
              ))}
            </div>
          )
        )}

        {/* Applied Jobs */}
        {activeView === 'AppliedJobs' && (
          applyJobs.length === 0 ? (
            <div className="text-center mt-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No applied jobs yet</h3>
              <p className="text-gray-600">You haven't applied for any jobs yet.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${viewType === 'grid' ? 'lg:grid-cols-2' : ''} gap-6`}>
              {applyJobs.map(application => (
                <AppliedJobCard key={application._id} application={application} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Worker;