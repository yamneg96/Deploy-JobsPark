import express from 'express';
import { 
  registerAdmin,
  registerClient, 
  registerWorker, 
  requestPasswordReset, 
  resendVerificationEmail, 
  resetPassword, 
  verifyEmail
} from '../controllers/userControllers.js';

import { login, getMe, logout } from '../controllers/authController.js';
import { authorize, protect } from '../middleware/auth.js';

import { getAllClients, getClientById,  updateClientProfile } from '../controllers/clientController.js';
import { getAllWorkers, getWorkerById, getWorkerProfile, updateWorkerProfile } from '../controllers/workerController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Registration & Auth
router.post('/register/client', registerClient);
router.post('/register/worker', registerWorker);
router.post('/register/admin', registerAdmin);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail)
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout);

 

// Worker Profile
router.put(
  '/update-worker-profile',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'portfolio', maxCount: 10 },
  ]),
  protect, authorize('worker'),
  updateWorkerProfile
);
router.get('/worker-profile/:id',  getWorkerProfile);
router.get("/workers/:id", protect, getWorkerById);
router.get('/all-workers',protect,  getAllWorkers);

// Client Profile

router.put('/client-profile', protect, authorize('client'), upload.single('image'),  updateClientProfile);
router.get('/client/:id', protect, getClientById);
router.get('/all-clients', getAllClients);

export default router;
