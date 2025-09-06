import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, TrendingUp, AlertCircle, Trash2, Eye, Search, DollarSign, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';

const Admin = () => {
  // --- States ---
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalWorkers: 0,
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
  });

  const [allUsers, setAllUsers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // --- Contexts ---
  const { user, clients, workers, workerNum, clientNum, countActiveJobs } = useAuth();
  const { jobs } = useJobs();

  // --- Effects ---
  useEffect(() => {
    setTimeout(() => {
      // Stats
      setStats({
        totalUsers: clientNum + workerNum,
        totalClients: clientNum,
        totalWorkers: workerNum,
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => job.status === 'active').length,
        completedJobs: jobs.filter(job => job.status === 'completed').length,
      });

      // Users
      setAllUsers([...clients, ...workers]);

      // Invoices (demo)
      setInvoices([
        { id: 1, client: 'John Doe', description: 'Web Development Project', amount: 300, status: 'paid', due_date: new Date('2024-08-15').toISOString() },
        { id: 2, client: 'Peter Jones', description: 'Logo Design', amount: 150, status: 'pending', due_date: new Date('2024-08-30').toISOString() },
        { id: 3, client: 'Jane Smith', description: 'Consulting Fee', amount: 50, status: 'overdue', due_date: new Date('2024-07-01').toISOString() },
        { id: 4, client: 'Alice Johnson', description: 'Analytics Report', amount: 250, status: 'paid', due_date: new Date('2024-08-01').toISOString() },
      ]);

      setLoading(false);
    }, 1000);
  }, [clients, workers, jobs, clientNum, workerNum]);

  // --- Utilities ---
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB' }).format(amount);
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getJobStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getInvoiceStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // --- User Actions ---
  const handleDeleteUser = (userId) => { setUserToDelete(userId); setConfirmOpen(true); };
  const confirmDeleteUser = () => { setAllUsers(allUsers.filter(user => user._id !== userToDelete)); toast.success("User deleted successfully"); setConfirmOpen(false); setUserToDelete(null); };
  const cancelDeleteUser = () => { setConfirmOpen(false); setUserToDelete(null); };
  const handleSuspendUser = (userIdToSuspend) => { setAllUsers(allUsers.map(user => user._id === userIdToSuspend ? { ...user, status: 'suspended' } : user)); toast.success("User suspended"); };
  const handleActivateUser = (userIdToActivate) => { setAllUsers(allUsers.map(user => user._id === userIdToActivate ? { ...user, status: 'active' } : user)); toast.success("User activated"); };

  // --- Job Actions ---
  const handleDeleteJob = (jobId) => { toast.success(`Deleting job with ID: ${jobId}`); };
  const handleViewJob = (jobId) => { toast.success(`Viewing job details for job with ID: ${jobId}`); };

  // --- Billing Actions ---
  const handleDeleteInvoice = (invoiceId) => { setInvoices(invoices.filter(invoice => invoice.id !== invoiceId)); toast.success("Invoice deleted"); };
  const handleSendReminder = (invoiceId) => { toast.success(`Reminder sent for invoice ID: ${invoiceId}`); };

  // --- Filter Users ---
  const filteredUsers = allUsers.filter(user => user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Loading data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage users, jobs, and billing systems</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          {[
            { label: 'Total Users', icon: <Users />, value: stats.totalUsers },
            { label: 'Clients', icon: <Users />, value: stats.totalClients },
            { label: 'Workers', icon: <Users />, value: stats.totalWorkers },
            { label: 'Total Jobs', icon: <Briefcase />, value: stats.totalJobs },
            { label: 'Active Jobs', icon: <TrendingUp />, value: stats.activeJobs },
            { label: 'Completed Jobs', icon: <AlertCircle />, value: stats.completedJobs },
          ].map(({ label, icon, value }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 * i }} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="bg-gray-100 p-3 rounded-lg">{icon}</div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button onClick={() => setActiveTab('users')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Users Management</button>
            <button onClick={() => setActiveTab('jobs')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'jobs' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Jobs Management</button>
            <button onClick={() => setActiveTab('billing')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'billing' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Billing</button>
          </nav>
        </div>

        {/* --- Users Management --- */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Users Management</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown User'}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize text-sm">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status || 'active')}`}>{user.status || 'active'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                        {user.status === 'suspended' ? (
                          <button onClick={() => handleActivateUser(user._id)} className="text-green-600 hover:text-green-900 cursor-pointer" title="Activate User"><AlertCircle className="h-4 w-4" /></button>
                        ) : (
                          <button onClick={() => handleSuspendUser(user._id)} className="text-yellow-600 hover:text-yellow-900" title="Suspend User"><AlertCircle className="h-4 w-4" /></button>
                        )}
                        <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900 cursor-pointer" title="Delete User"><Trash2 className="h-4 w-4 " /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* --- Jobs Management --- */}
        {activeTab === 'jobs' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.workerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getJobStatusColor(job.status)}`}>{job.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                      <button onClick={() => handleViewJob(job._id)} className="text-blue-600 hover:text-blue-900 cursor-pointer" title="View Job"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteJob(job._id)} className="text-red-600 hover:text-red-900 cursor-pointer" title="Delete Job"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* --- Billing --- */}
        {activeTab === 'billing' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(invoice.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getInvoiceStatusColor(invoice.status)}`}>{invoice.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(invoice.due_date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                      <button onClick={() => handleSendReminder(invoice.id)} className="text-yellow-600 hover:text-yellow-900 cursor-pointer" title="Send Reminder"><Bell className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteInvoice(invoice.id)} className="text-red-600 hover:text-red-900 cursor-pointer" title="Delete Invoice"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* --- Confirmation Modal --- */}
        {confirmOpen && (
          <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
              <p className="mt-2 text-gray-600">Are you sure you want to delete this user? This action cannot be undone.</p>
              <div className="flex justify-end mt-6 space-x-3">
                <button onClick={cancelDeleteUser} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer">Cancel</button>
                <button onClick={confirmDeleteUser} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
