import express from 'express';
import cors from 'cors';
import dotnev from 'dotenv';
import userRoutes from './routes/user.routes.js';
import doctorRoutes from './modules/doctors/doctor.routes.js';
import departmentRoutes from './modules/departments/department.routes.js';
dotnev.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);
app.get('/', (req, res) => {
  res.send('HealthCare API is running');
});

export default app;
