import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createJob, getJobs, updateJob, deleteJob, saveBookmark, getBookmarked } from '../services/jobAPI';
import { sendRequest, getRequest, replyRequest, getClientRequests } from '../services/requestAPI';
import { applyJobs, getAppliedJobs } from '../services/applicationAPI';
import { useAuth } from './AuthContext';
import {useLocation} from 'react-router-dom'
import {verifySubscriptionPayment} from '../services/subscriptionAPI'
import { createPaymentRequest, getClientPaymentRequests, getWorkerPaymentRequests, updatePaymentRequestStatus, initiatePayment, verifyPayment } from '../services/paymentAPI';

const JobsContext = createContext();

export const useJobs = () => useContext(JobsContext);

export const JobsProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId, workerId, userRole } = useAuth();

    const [appliedJobsLen, setAppliedJobsLen] = useState('');
    const [applyJobs, setApplyJobs] = useState([]);
    const [appliedStatus, setAppliedStatus] = useState(null);

    const [clientReq, setClientReq] = useState([]);
    const [reqStat, setReqStat] = useState('');
    const [reqLen, setReqLen] = useState('');

    // About Payment
    const [wReq, setWReq] = useState();
    const [clientPaymentReqs, setClientPaymentReqs] = useState([]);
    const [clientPaymentReqLoading, setClientPaymentReqLoading] = useState(false);

    const [payStatus, setPayStatus] = useState();

    //About Subscription Payment
    const [subsTxRef, setSubsTxRef] = useState(() => {
        try {
            const storedTxRef = window.localStorage.getItem('subsTxRef');
            return storedTxRef ? JSON.parse(storedTxRef) : null;
        } catch (error) {
            console.error('Failed to parse subsTxRef from localStorage:', error);
            return null;
        }
    });
    const [subsDetail, setSubsDetail] = useState(null);
    const location = useLocation();

    // Function to save the transaction reference to state and localStorage
    const saveSubsTxRef = (txRef) => {
        setSubsTxRef(txRef);
        try {
            window.localStorage.setItem('subsTxRef', JSON.stringify(txRef));
        } catch (error) {
            console.error('Failed to save subsTxRef to localStorage:', error);
        }
    };

    // Function to clear the transaction reference
    const clearSubsTxRef = () => {
        setSubsTxRef(null);
        window.localStorage.removeItem('subsTxRef');
    };

    // Function to fetch all jobs
    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await getJobs();
            const data = res.jobs;
            setJobs(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setError("Failed to fetch jobs.");
            toast.error("Failed to load jobs.");
        } finally {
            setLoading(false);
        }
    };

    // Function to post a new job
    const postJob = async (jobData) => {
        try {
            if (!userId) {
                toast.error("Please log in to post a job.");
                return { success: false, message: "User not authenticated." };
            }
            const res = await createJob(jobData, userId);
            fetchJobs();
            return { success: true, data: res };
        } catch (err) {
            console.error("Error posting job:", err);
            toast.error("Failed to post job.");
            return { success: false, message: "Failed to post job." };
        }
    };
    
    const updateExistingJob = async (jobId, updatedData) => {
        try {
            await updateJob(jobId, updatedData);
            fetchJobs();
            return { success: true };
        } catch (err) {
            console.error("Error updating job:", err);
            toast.error("Failed to update job.");
            return { success: false };
        }
    };
    
    const deleteExistingJob = async (jobId) => {
        try {
            await deleteJob(jobId);
            fetchJobs();
            return { success: true };
        } catch (err) {
            console.error("Error deleting job:", err);
            toast.error("Failed to delete job.");
            return { success: false };
        }
    };
    
    const saveJobBookmark = async(jobId) => {
        try {
            await saveBookmark(jobId);
            fetchJobs();
            return { success: true };
        } catch(err) {
            console.error("Error saving bookmark:", err);
            toast.error("Failed to save bookmark.");
            return { success: false };
        }
    };

    const fetchBookmarkedJobs = async () => {
        try {
            const data = await getBookmarked();
            return { success: true, data: data };
        } catch (err) {
            console.error("Error fetching bookmarked jobs:", err);
            toast.error("Failed to fetch bookmarked jobs.");
            return { success: false, data: [] };
        }
    };

    const applyForJob = async(appliedJob) => {
        try {
            await applyJobs(appliedJob);
            toast.success("Successfully applied to job!");
            return { success: true };
        } catch (err) {
            console.error("Error applying for job:", err);
            toast.error("Failed to apply for job.");
            return { success: false };
        }
    };

    const fetchAppliedJobs = async() => {
        try {
            const res = await getAppliedJobs();
            const appliedJobs = res.applications;
            const appliedStatus = res.success;
            const appliedJobsLen = appliedJobs.length;
            setApplyJobs(appliedJobs);
            setAppliedStatus(appliedStatus);
            setAppliedJobsLen(appliedJobsLen);
            return { success: true, data: res };
        } catch (err) {
            console.error("Error fetching applied jobs:", err);
            return { success: false, data: [] };
        }
    };

    const sendJobRequest = async(request) => {
        try {
            const res = await sendRequest(request);
            toast.success("Request sent successfully!");
            return { success: true, data: res };
        } catch (err) {
            console.error("Error sending request:", err);
            toast.error("Failed to send request.");
            return { success: false, message: "Failed to send request." };
        }
    };
    const countActiveJobs = () => {
        // A job is "active" if at least one worker application is accepted
        return jobs.filter(job => 
        job.applications?.some(app => app.status === "accepted")
       ).length;
    };

    const getWorkerRequests = async(workerId) => {
        try {
            const res = await getRequest(workerId);
            const reqs = res?.requests;
            const reqsStat = res?.success;
            const reqsLength = reqs?.lenght;
            setClientReq(reqs);
            setReqStat(reqsStat);
            setReqLen(reqsLength);
            return { success: true, data: res };
        } catch (err) {
            console.error("Error fetching worker requests:", err);
            return { success: false, data: [] };
        }
    };

    const replyToRequest = async(reqId, status) => {
        try {
            const res = await replyRequest(reqId, status);
            toast.success("Request status updated!");
            return { success: true, data: res };
        } catch (err) {
            console.error("Error replying to request:", err);
            toast.error("Failed to update request status.");
            return { success: false, message: "Failed to update request status." };
        }
    };

    const getClientJobRequests = async(clientId) => {
        try {
            const res = await getClientRequests(clientId);
            console.log(res);
            return { success: true, data: res };
        } catch (err) {
            console.error("Error fetching client requests:", err);
            toast.error("Failed to fetch client requests.");
            return { success: false, data: [] };
        }
    };

    const workerPaymentRequest = async(clientId, amount, message) => {
        try{
            const res = await createPaymentRequest(clientId, amount, message);
            setWReq(res);
            console.log(res);
            toast.success('payment request sent successfully.');
            return { success: true, data: res };
        } catch(err) {
            console.error("Error creating payment request:", err);
            toast.error("Failed to create payment request.");
            return { success: false, message: "Failed to create payment request." };
        }
    };

    // New function to fetch client payment requests
    const fetchClientPaymentRequests = async () => {
        setClientPaymentReqLoading(true);
        try {
            const res = await getClientPaymentRequests();
            const data = res.requests;
            setClientPaymentReqs(data);
        } catch (err) {
            console.error("Error fetching client payment requests:", err);
        } finally {
            setClientPaymentReqLoading(false);
        }
    };

    const fetchWorkerPaymentRequests = async () => {
        setClientPaymentReqLoading(true);
        try {
            const res = await getWorkerPaymentRequests();
            const data = res.requests;
            setClientPaymentReqs(data);
        } catch (err) {
            console.error("Error fetching client payment requests:", err);
        } finally {
            setClientPaymentReqLoading(false);
        }
    };

    const fetchPaymentRequests = async () => {
    setLoading(true);
    try {
        let res;
        if (userRole === 'client') {
        res = await getClientPaymentRequests();
        } else if (userRole === 'worker') {
        res = await getWorkerPaymentRequests();
        }

        if (res && res.success) {
        // console.log(res);To update a state here.
        }
    } catch (err) {
        console.error("Error fetching payment requests:", err);
    } finally {
        setLoading(false);
    }
    };

    // New function to update a payment request's status
    const updateClientPaymentStatus = async (requestId, newStatus) => {
        try {
            const updatedRequest = await updatePaymentRequestStatus(requestId, newStatus);
            // Update the state with the new status
            setClientPaymentReqs(prevReqs => 
                prevReqs.map(req => 
                    req._id === requestId ? { ...req, status: updatedRequest.request.status } : req
                )
            );
            toast.success(`Payment request ${newStatus}.`);
        } catch (err) {
            console.error("Error updating payment status:", err);
            toast.error("Failed to update status. Please try again.");
            return { success: false, message: "Failed to update status." };
        }
    };

    const handlePayment = async (workerId, amount) => {
        try {
            const res = await initiatePayment(workerId, amount);
            console.log(res);
            // setTxRef(res.tx_ref);
            if (res.success && res.checkout_url) {
                // Redirect the user to the Chapa checkout page
                window.location.href = res.checkout_url;
                toast.success("Redirecting to payment gateway...");
            } else {
                toast.error("Payment initiation failed. Please try again.");
            }
        } catch (err) {
            console.error("Error initiating payment:", err);
            toast.error("An error occurred while initiating payment.");
        }
    };

    const verifyPayment = async (txRefFromQuery) => {
        try {
            const res = await verifySubscriptionPayment(txRefFromQuery);
            console.log(res);
            setSubsDetail(res.payment);
            if (res.success) {
                saveSubsTxRef(res.tx_ref)
                console.log(subsTxRef);
                return res.payment;
            } else{
                clearSubsTxRef();
                throw new Error (res.message || 'Payment verification failed.')
            }
        } catch (err) {
            clearSubsTxRef();
            throw err;
        }
    };
    
    useEffect(() => {
        fetchJobs();
        getWorkerRequests(workerId);
        fetchAppliedJobs();
        fetchBookmarkedJobs();
        fetchClientPaymentRequests();
        fetchPaymentRequests();
        fetchWorkerPaymentRequests()
        
        // Check URL for tx_ref and save it
        const query = new URLSearchParams(location.search);
        const txRefFromQuery = query.get('tx_ref');

        if (txRefFromQuery) {
            saveSubsTxRef(txRefFromQuery);
        }
    }, [workerId, location.search]);
    
    // This effect runs when subsTxRef changes to verify payment status
    useEffect(() => {
        if (subsTxRef) {
            const verify = async () => {
                try {
                    await verifyPayment(subsTxRef);
                } catch (err) {
                    console.error('Error verifying stored transaction:', err);
                }
            };
            verify();
        }
    }, [subsTxRef, workerId]);

    return (
        <JobsContext.Provider value={{
        jobs,
        loading,
        error,

        //About Applied Jobs
        applyJobs,
        appliedStatus,
        setAppliedStatus,

        clientReq,
        reqLen,
        reqStat,
        appliedJobsLen,

        // About Payment
        wReq,
        workerPaymentRequest,
        clientPaymentReqs,
        clientPaymentReqLoading,
        updateClientPaymentStatus,

        //PayVerificaiton
        payStatus,
        setPayStatus,

        //Initiate Bill Payment
        handlePayment,

        //Verify Subscription Payment
        verifyPayment,
        subsTxRef,
        subsDetail,
        saveSubsTxRef,

        postJob,
        updateExistingJob,
        deleteExistingJob,
        saveJobBookmark,
        fetchBookmarkedJobs,
        applyForJob,
        fetchAppliedJobs,
        sendJobRequest,
        getWorkerRequests,
        replyToRequest,
        getClientJobRequests,
        countActiveJobs,
    }}>
            {children}
        </JobsContext.Provider>
    );
};