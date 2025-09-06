import React, { useEffect, useState } from "react";

function BrowseJobsModal({ onClose }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [requestSent, setRequestSent] = useState(false); 

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs") // replace with your real backend
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  }, []);

  const handleRequest = () => {
   
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 3000); // Reset after 3s
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 backdrop-blur-md bg-black/10" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative z-50 bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Near Workers</h2>

        {/* Job List */}
        {jobs.map((job, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-md p-4 mb-4 flex justify-between items-center border"
          >
            <div>
              <h3 className="font-bold">{job.title}</h3>
              <p>{job.description}</p>
              <p className="text-sm text-gray-600 mt-1">📍 {job.location}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{job.price} ETB/hr</p>
              <button
                className="text-blue-500 hover:underline mt-2"
                onClick={() => {
                  setSelectedJob(job);
                  setRequestSent(false); // reset on new selection
                }}
              >
                More ▼
              </button>
            </div>
          </div>
        ))}

        {/* Detailed Section */}
        {selectedJob && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-bold mb-2 text-center">📋 Job Details</h3>
            <p><strong>Title:</strong> {selectedJob.title}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Price per Hour:</strong> {selectedJob.price} ETB</p>
            <p><strong>Job Type:</strong> {selectedJob.type || "Not specified"}</p>

            {/* ✅ Request Button */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <button
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                onClick={handleRequest}
              >
                Request
              </button>

              {/* ✅ Confirmation Message */}
              {requestSent && (
                <p className="text-green-600 font-semibold mt-2">
                  ✅ Request sent successfully!
                </p>
              )}
            </div>

            {/* Hide Details */}
            <button
              className="mt-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 block mx-auto"
              onClick={() => setSelectedJob(null)}
            >
              Hide Details ▲
            </button>
          </div>
        )}

        {/* Close Button */}
        <button
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 block mx-auto"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default BrowseJobsModal;