import API from './axios';

// Register client
export const registerClient = async (data) => {
  const { role, ...rest } = data;
  const res = await API.post('/users/register/client', rest);
  return res.data;
};

// Register worker
export const registerWorker = async (data) => {
  const { role, ...rest } = data;
  const res = await API.post('/users/register/worker', rest);
  return res.data;
};

// Register admin
export const registerAdmin = async (data) => {
  const { role, ...rest } = data;
  const res = await API.post('/users/register/admin', rest);
  return res.data;
};

// Login
export const login = async (data) => {
  const res = await API.post('/users/login', data);
  if(res.data.token){
    sessionStorage.setItem('token', res.data.token);
  }
  return res.data; // <-- The key change: const res = just the data
};

// Logout
export const logout = async () => {
  const res = await API.get('/users/logout');
  return res.data;
};

// Get current user
export const getCurrentUser = async () => {
  const res = await API.get('/users/me');
  return res.data;
};

// Request password reset
export const requestPasswordReset = async (email) => {
  const res = await API.post('/users/forgot-password', { email });
  return res.data;
};

// Verify email
export const verifyEmail = async (token) => {
  const res = await API.get(`/users/verify-email/${token}`);
  return res.data;
};

// Reset Password
export const resetPassword = async (token, newPassword) => {
  const res = await API.post(`/users/reset-password/${token}`, { password: newPassword });
  return res.data;
};

export const fetchWorkerProfile = async () => {
  const res = await API.get(`/users/all-workers`);
  return res.data; 
};

// ✅ Fetch worker profile by user ID
export const fetchWorkerById = async (id) => {
  const { data } = await API.get(`/users/workers/${id}`);
  return data;
};

export const updateWorkerProfile = async (formData) => {
  const res = await API.put('/users/update-worker-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// Resend verification email
export const resendVerification = async (email) => {
  const res = await API.post('/users/resend-verification', { email });
  return res.data;
};