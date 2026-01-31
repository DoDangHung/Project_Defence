import express from 'express';
import cors from 'cors';
import dotnev from 'dotenv';

import authRoutes from './modules/auth/auth.route.js';
import doctorRoutesDB from './routes/doctorRoutesDB.js';
import adminRoutes from './routes/adminRoutes.js';

import userRoutes from './modules/users/user.route.js';
import doctorRoutes from './modules/doctors/doctor.routes.js';
import departmentRoutes from './modules/departments/department.routes.js';
import schedulesRoutes from './modules/schedules/schedules.routes.js';
import availabilityRoutes from './modules/availability/availability.routes.js';
import appointmentRoutes from './modules/appointments/appointment.route.js';
import patientRoutes from './modules/patients/patient.route.js';
import specialtyRoutes from './modules/specialty/specialty.routes.js';
import clinicRoutes from './modules/clinics/clinics.routes.js';
import roomRoutes from './modules/rooms/rooms.routes.js';
import paymentRoutes from './modules/payments/payment.route.js';
import recordRoutes from './modules/medical-records/record.route.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken } from './middlewares/auth.middleware.js';

dotnev.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutesDB);
app.use('/api/admin', adminRoutes);

app.use('/api/users', userRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/doctors', authenticateToken, doctorRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/specialty', specialtyRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/record', recordRoutes);
app.get('/', (req, res) => {
  res.send('HealthCare API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
