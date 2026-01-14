import { clinicsController } from './clinics.controller.js';
import { uploadLogo, uploadClinicImages } from '../../config/multer.js';
import express from 'express';
const router = express.Router();
// Tạo clinic với logo và images
router.post(
  '/',
  uploadLogo.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  clinicsController.createClinic
);
router.get('/statistics', clinicsController.getClinicStatistics);
router.post(
  '/:clinicId/specialties',
  clinicsController.assignSpecialtiesToClinic
);
router.get('/:clinicId/specialties', clinicsController.getClinicSpecialties);
// Đảm bảo route có :id parameter
router.get('/:id/doctors', clinicsController.getClinicDoctors);
router.post('/:clinicId/doctors', clinicsController.assignDoctorsToClinic);
router.get('/nearby', clinicsController.searchClinicsNearby);
router.get('/slug/:slug', clinicsController.getClinicBySlug);
// CRUD operations
router.get('/:id', clinicsController.getClinicById);
router.get('/', clinicsController.getAllClinics);
router.post('/', clinicsController.createClinic);
router.put('/:id', clinicsController.updateClinic);
router.patch('/:id/toggle-status', clinicsController.toggleClinicStatus);
router.delete('/:id', clinicsController.deleteClinic);
// Clinic doctors và appointments
router.get('/:id/doctors', clinicsController.getClinicDoctors);
router.get('/:id/appointments', clinicsController.getClinicAppointments);
// Upload/Update logo
router.put(
  '/:id/logo',
  uploadLogo.single('logo'),
  clinicsController.updateClinicLogo
);

// Add images to gallery
router.post(
  '/:id/images',
  uploadClinicImages.array('images', 10),
  clinicsController.addClinicImages
);

// Remove image from gallery
router.delete('/:id/images', clinicsController.removeClinicImage);

// ... các routes khác

export default router;
