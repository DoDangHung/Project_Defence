import express from 'express';
import cors from 'cors';
import dotnev from 'dotenv';
import userRoutes from './routes/user.routes.js';
import doctorRoutes from './modules/doctors/doctor.routes.js';
import departmentRoutes from './modules/departments/department.routes.js';
import schedulesRoutes from './modules/schedules/schedules.routes.js';
import availabilityRoutes from './modules/availability/availability.routes.js';
import appointmentRoutes from './modules/appointments/appointment.route.js';

dotnev.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => {
  res.send('HealthCare API is running');
});

export default app;
