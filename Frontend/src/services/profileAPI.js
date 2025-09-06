import API from "./axios";

// Client Profile management
export const fetchClientProfile = async () => {
  const res = await API.get('/users/all-clients');
  return res.data;
};

export const updateClientProfile = async (formData) => {
  const res = await API.put('/users/client-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const fetchClientById = async (id) => {
  const { data } = await API.get(`/users/client/${id}`);
  return data;
};

// Admin Profile Management
export const updateAdminProfile = async(formData) => {
  const res = await API.put('/admin/admin-profile', formData, {
    headers : {
      "Content-Type" : "multipart/form-data"
    },
  });
  return res.data;
}
