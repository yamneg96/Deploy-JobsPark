import API from "./axios";

const token = sessionStorage.getItem('token');
// Post job
export const createJob = async (jobData, clientId) => {
  try {

    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    // Add client_id to the job data
    const dataToSend = { ...jobData, client_id: clientId };

    const res = await API.post('/jobs', dataToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error('Job creation error:', error.response?.data || error.message);
    throw error; // throw to catch in your component
  }
};

// Get all jobs
export const getJobs = async () => {
  const res = await API.get('/jobs/all-posted-jobs');
  return res.data;
};
// Update a job
export const updateJob = async (jobId, updatedData) => {
    try {

        if (!token) {
            throw new Error('No authentication token found. Please log in.');
        }

        const res = await API.put(`/jobs/${jobId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;
    } catch (error) {
        console.error('Job update error:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteJob = async (jobId) => {
    try {

        if (!token) {
            throw new Error('No authentication token found. Please log in.');
        }

        const res = await API.delete(`/jobs/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;
    } catch (error) {
        console.error('Job delete error:', error.response?.data || error.message);
        throw error;
    }
};


export const saveBookmark = async(jobId) => {
  try {
    const res = await API.patch(`/jobs/${jobId}/bookmark`);
    return res.data;
  } catch (error) {
    console.log('Error Saving Job: ', error);
  }
};


export const getBookmarked = async() => {
  try {
    const res = await API.get(`/jobs/bookmarked`, {
      headers : {
        Authorization : `Bearer ${token}`
      },
    });
    return res.data;
  } catch (error) {
    console.log("Error Fetching Jobs: ", error);
  }
};

// ===================== TOGGLE FAVORITE =====================
export const toggleFavoriteRequest = async (requestId) => {
  try {
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const res = await API.patch(`/requests/${requestId}/favorite`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Toggle favorite error:', error.response?.data || error.message);
    throw error;
  }
};

// ===================== GET FAVORITES =====================
export const getFavoriteRequests = async () => {
  try {
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const res = await API.get('/requests/favorites', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Fetching favorites error:', error.response?.data || error.message);
    throw error;
  }
};