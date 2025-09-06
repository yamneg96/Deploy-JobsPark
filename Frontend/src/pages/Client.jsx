import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Briefcase, PlusCircle,
  Trash2, Edit, X, Loader2, Menu,
  Star, FileBadge, MapPin, BriefcaseMedical,
  CircleDollarSign, CircleCheckBig, ArrowLeft,
  UsersRound, FileText
} from 'lucide-react';
import {FaShoppingBag} from 'react-icons/fa'
import JobPost from '../components/JobPost';
import EditJobModal from '../components/EditJobModal'
import AddReviewModal from '../components/AddReviewModal'
import JobSearch from '../components/JobSearch';

import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';

import { Link } from 'react-router-dom';
import { getClientRequests } from '../services/requestAPI'; // Import the new API function
import { deleteJob, getJobs, updateJob } from '../services/jobAPI';
import toast from 'react-hot-toast';
import PaymentRequestsForClient from '../components/PaymentRequestsForClient'

import WorkerCard from '../components/WorkerCard';
import { motion } from 'framer-motion';
import WorkerDetailModal from '../components/WorkerDetailModal';
import { toggleFavoriteRequest, getFavoriteRequests } from '../services/jobAPI';

//Review
import { fetchWorkerReviews } from '../services/reviewAPI';

//Application Acceptance
import { getApplicationsByJob, updateApplicationStatus } from "../services/applicationAPI";

// New Modal for viewing resumes
const ResumeModal = ({ isOpen, onClose, resumes }) => {
  if (!isOpen || !resumes || resumes.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
          <h2 className="text-xl font-bold text-gray-800">Applicant Resumes</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4">
          {resumes.map((app, index) => (
            <div key={app._id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-gray-800 flex items-center">
                  <FileText className="mr-2 text-blue-500" size={16} />
                  Application ID: {app._id}
                </div>
                {app.resume && (
                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    View Resume
                  </a>
                )}
              </div>
              <p className="text-sm text-gray-600">Applicant: {app.worker_id?.name || 'N/A'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// StarRating and fetchClientStats components remain the same
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
      />
    );
  }
  return <div className="flex space-x-0.5">{stars}</div>;
};

const fetchClientStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        availableJobs: 3,
        activeApplications: 2,
        completedJobs: 1,
        totalApplications: 4,
      });
    }, 1000);
  });
};

const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);

  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

