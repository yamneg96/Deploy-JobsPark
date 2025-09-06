import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Client from './pages/Client';
import Worker from './pages/Worker';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Payment from './pages/Payment';
import Verifyemail from './pages/Verifyemail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import WorkerDashboard from "./pages/WorkerDashboard";
import WorkerProfile from "./components/WorkerProfile";
import ClientProfile from "./components/ClientProfile";
import PostJob from "./components/JobPost";
import CompletedJobModal from "./components/CompletedJobModal";
import PaymentPopUp from './components/PaymentPopUp';
import SubsPay from './pages/SubsPay';
import PayReturn from './pages/PayReturn';
import AdminProfile from './pages/AdminProfile';

import { AuthProvider } from './context/AuthContext';
import { JobsProvider } from './context/JobsContext';

import ReviewPage from './pages/ReviewPage';

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AuthProvider>
        <JobsProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/client" element={<Client />} />
              <Route path="/worker" element={<Worker />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/choose-payment" element={<PaymentPopUp />} />
              <Route path='/subscription-success' element={<SubsPay />} />
              <Route path='/payment-success' element={<PayReturn />} />
              <Route path="/verify-email/:token" element={<Verifyemail />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password/:token' element={<ResetPassword />} />
              <Route path="/worker-dashboard" element={<WorkerDashboard />} />
              <Route path="/worker-profile" element={<WorkerProfile />} />
              <Route path="/client-profile" element={<ClientProfile />} />
              <Route path='/admin-profile' element={<AdminProfile />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/make-payment" element={<CompletedJobModal />} />
              <Route path='/review-page' element={<ReviewPage />} />
            </Route>
          </Routes>
        </JobsProvider>
      </AuthProvider>
    </>
  );
}

export default App;
