import API from './axios';
//Apply Jobs.
export const applyJobs = async(appliedJob) => {
  const token = sessionStorage.getItem('token');
  try {
    const res = await API.post(`/applications/`, appliedJob, {
      headers : {
        Authorization : `Bearer ${token}`
      }
    })
    return res.data;
  } catch (error) {
    console.log("Error applying jobs: ", error);
  }
}
//Get Applied Jobs using user logged in as Worker.
export const getAppliedJobs = async () => {
  try {
    const res = await API.get(`/applications/my`);
    return res.data;
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    throw error;
  }
};

// Get applications for a specific job (Client)
export const getApplicationsByJob = async (jobId) => {
  const token = sessionStorage.getItem("token");
  try {
    const res = await API.get(`/applications/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching applications by job:", error);
    return { applications: [] };
  }
};

// Update application status (accept/reject)
export const updateApplicationStatus = async (applicationId, status) => {
  const token = sessionStorage.getItem("token");
  try {
    const res = await API.put(`/applications/${applicationId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};