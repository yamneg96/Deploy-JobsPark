// src/context/AuthContext.jsx
import { createContext, use, useContext, useEffect, useState } from 'react';
import { 
  getCurrentUser, 
  logout as logoutService, 
  fetchWorkerById,
  fetchWorkerProfile as fetchAllWorkers
} from '../services/auth';

import {
  fetchClientById,
  fetchClientProfile as fetchAllClients,
} from '../services/profileAPI'

import { getRequest } from '../services/requestAPI'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userLoc, setUserLoc] = useState('');
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');

  //Worker & Client Profile
  const [wProf, setWProf] = useState(null);
  const [cProf, setCProf] = useState(null);

  const [workerId, setWorkerId] = useState(null);
  const [clientId, setClientId] = useState(null);

  const [skill, setSkill] = useState('');

  const [wPic, setWPic] = useState(null);
  const [cPic, setCPic] = useState(null);

  const [workerBio, setWorkerBio] = useState('');
  const [clientBio, setClientBio] = useState('');

  const [workerName, setWorkerName] = useState(null);
  const [clientName, setClientName] = useState(null);

  const [workerLoc, setWorkerLoc] = useState('');
  const [clientLoc, setClientLoc] = useState('');
  
  //All Workers & Clients
  const [workers, setWorkers] = useState([]);
  const [workerNum, setWorkerNum] = useState();
  const [clients, setClients] = useState([]);
  const [clientNum, setClientNum] = useState();

  //Requesting Job data
  const [reqs, setReqs] = useState([]);

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res);
      setUserRole(res.role);
      setUserEmail(res.email);
      setUserLoc(res.address);
      setUserId(res._id);
      setUserName(res.name);
    } catch {
      setUser(null);
      setUserRole(''); // Ensure user role is reset
    } finally {
      setLoading(false);
    }
  };

  const fetchClientList = async () => {
    try {
      const res = await fetchAllClients();
  //I have to iterate in the clients array later!
      const c1 = res[0];
      const cId = c1?._id || null;
      const cLoc = c1?.address || null;
      setClients(res);
      setClientNum(res.length);
    } catch (err) {
      console.error("Error fetching clients list:", err.response?.data || err.message);
      setClients([]);
    }
  };

  const fetchWorkersList = async () => {
    try {
      const res = await fetchAllWorkers();
  //I have to iterate in the workers array later!
      const w1 = res[0];
      const wId = w1?._id || null;
      setWorkers(res);
      setWorkerNum(res.length);
      // console.log("WorkerId:", wId);
      setWorkerName(w1.name);
      setWorkerId(wId);
      setWorkerLoc(w1.address)
    } catch (err) {
      console.error("Error fetching workers list:", err.response?.data || err.message);
      setWorkers([]);
    }
  };

  const fetchWorker = async (id) => {
    if (!id) return;
    try {
      const res = await fetchWorkerById(id);
      if (res) {
        const profile = res.profile;
        const profPic = profile?.image;
        const profBio = profile?.bio;
        setWProf(profile);
        // console.log(profile); // This Worked. ✅
        setSkill(profile?.skills[0]);
        setWPic(profPic);
        setWorkerBio(profBio);
      } else {
        console.warn("No worker profile found for this user");
        setWProf(null);
      }
    } catch (err) {
      console.error("Error fetching worker profile:", err.response?.data || err.message);
      setWProf(null);
    }
  };

  const fetchClient = async (id) => {
    if (!id) return;
    try {
      const res = await fetchClientById(id);
      if (res) {
        const profile = res.client;
        const profPic = profile?.image;
        const profBio = profile?.bio;
        setCProf(profile);
        setCPic(profPic);
        setClientBio(profBio);
      } else {
        console.warn("No worker profile found for this user");
        setCProf(null);
      }
    } catch (err) {
      console.error("Error fetching worker profile:", err.response?.data || err.message);
      setCProf(null);
    }
  };

  const fetchRequest = async (id) => {
    try {
      const res = await getRequest(id);
      if (res) {
        // console.log(res.requests);
        setReqs(res.requests);
        
      } else {
        console.warn("No worker profile found for this user");
      }
    } catch (err) {
      console.error("Error fetching worker profile:", err.response?.data || err.message);
    }
  };

  // useEffect(() => {
  //   const init = async () => {
  //     // Check for cached workers first
  //     const cachedWorkers = localStorage.getItem('cachedWorkers');
  //     if (cachedWorkers) {
  //       setWorkers(JSON.parse(cachedWorkers));
  //       setLoading(false); // Set loading to false since we have data
  //     } else {
  //       await fetchWorkersList();
  //       await fetchClientList();
  //     }
  //     // Fetch user data after checking for cached workers
  //     await fetchUser();
  //   };
  //   init();
  // }, []);

  // ✅ Call fetchUser once on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ Call fetchWorkersList once on component mount
  // This will ensure workers are fetched for both logged-in and logged-out users
  useEffect(() => {
    fetchWorkersList();
    fetchClientList();
  }, [workers]);

  // ✅ Keep this logic to fetch a specific worker's profile
  useEffect(() => {
    if (workerId) {
      fetchWorker(workerId);
      fetchClient(clientId);
      fetchRequest(workerId);
    }
  }, [workerId]);

  const logout = async () => {
    try {
      await logoutService();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUser(null);
      setWProf(null);
      setCProf(null);
      setUserRole('');
      setWorkers([]); // ✅ Reset workers on logout
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, userName, userId, setUser, loading, logout, userRole, userEmail, userLoc,
        workers, workerName, workerId, workerLoc, wProf, wPic, workerBio, skill, workerNum,
        clients, clientName, clientId, clientLoc, cProf, cPic, clientBio, clientNum,
        reqs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;