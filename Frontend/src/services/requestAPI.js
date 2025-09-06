import API from "./axios";

export const sendRequest = async(request) => {
  const res = await API.post('/requests', request);
  return res.data;
};

export const getRequest = async(workerId) => {
  const res = await API.get(`/requests/my?worker_id=${workerId}`);
  return res.data;
};

export const replyRequest = async(reqId, status) => {
  const res = await API.patch(`/requests/${reqId}/status`, {status});
  return res.data;
};

export const getClientRequests = async(client_id) => {
  const res = await API.get(`/requests/client-request-status?client_id=${client_id}`);
  return res.data;
};