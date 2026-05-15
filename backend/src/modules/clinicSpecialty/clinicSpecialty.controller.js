import clinicSpecialtyService from './clinicSpecialty.service.js';

export default {
  async getByClinic(req, res) {
    try {
      const { clinicId } = req.params;
      const data = await clinicSpecialtyService.getByClinic(clinicId);
      res.json({ data });
    } catch (error) {
      console.error('Get clinic specialties error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async getBySpecialty(req, res) {
    try {
      const { specialtyId } = req.params;
      const data = await clinicSpecialtyService.getBySpecialty(specialtyId);
      res.json({ data });
    } catch (error) {
      console.error('Get specialty clinics error:', error);
      const statusCode = error.message === 'Invalid specialty ID' ? 400 : 500;
      res.status(statusCode).json({ message: error.message });
    }
  },

  async assign(req, res) {
    try {
      const { clinicId } = req.params;
      const { specialtyIds } = req.body;

      if (!specialtyIds || !Array.isArray(specialtyIds)) {
        return res.status(400).json({ message: 'specialtyIds phải là một mảng' });
      }

      await clinicSpecialtyService.assignSpecialtiesToClinic(clinicId, specialtyIds);
      const updated = await clinicSpecialtyService.getByClinic(clinicId);
      
      res.json({ 
        message: 'Gán chuyên khoa thành công', 
        data: updated 
      });
    } catch (error) {
      console.error('Assign specialties error:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Chuyên khoa đã được gán cho phòng khám này' });
      }
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async add(req, res) {
    try {
      const { clinicId, specialtyId } = req.body;

      if (!clinicId || !specialtyId) {
        return res.status(400).json({ message: 'clinicId và specialtyId là bắt buộc' });
      }

      const data = await clinicSpecialtyService.create(clinicId, specialtyId);
      res.status(201).json({ data, message: 'Gán chuyên khoa thành công' });
    } catch (error) {
      console.error('Add clinic specialty error:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Chuyên khoa đã được gán cho phòng khám này' });
      }
      const statusCode = error.message.includes('Invalid') ? 400 : 500;
      res.status(statusCode).json({ message: error.message });
    }
  },

  async remove(req, res) {
    try {
      const { clinicId, specialtyId } = req.params;
      await clinicSpecialtyService.delete(clinicId, specialtyId);
      res.json({ message: 'Xóa chuyên khoa khỏi phòng khám thành công' });
    } catch (error) {
      console.error('Remove clinic specialty error:', error);
      const statusCode = error.message.includes('Invalid') ? 400 : 500;
      res.status(statusCode).json({ message: error.message });
    }
  },
};
