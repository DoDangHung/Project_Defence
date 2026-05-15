import prisma from '../../config/db.js';
import { clinicService } from './clinics.service.js';

// TẠO CLINIC VỚI LOGO VÀ IMAGES
export const clinicsController = {
  getAllClinics: async (req, res) => {
    try {
      const filters = req.query;
      const result = await clinicService.getAllClinics(filters);

      res.status(200).json({
        success: true,
        message: 'Clinics retrieved successfully',
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving clinics',
        error: error.message,
      });
    }
  },

  assignSpecialtiesToClinic: async (req, res) => {
    try {
      const { clinicId } = req.params;
      const { specialtyIds } = req.body;

      if (!clinicId || !Array.isArray(specialtyIds)) {
        return res.status(400).json({
          success: false,
          message: 'clinicId and specialtyIds are required',
        });
      }

      const result = await clinicService.assignSpecialtiesToClinic(
        Number(clinicId),
        specialtyIds.map(Number)
      );
      res.status(200).json({
        success: true,
        message: 'Specialties assigned to clinic successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error assigning specialties to clinic',
        error: error.message,
      });
    }
  },

  assignDoctorsToClinic: async (req, res) => {
    try {
      const clinicId = Number(req.params.clinicId);
      const { doctorIds } = req.body;

      const result = await clinicService.assignDoctorsToClinic(
        clinicId,
        doctorIds
      );

      res.json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // GET /api/clinics/:id
  getClinicById: async (req, res) => {
    try {
      const { id } = req.params;
      const clinic = await clinicService.getClinicById(id);

      res.status(200).json({
        success: true,
        message: 'Clinic retrieved successfully',
        data: clinic,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  },

  getClinicSpecialties: async (req, res) => {
    try {
      const { clinicId } = req.params;

      const specialties = await prisma.clinicSpecialty.findMany({
        where: { clinicId: Number(clinicId) },
        include: {
          specialty: true,
        },
      });

      return res.json({
        success: true,
        data: specialties.map((cs) => cs.specialty),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // GET /api/clinics/slug/:slug
  getClinicBySlug: async (req, res) => {
    try {
      const { slug } = req.params;
      const clinic = await clinicService.getClinicBySlug(slug);

      res.status(200).json({
        success: true,
        message: 'Clinic retrieved successfully',
        data: clinic,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  },
  createClinic: async (req, res) => {
    try {
      // Xử lý JSON body (logo là URL string)
      const clinic = await clinicService.createClinic(req.body, null, []);

      res.status(201).json({
        success: true,
        message: 'Clinic created successfully',
        data: clinic,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error creating clinic',
        error: error.message,
      });
    }
  },

  // POST /api/clinics/upload - với upload file
  createClinicWithUpload: async (req, res) => {
    try {
      const logoFile = req.files && req.files['logo'] ? req.files['logo'][0] : null;
      const imageFiles = (req.files && req.files['images']) || [];

      const clinic = await clinicService.createClinic(req.body, logoFile, imageFiles);

      res.status(201).json({
        success: true,
        message: 'Clinic created successfully',
        data: clinic,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error creating clinic',
        error: error.message,
      });
    }
  },

  // PUT /api/clinics/:id
  updateClinic: async (req, res) => {
    try {
      const { id } = req.params;
      const clinic = await clinicService.updateClinic(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Clinic updated successfully',
        data: clinic,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error updating clinic',
        error: error.message,
      });
    }
  },
  // CẬP NHẬT LOGO
  updateClinicLogo: async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No logo uploaded',
        });
      }

      const clinic = await clinicService.updateClinicLogo(id, req.file);

      res.status(200).json({
        success: true,
        message: 'Clinic logo updated successfully',
        data: clinic,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error updating logo',
        error: error.message,
      });
    }
  },

  // DELETE /api/clinics/:id
  deleteClinic: async (req, res) => {
    try {
      const { id } = req.params;
      await clinicService.deleteClinic(id);

      res.status(200).json({
        success: true,
        message: 'Clinic deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error deleting clinic',
        error: error.message,
      });
    }
  },

  // PATCH /api/clinics/:id/toggle-status
  toggleClinicStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const clinic = await clinicService.toggleClinicStatus(id);

      res.status(200).json({
        success: true,
        message: 'Clinic status updated successfully',
        data: clinic,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET /api/clinics/:id/doctors
  getClinicDoctors: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('Controller - clinicId from params:', id); // Debug

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Clinic ID is required',
        });
      }

      const filters = req.query;
      const result = await clinicService.getClinicDoctors(id, filters);

      res.status(200).json({
        success: true,
        message: 'Clinic doctors retrieved successfully',
        ...result,
      });
    } catch (error) {
      console.error('Error in getClinicDoctors:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving clinic doctors',
        error: error.message,
      });
    }
  },

  // GET /api/clinics/:id/appointments
  getClinicAppointments: async (req, res) => {
    try {
      const { id } = req.params;
      const filters = req.query;
      const result = await clinicService.getClinicAppointments(id, filters);

      res.status(200).json({
        success: true,
        message: 'Clinic appointments retrieved successfully',
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving clinic appointments',
        error: error.message,
      });
    }
  },

  // GET /api/clinics/statistics
  getClinicStatistics: async (req, res) => {
    try {
      const statistics = await clinicService.getClinicStatistics();

      res.status(200).json({
        success: true,
        message: 'Clinic statistics retrieved successfully',
        data: statistics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving clinic statistics',
        error: error.message,
      });
    }
  },

  // GET /api/clinics/nearby
  searchClinicsNearby: async (req, res) => {
    try {
      const { latitude, longitude, radius } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: 'Latitude and longitude are required',
        });
      }

      const clinics = await clinicService.searchClinicsNearby(
        latitude,
        longitude,
        radius
      );

      res.status(200).json({
        success: true,
        message: 'Nearby clinics retrieved successfully',
        data: clinics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching nearby clinics',
        error: error.message,
      });
    }
  },
  // THÊM IMAGES
  addClinicImages: async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images uploaded',
        });
      }

      const clinic = await clinicService.addClinicImages(id, req.files);

      res.status(200).json({
        success: true,
        message: 'Images added successfully',
        data: clinic,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error adding images',
        error: error.message,
      });
    }
  },

  // XÓA IMAGE
  removeClinicImage: async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({
          success: false,
          message: 'Image URL is required',
        });
      }

      const clinic = await clinicService.removeClinicImage(id, imageUrl);

      res.status(200).json({
        success: true,
        message: 'Image removed successfully',
        data: clinic,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error removing image',
        error: error.message,
      });
    }
  },
};
