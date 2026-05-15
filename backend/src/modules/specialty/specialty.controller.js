import specialtyService from '../specialty/specialty.service.js';

const specialtyController = {
  // GET /api/specialties
  getAllSpecialties: async (req, res) => {
    try {
      const filters = {
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        isActive: req.query.isActive,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
        categoryId: req.query.categoryId,
        categorySlug: req.query.categorySlug,
      };

      const result = await specialtyService.getAllSpecialties(filters);

      res.status(200).json({
        success: true,
        message: 'Get all specialties successfully',
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting specialties',
        error: error.message,
      });
    }
  },

  // GET /api/specialties/popular
  getPopularSpecialties: async (req, res) => {
    try {
      const limit = req.query.limit || 10;
      const specialties = await specialtyService.getPopularSpecialties(limit);

      res.status(200).json({
        success: true,
        message: 'Get popular specialties successfully',
        data: specialties,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting popular specialties',
        error: error.message,
      });
    }
  },

  // GET /api/specialties/:id
  getSpecialtyById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ success: false, message: 'Invalid specialty ID' });
      }
      const specialty = await specialtyService.getSpecialtyById(id);

      res.status(200).json({
        success: true,
        message: 'Get specialty successfully',
        data: specialty,
      });
    } catch (error) {
      const statusCode = error.message === 'Specialty not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET /api/specialties/slug/:slug
  getSpecialtyBySlug: async (req, res) => {
    try {
      const { slug } = req.params;
      const specialty = await specialtyService.getSpecialtyBySlug(slug);

      res.status(200).json({
        success: true,
        message: 'Get specialty successfully',
        data: specialty,
      });
    } catch (error) {
      const statusCode = error.message === 'Specialty not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET /api/specialties/slug/:slug/detail - Full detail with doctors, clinics, schedules, insurances
  getSpecialtyDetail: async (req, res) => {
    try {
      const { slug } = req.params;
      const { city, date } = req.query;
      const result = await specialtyService.getSpecialtyDetail(slug, { city, date });

      res.status(200).json({
        success: true,
        message: 'Get specialty detail successfully',
        ...result,
      });
    } catch (error) {
      const statusCode = error.message === 'Specialty not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET /api/specialties/category/:categorySlug
  getSpecialtiesByCategory: async (req, res) => {
    try {
      const { categorySlug } = req.params;
      const result = await specialtyService.getSpecialtiesByCategory(categorySlug);

      res.status(200).json({
        success: true,
        message: 'Get specialties by category successfully',
        ...result,
      });
    } catch (error) {
      const statusCode = error.message === 'Category not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  },

  // POST /api/specialties (với upload ảnh)
  createSpecialty: async (req, res) => {
    try {
      const specialty = await specialtyService.createSpecialty(
        req.body,
        req.files,
      );

      res.status(201).json({
        success: true,
        message: 'Create specialty successfully',
        data: specialty,
      });
    } catch (error) {
      const statusCode = error.message.includes('already exists') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  },

  // PUT /api/specialties/:id (với upload ảnh)
  updateSpecialty: async (req, res) => {
    try {
      const { id } = req.params;
      const specialty = await specialtyService.updateSpecialty(
        id,
        req.body,
        req.files,
      );

      res.status(200).json({
        success: true,
        message: 'Update specialty successfully',
        data: specialty,
      });
    } catch (error) {
      const statusCode =
        error.message === 'Specialty not found'
          ? 404
          : error.message.includes('already exists')
            ? 400
            : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  },

  // DELETE /api/specialties/:id
  deleteSpecialty: async (req, res) => {
    try {
      const { id } = req.params;
      const hardDelete = req.query.hard === 'true';

      const result = await specialtyService.deleteSpecialty(id, hardDelete);

      res.status(200).json({
        success: true,
        message: hardDelete
          ? 'Delete specialty successfully'
          : 'Deactivate specialty successfully',
        data: result,
      });
    } catch (error) {
      const statusCode =
        error.message === 'Specialty not found'
          ? 404
          : error.message.includes('Cannot delete')
            ? 400
            : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  },

  // PATCH /api/specialties/:id/priority
  updatePriority: async (req, res) => {
    try {
      const { id } = req.params;
      const { priority } = req.body;

      if (priority === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Priority is required',
        });
      }

      const specialty = await specialtyService.updatePriority(id, priority);

      res.status(200).json({
        success: true,
        message: 'Update priority successfully',
        data: specialty,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // PATCH /api/specialties/:id/toggle-active
  toggleActive: async (req, res) => {
    try {
      const { id } = req.params;
      const specialty = await specialtyService.toggleActive(id);

      res.status(200).json({
        success: true,
        message: `Specialty ${
          specialty.isActive ? 'activated' : 'deactivated'
        } successfully`,
        data: specialty,
      });
    } catch (error) {
      const statusCode = error.message === 'Specialty not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET /api/specialties/clinic/:clinicId - Lấy chuyên khoa theo clinic ID
  getSpecialtiesByClinic: async (req, res) => {
    try {
      const { clinicId } = req.params;
      const result = await specialtyService.getSpecialtiesByClinic(clinicId);

      res.status(200).json({
        success: true,
        message: 'Get specialties by clinic successfully',
        data: result,
      });
    } catch (error) {
      const statusCode = error.message === 'Clinic not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET /api/specialties/clinic/slug/:clinicSlug - Lấy chuyên khoa theo clinic slug
  getSpecialtiesByClinicSlug: async (req, res) => {
    try {
      const { clinicSlug } = req.params;
      const result = await specialtyService.getSpecialtiesByClinicSlug(clinicSlug);

      res.status(200).json({
        success: true,
        message: 'Get specialties by clinic successfully',
        data: result,
      });
    } catch (error) {
      const statusCode = error.message === 'Clinic not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  },
};

export default specialtyController;
