import express from 'express';
import 'dotenv/config';
import connectDB from './configs/db.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import protectedRouter from './routes/protectedRoutes.js';
import jobRoutes from './routes/jobRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import requestRoutes from "./routes/requestRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js";
import paymentRequestRouter from './routes/paymentRequestRoutes.js';
import subscriptionPaymentRouter from './routes/subscriptionPaymentRoutes.js';

// Initialize express
const app = express();

// Connect to database
await connectDB();


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));           // Parse URL-encoded bodies (form data)

// Mount user routes
app.use('/api/users', userRoutes);
app.use('/api', protectedRouter);
app.use("/api/jobs", jobRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/applications", applicationRoutes);
app.use('/api/reviews', reviewRoutes)
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/payment-requests', paymentRequestRouter);
app.use('/api/subscription-payments', subscriptionPaymentRouter);


// Basic security header
app.disable('x-powered-by');




// Test route
app.get('/', (req, res) => res.send("Server is running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
