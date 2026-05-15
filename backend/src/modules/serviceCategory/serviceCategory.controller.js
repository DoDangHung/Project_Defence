import serviceCategoryService from './serviceCategory.service.js';

export default {
  async getAll(req, res) {
    try {
      const { isActive, withSpecialties } = req.query;
      let categories;
      
      if (withSpecialties === 'true') {
        categories = await serviceCategoryService.getAllWithSpecialties({
          isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        });
      } else {
        categories = await serviceCategoryService.getAll({
          isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        });
      }
      
      res.json({ data: categories, total: categories.length });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async getById(req, res) {
    try {
      const category = await serviceCategoryService.getById(parseInt(req.params.id));
      if (!category) {
        return res.status(404).json({ message: 'Không tìm thấy danh mục' });
      }
      res.json({ data: category });
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async getBySlug(req, res) {
    try {
      const category = await serviceCategoryService.getBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: 'Không tìm thấy danh mục' });
      }
      res.json({ data: category });
    } catch (error) {
      console.error('Get category error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async create(req, res) {
    try {
      const { name, description, icon, color, priority, isActive } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Tên danh mục là bắt buộc' });
      }

      const category = await serviceCategoryService.create({
        name,
        description,
        icon,
        color,
        priority,
        isActive,
      });

      res.status(201).json({ data: category, message: 'Tạo danh mục thành công' });
    } catch (error) {
      console.error('Create category error:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Tên danh mục đã tồn tại' });
      }
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async update(req, res) {
    try {
      const { name, description, icon, color, priority, isActive } = req.body;

      const existing = await serviceCategoryService.getById(parseInt(req.params.id));
      if (!existing) {
        return res.status(404).json({ message: 'Không tìm thấy danh mục' });
      }

      const category = await serviceCategoryService.update(parseInt(req.params.id), {
        name,
        description,
        icon,
        color,
        priority,
        isActive,
      });

      res.json({ data: category, message: 'Cập nhật thành công' });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async delete(req, res) {
    try {
      const existing = await serviceCategoryService.getById(parseInt(req.params.id));
      if (!existing) {
        return res.status(404).json({ message: 'Không tìm thấy danh mục' });
      }

      await serviceCategoryService.delete(parseInt(req.params.id));
      res.json({ message: 'Xóa danh mục thành công' });
    } catch (error) {
      console.error('Delete category error:', error);
      if (error.code === 'P2003') {
        return res.status(400).json({ message: 'Không thể xóa: có cơ sở y tế hoặc chuyên khoa đang sử dụng danh mục này' });
      }
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  async toggleStatus(req, res) {
    try {
      const existing = await serviceCategoryService.getById(parseInt(req.params.id));
      if (!existing) {
        return res.status(404).json({ message: 'Không tìm thấy danh mục' });
      }

      const category = await serviceCategoryService.toggleStatus(parseInt(req.params.id));
      res.json({ data: category, message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
      console.error('Toggle category status error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
};