const Client = () => {
  const [months, setMonths] = useState(1);

  const { userRole, userId, skill, workers, user, workerId, clientId } = useAuth();
  const [nearbyWorkers, setNearbyWorkers] = useState([]);

  const {appliedJobsLen, payStatus, setPayStatus, applyJobs, jobs} = useJobs();

  const [realJobs, setRealJobs] = useState([]);
  const [realJobId, setRealJobId] = useState('');

  const monthbill = 50;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleMonthChange = (type) => {
    if (type === 'increment') {
      setMonths(prevMonths => prevMonths + 1);
    } else if (type === 'decrement' && months > 1) {
      setMonths(prevMonths => prevMonths - 1);
    }
  };

  // State for dashboard statistics and job data
  const [stats, setStats] = useState({});
  const [myApplications, setMyApplications] = useState([]); // Initialize as empty array
  const [applicationsLoading, setApplicationsLoading] = useState(true); // New loading state

  const [recentJobs, setRecentJobs] = useState([
    { id: 1, title: 'Software Engineer', location: 'Remote', category: 'Engineering', jobType: 'full-time', description: 'Develop and maintain web applications.', date: '2023-10-01', status: 'active', accepted: [1, 2, 3] },
    { id: 2, title: 'Data Scientist', location: 'New York, NY', category: 'Data Science', jobType: 'full-time', description: 'Analyze large datasets to find insights.', date: '2023-10-02', status: 'active', accepted: [1] },
    { id: 3, title: 'Product Manager', location: 'San Francisco, CA', category: 'Product Management', jobType: 'contract', description: 'Manage the product lifecycle.', date: '2023-10-03', status: 'active', accepted: [1, 2, 3, 4] }
  ]);

  const handleRequestNow = () => {
      toast('Insert Message for Worker');
    };
  useEffect(() => {
     const clientCoords = {
      latitude: user.latitude,
      longitude: user.longitude,
    };

    const maxDistance = 5; // Set your desired maximum distance in kilometers

    const filteredWorkers = workers.filter(worker => {
      const workerCoords = {
        latitude: worker.latitude,
        longitude: worker.longitude,
      };
      const distance = haversineDistance(clientCoords, workerCoords);
      return distance <= maxDistance; // Filter workers within the max distance
    });

    setNearbyWorkers(filteredWorkers); // Set the filtered workers
  }, [workers, user.latitude, user.longitude]); // Run effect when workers or location changes

  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  const [isJobPostOpen, setJobPostOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [reviewingApp, setReviewingApp] = useState(null);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    type: '',
    category: '',
    salaryMin: '',
    salaryMax: '',
  });

  const [isResumeModalOpen, setResumeModalOpen] = useState(false);
  const [selectedResumes, setSelectedResumes] = useState([]);

  // Fetch client requests on component mount
  useEffect(() => {
    const fetchApplications = async (id) => {
      if (!userId) return; // Wait for the user ID to be available
      setApplicationsLoading(true);
      try {
        const response = await getClientRequests(id); // Corrected function call to match requestAPI.js
        if (response.success) {
          // The API response returns a 'requests' array, so we set the state with that
          setMyApplications(response.requests);
        } else {
          console.error("Failed to fetch client requests:", response.message);
        }
      } catch (error) {
        console.error("Error fetching client requests:", error);
      } finally {
        setApplicationsLoading(false);
      }
    };
    const fetchJobs = async() => {
      if (!userId) return; // Wait for the user ID to be available
      setApplicationsLoading(true);
      try{
        const res = await getJobs();
        const jobData = res?.jobs;
        setRealJobs(jobData);
        // console.log(jobData); // The data without the success message.
      }catch(err){
        console.log("Error Loading Jobs: ", err);
      }
    }
    fetchApplications(userId);
    fetchJobs();
  }, [userId]); // Depend on userId to refetch if it changes

  useEffect(() => {
    const getStats = async () => {
      setStatsLoading(true);
      const fetchedStats = await fetchClientStats();
      setStats(fetchedStats);
      setStatsLoading(false);
    };
    getStats();
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString();

  const handleJobPostClose = () => {
    setJobPostOpen(false);
  };

  const handlePostJob = (newJob) => {
    setRealJobs(prevJobs => [newJob, ...prevJobs]);
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setEditModalOpen(true);
  };

  const handleEditJob = async(updatedData) => {
  if (!editingJob) {
    console.error("No job is selected for editing.");
    return;
  }

  try {
    // 1. Get the ID of the job from the editingJob state
    const jobId = editingJob._id;

    // 2. Call the API with the specific job's ID and the updated data
    const response = await updateJob(jobId, updatedData);

    // 3. Update the local jobs state with the data received from the API
    const updatedJobs = realJobs.map((job) =>
      job._id === response.job._id ? response.job : job
    );
    setRealJobs(updatedJobs);

    // 4. Close the modal and reset the editing state
    setEditModalOpen(false);
    setEditingJob(null);
    toast.success('Job updated successfully.');

  } catch (err) {
    // 5. Handle any errors from the API call
    console.error("Failed to update job:", err);
  }
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditingJob(null);
  };

  const handleDeleteClick = (job) => {
    setEditingJob(job);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteJob = async(realJobId) => {
 try {
        // 1. Await the asynchronous deleteJob API call.
        await deleteJob(realJobId);

        const updatedJobs = realJobs.filter(job => job._id !== realJobId);
        setRealJobs(updatedJobs); // Assuming your state variable is realJobs, not recentJobs

        setDeleteConfirmOpen(false);
        setEditingJob(null);
        toast.success('Job deleted successfully.');

    } catch (error) {
        console.error('Failed to delete job:', error);
        toast.error('Failed to delete job.');
    }
  };

  const handleDeleteModalClose = () => {
    setDeleteConfirmOpen(false);
    setEditingJob(null);
  };

  const handleUpdateApplicationStatus = (appId, newStatus) => {
    setMyApplications(prevApplications =>
      prevApplications.map(app => {
        if (app.id === appId) {
          if (newStatus === 'completed') {
            setReviewingApp(app);
            setReviewModalOpen(true);
            return { ...app, status: 'completed' };
          }
          return { ...app, status: newStatus };
        }
        return app;
      })
    );
  };

  const handleAddReview = (review) => {
    setMyApplications(prevApplications =>
      prevApplications.map(app =>
        app.id === reviewingApp.id ? { ...app, ...review } : app
      )
    );
    setReviewModalOpen(false);
    setReviewingApp(null);
  };

  // Filter applications based on API data structure
  const pendingApplications = myApplications.filter(app => app.status !== 'completed');
  const completedApplications = myApplications.filter(app => app.status === 'completed');

    // Async function to handle the favorite toggle
    const handleFavoriteClick = async (workerId) => {
      if (!user) {
          toast.error('You must be logged in to favorite a worker.');
          return;
      }

      try {
          const response = await toggleFavoriteRequest(workerId);
          if (response.favorited) {
              // Add the new favorite to state
              const workerToAdd = workers.find(w => w.profile[0]._id === workerId);
              if (workerToAdd) {
                  setFavoriteWorkers(prev => [...prev, workerToAdd]);
              }
              toast.success('Added to favorites.');
          } else {
              // Remove the worker from state
              setFavoriteWorkers(prev => prev.filter(w => w.profile[0]._id !== workerId));
              toast.success('Removed from favorites.');
          }
      } catch (error) {
          toast.error('Failed to update favorites.');
          console.error('Favorite toggle error:', error);
      }
  };

  const handleViewDetails = (worker, image) => {
    setSelectedWorker(worker);
    setImage(image)
    setShowWorkerDetail(true);
  };
  const [isFavorite, setIsFavorite] = useState(true);
  const [showWorkerDetail, setShowWorkerDetail] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [image, setImage] = useState();

//Applicant's Number
  const getJobApplicationsLengths = (jobs) => {
  return jobs.map(job => job.applications.length)[0];
  };

const [workerReviews, setWorkerReviews] = useState({});
const [completedReviews, setCompletedReviews] = useState();
const [reviewsLoading, setReviewsLoading] = useState(true);


// Fetch reviews when component mounts or completedApplications change
useEffect(() => {
  const fetchReviews = async () => {
    if (!userId) return;
    setReviewsLoading(true);
    try {
      const response = await fetchWorkerReviews(workerId); // API call
      setCompletedReviews(response.reviews)
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  fetchReviews();
}, [userId]);

//Application Acceptance
  const [applicationsModalOpen, setApplicationsModalOpen] = useState(false);
  const [selectedJobApplications, setSelectedJobApplications] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");

  // Fetch applications for a job when FileText is clicked
  const handleViewResumes = async (jobId, jobTitle) => {
    try {
      const res = await getApplicationsByJob(jobId);
      console.log(res);
      setSelectedJobApplications(res.applications || []);
      setSelectedJobTitle(jobTitle);
      setApplicationsModalOpen(true);
    } catch (error) {
      console.error("Error fetching applications: ", error);
    }
  };

  // Accept or reject an application
  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status);
      toast.success('Application Status Updated.')
      setSelectedJobApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  return loading ? (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  ) : (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r min-h-screen p-4 flex flex-col justify-between shadow-lg`}>
        <div>
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-6 h-6 text-gray-500 cursor-pointer"
            >
              {sidebarOpen ? <X className='cursor-pointer'/> : <Menu className='cursor-pointer'/>}
            </button>
          </div>
          <nav className="space-y-2">
            <button
              className={`flex items-center w-full px-3 py-2 rounded transition-colors ${activeView === 'dashboard' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'} cursor-pointer`}
              onClick={() => { setActiveView('dashboard'); setJobPostOpen(false); }}
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              {sidebarOpen && 'Dashboard'}
            </button>
            <button
              className={`flex items-center w-full px-3 py-2 rounded transition-colors ${activeView === 'manageJobs' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'} cursor-pointer`}
              onClick={() => { setActiveView('manageJobs'); setJobPostOpen(false); }}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              {sidebarOpen && 'Manage Jobs'}
            </button>
              <button
              className={`flex items-center w-full px-3 py-2 rounded transition-colors ${activeView === 'reviewRequests' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'} cursor-pointer`}
              onClick={() => { setActiveView('reviewRequests'); setJobPostOpen(false); }}
            >
              <FileBadge className="w-5 h-5 mr-2" />
              {sidebarOpen && 'Review Requests'}
            </button>
            <button
            className={`flex items-center w-full px-3 py-2 rounded transition-colors ${activeView === 'billPayment' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'} cursor-pointer`}
            onClick={() => { setActiveView('billPayment'); setJobPostOpen(false); }}
            >
            <CircleDollarSign className="w-5 h-5 mr-2" />
            {sidebarOpen && 'Bill Payment'}
          </button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Welcome back!</h2>
        <p className="text-gray-500 mb-6">Here's what's happening with your jobs today.</p>

        {activeView === 'dashboard' && (
          <>
            {/* Top stats */}
            {statsLoading ? (
              <div className="flex items-center justify-center h-24 mb-8 bg-white rounded-2xl shadow-lg">
                <Loader2 className="animate-spin text-blue-500" size={32} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="border-3 border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 rounded-xl p-6 text-center transition-colors">
                  <p className="text-4xl font-bold">{workers.length}</p>
                  <p className="text-sm mt-1">Available Workers</p>
                </div>
                <div className="border-3 border-green-600 hover:bg-green-600 hover:text-white text-green-600 rounded-xl p-6 text-center transition-colors">
                  <p className="text-4xl font-bold">{stats.activeApplications}</p>
                  <p className="text-sm mt-1">Active Applications</p>
                </div>
                <div className="border-3 border-purple-600 hover:bg-purple-600 hover:text-white text-purple-600 rounded-xl p-6 text-center transition-colors">
                  <p className="text-4xl font-bold">{stats.completedJobs}</p>
                  <p className="text-sm mt-1">Completed Jobs</p>
                </div>
                <div className="border-3 border-yellow-600 hover:bg-yellow-600 hover:text-white text-yellow-600 rounded-xl p-6 text-center transition-colors">
                  <p className="text-4xl font-bold">{realJobs.length}</p>
                  <p className="text-sm mt-1">Total Posted Jobs</p>
                </div>
              </div>
            )}
            {/* Nearby Workers & Recent Applications */}
            <div className="flex flex-col gap-6 mb-8">
                <JobSearch filters={filters} setFilters={setFilters} />
                <h3 className="font-bold text-xl mb-4 text-gray-800">Nearby Workers</h3>
                {nearbyWorkers.length === 0 ? (
                  <p className="text-gray-500">No nearby workers found.</p>
                ) : (
                  <div className="space-y-4">
                    {nearbyWorkers.map((worker, index) => (
                      <motion.div
                        key={worker._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                          <WorkerCard
                          worker={worker.profile[0]}
                          user={user}
                          name={worker.name}
                          image={worker.image}
                          handleViewDetails={handleViewDetails}
                          handleRequestNow={handleRequestNow}
                          handleFavoriteClick={handleFavoriteClick}
                          isFavorite={isFavorite}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

              <div className="bg-white p-6 rounded-2xl hover:shadow-lg">
                <h3 className="font-bold text-xl mb-4 text-gray-800">Recent Requests</h3>
                {applicationsLoading ? (
                  <div className="flex items-center justify-center h-24">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                  </div>
                ) : myApplications.length === 0 ? (
                  <p className="text-gray-500">No Request submitted.</p>
                ) : (
                  myApplications.map(app => (
                    <div key={app._id} className="border rounded-3xl p-4 mb-3 flex items-center bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                        {app.worker_id?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{app.worker_id?.name}</p>
                        <p className="text-sm text-gray-600">{skill}</p>
                        <p className={`mt-1 text-xs font-medium ${
                            app.status === 'pending' ? 'text-yellow-700' :
                            app.status === 'accepted' ? 'text-green-700' :
                            'text-red-700'
                        }`}>
                          Status: {app.status}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {activeView === "manageJobs" && (
          <div className="bg-white p-6 rounded-2xl min-h-screen">
            <h3 className="font-bold text-xl mb-4 text-gray-800">Manage Your Jobs</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left table-auto">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Job Title</th>
                    <th className="py-3 px-6 text-left">Applicants</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {realJobs.map((job) => {
                    const applicantCount = myApplications.filter(
                      (app) => app.job_id === job._id
                    ).length;

                    return (
                      <tr key={job._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6">{job.title}</td>
                        <td className="py-3 px-6 flex items-center">
                          <span className="text-blue-600 font-semibold mr-2">{getJobApplicationsLengths}</span>
                          <UsersRound size={18} className="text-gray-500" />
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex item-center justify-center">
                            <button onClick={() => handleEditClick(job)} className="w-6 mr-2 transform hover:text-blue-500 hover:scale-110 cursor-pointer">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDeleteClick(job)} className="w-6 mr-2 transform hover:text-red-500 hover:scale-110 cursor-pointer">
                              <Trash2 size={18} />
                            </button>
                            <button
                              onClick={() => handleViewResumes(job._id, job.title)}
                              className="w-6 mr-2 transform hover:text-green-500 hover:scale-110 cursor-pointer"
                              title="View Resumes"
                              disabled={getJobApplicationsLengths === 0}
                            >
                              <FileText size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-white p-6 rounded-2xl mt-6"> 
              <h3 className="font-bold text-xl mb-4 text-gray-800">Quick Actions</h3> 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
                <button className="cursor-pointer flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors" onClick={() => { setActiveView('postJob'); setJobPostOpen(true); }}> 
                  <PlusCircle className="w-5 h-5 mr-2" /> Post New Job 
                </button> 
                <button 
                className="cursor-pointer flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-800 rounded-xl shadow-md hover:bg-gray-300 transition-colors" onClick={() => { setActiveView('reviewRequests'); setJobPostOpen(false); }}> <FileBadge className="w-5 h-5 mr-2" /> 
                  Review Requests 
                </button> 
              </div> 
            </div> 

            {/* Applications Modal */}
            {applicationsModalOpen && (
              <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50">
                <div className="bg-white rounded-2xl p-6 w-11/12 max-w-2xl relative">
                  <h3 className="text-xl font-bold mb-4">Applications for: {selectedJobTitle}</h3>
                  <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                    onClick={() => setApplicationsModalOpen(false)}
                  >
                    ✖
                  </button>
                  <div className="overflow-y-auto max-h-96">
                    {selectedJobApplications.length === 0 ? (
                      <p>No applications yet.</p>
                    ) : (
                      selectedJobApplications.map((app) => (
                        <div key={app._id} className="flex justify-between items-center border-b py-2">
                          <div>
                            <p className="font-semibold">{app.name}</p>
                            <p className="text-gray-500 text-sm">{app.email}</p>
                            <p className="text-gray-500 text-sm">Status: {app.status}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(app._id, "accepted")}
                              disabled={app.status === "accepted"}
                              className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app._id, "rejected")}
                              disabled={app.status === "rejected"}
                              className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'reviewRequests' && (
          <div className="bg-white p-6 rounded-2xl min-h-screen">
            <h3 className="font-bold text-xl mb-4 text-gray-800">Pending Requests</h3>
            {applicationsLoading ? (
                <div className="flex items-center justify-center h-24">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                </div>
            ) : pendingApplications.length === 0 ? (
                <p className="text-gray-500">No pending Requests to review.</p>
            ) : (
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full text-left table-auto">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Worker Name</th>
                    <th className="py-3 px-6 text-left">Job Title</th>
                    <th className="py-3 px-6 text-left">Request Status</th>
                    {/* <th className="py-3 px-6 text-left">Job Status</th> */}
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {pendingApplications.map(app => (
                    <tr key={app._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6">{app.worker_id?.name}</td>
                      <td className="py-3 px-6">{skill}</td>
                      <td className="py-3 px-6">
                        <span className={`py-1 px-3 rounded-full text-xs font-medium ${
                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      {/* <td className='px-4'>
                        <button className='p-2 shadow-md hover:shadow-lg m-2 text-transparent font-bold cursor-pointer bg-clip-text
                        bg-gradient-to-r from-blue-500 to-green-500 rounded-md'>
                            Done
                        </button>
                        <button className='p-2 cursor-pointer shadow-md hover:shadow-lg m-2 bg-clip-text font-bold
                        bg-gradient-to-r text-transparent from-blue-500 to-red-500 rounded-md'>
                            Ongoing
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}

            <h3 className="font-bold text-2xl mb-4 text-gray-800">
              Completed Jobs & <span className='bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent'>Reviews</span>
            </h3>

            {reviewsLoading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="animate-spin text-blue-500" size={24} />
              </div>
            ) : completedReviews.length === 0 ? (
              <p className="text-gray-500">No completed jobs to review yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedReviews.map((review) => (
                  <div key={review._id} className="bg-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-lg text-gray-800">{review.worker_id?.name}</div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-gray-600 font-semibold text-sm mb-2">{review.job_id?.title}</p>
                    <p className="text-gray-500 text-sm italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
        {activeView === 'billPayment' && (
            <div className='p-6'>
              <PaymentRequestsForClient />
            </div>
        )}
      </main>

      {/* Modals */}
      <JobPost isOpen={isJobPostOpen} onClose={handleJobPostClose} onPostJob={handlePostJob} />
      <EditJobModal isOpen={isEditModalOpen} onClose={handleEditModalClose} job={editingJob} onSave={handleEditJob} />
      <DeleteConfirmationModal isOpen={isDeleteConfirmOpen} onClose={handleDeleteModalClose} onConfirm={handleDeleteJob} job={editingJob} />
      <AddReviewModal isOpen={isReviewModalOpen} onClose={() => setReviewModalOpen(false)} onSave={handleAddReview} app={reviewingApp} />
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setResumeModalOpen(false)} resumes={selectedResumes} />
      <WorkerDetailModal
        showWorkerDetail={showWorkerDetail}
        setShowWorkerDetail={setShowWorkerDetail}
        selectedWorker={selectedWorker}
        image={image}
        handleRequestNow={handleRequestNow}
      />
    </div>
  );
}

// Simple self-contained DeleteConfirmationModal component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, job }) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to delete the job "{job.title}"?</p>
        <div className="flex justify-center space-x-4">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors cursor-pointer">Cancel</button>
          <button onClick={() => onConfirm(job._id)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors cursor-pointer">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Client;
