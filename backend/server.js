import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDatabase from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173',
];

connectDatabase();

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Blog Post Management API is running',
  });
});

app.use('/api', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/author', authorRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n[FATAL ERROR]: Port ${port} is already in use!`);
    console.error(`A stray process is likely running on this port. To fix this, run:`);
    console.error(`  PowerShell: Stop-Process -Id (Get-NetTCPConnection -LocalPort ${port}).OwningProcess -Force`);
    console.error(`  CMD: taskkill /F /PID <PID_found_via_netstat>\n`);
    process.exit(1);
  } else {
    console.error('Server encountered an error:', error);
  }
});
