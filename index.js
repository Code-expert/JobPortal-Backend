import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoDb from './Connection/connect.js';
import userRouter from './Routes/User.js';
import companyRouter from './Routes/Company.js';
import jobRouter from './Routes/Job.js';
import applicationRouter from './Routes/Application.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Get the correct directory path in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares...
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "https://jobifyhub.vercel.app",
  credentials: true, // Ensure cookies are sent
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// API Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/company', companyRouter);
app.use('/api/v1/job', jobRouter);
app.use('/api/v1/application', applicationRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Job Portal');
});

// Serve frontend **after** API routes
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  mongoDb();
  console.log(`Server is running on port ${PORT}`);
});
