/** @format */

import express from "express";
import cors from "cors";
import dotnev from "dotenv";

import authRoutes from "./modules/auth/auth.route.js";
import doctorRoutesDB from "./routes/doctorRoutesDB.js";
import adminRoutes from "./routes/adminRoutes.js";

import userRoutes from "./modules/users/user.route.js";
import doctorRoutes from "./modules/doctors/doctor.routes.js";
import departmentRoutes from "./modules/departments/department.routes.js";
import schedulesRoutes from "./modules/schedules/schedules.routes.js";
import availabilityRoutes from "./modules/availability/availability.routes.js";
import appointmentRoutes from "./modules/appointments/appointment.route.js";
import patientRoutes from "./modules/patients/patient.route.js";
import specialtyRoutes from "./modules/specialty/specialty.routes.js";
import clinicRoutes from "./modules/clinics/clinics.routes.js";
import roomRoutes from "./modules/rooms/rooms.routes.js";
import paymentRoutes from "./modules/payments/payment.route.js";
import messageRoutes from "./modules/messages/message.route.js";
import feedbackRoutes from "./modules/feedback/feedback.route.js";
import doctorClinicRoutes from "./modules/doctorClinic/doctorClinic.routes.js";
import serviceCategoryRoutes from "./modules/serviceCategory/serviceCategory.routes.js";
import clinicSpecialtyRoutes from "./modules/clinicSpecialty/clinicSpecialty.routes.js";
// import recordRoutes from './modules/medical-records/record.route.js';
import path from "path";
import { fileURLToPath } from "url";
import { authenticateToken } from "./middlewares/auth.middleware.js";

dotnev.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use absolute path for uploads directory (project root + /uploads)
const uploadsDir = path.resolve(__dirname, "../uploads");

// Serve static files with no-cache headers for images
// This ensures updated images are shown immediately after upload
app.use(
  "/uploads",
  (req, res, next) => {
    // Set headers to prevent browser caching
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });
    next();
  },
  express.static(uploadsDir, (err, req, res, next) => {
    // Handle 404 for missing files gracefully
    if (err && err.code === "ENOENT") {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }
    next(err);
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutesDB);
app.use("/api/admin", adminRoutes);

app.use("/api/users", userRoutes);
app.use("/api/schedules", schedulesRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/specialties", specialtyRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/doctor-clinic", doctorClinicRoutes);
app.use("/api/service-categories", serviceCategoryRoutes);
app.use("/api/clinic-specialties", clinicSpecialtyRoutes);
// app.use('/api/record', recordRoutes);
app.get("/", (req, res) => {
  res.send("HealthCare API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

export default app;
