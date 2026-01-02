import prisma from '../../config/db.js';
import { generateTimeSlots } from '../../utils/slotGenerator.js';

export const appointmentService = {
  // Lấy tất cả appointments với filters
  getAllAppointments: async (filters = {}) => {
    const {
      status,
      doctorId,
      patientId,
      clinicId,
      date,
      page = 1,
      limit = 10,
    } = filters;

    const where = {};
    if (status) where.status = status;
    if (doctorId) where.doctorId = parseInt(doctorId);
    if (patientId) where.patientId = parseInt(patientId);
    if (clinicId) where.clinicId = parseInt(clinicId);
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              age: true,
              gender: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },

          doctor: {
            select: {
              id: true,
              specialization: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },

          clinic: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },

          schedule: true,
          feedback: true,
          payment: true,
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          date: 'desc',
        },
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Lấy appointment theo ID
  async getAppointmentById(id) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            dateOfBirth: true,
            gender: true,
            address: true,
          },
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
            email: true,
            phone: true,
          },
        },
        clinic: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          },
        },
        schedule: true,
        feedback: true,
        payment: true,
        satisfaction: true,
      },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    return appointment;
  },

  // Tạo appointment mới
  createAppointment: async (data) => {
    const {
      patientId,
      doctorId,
      clinicId,
      scheduleId,
      date,
      startTime,
      endTime,
      reason,
    } = data;

    // Kiểm tra xem bác sĩ có rảnh trong khung giờ này không
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: parseInt(doctorId),
        date: new Date(date),
        status: {
          not: 'cancelled',
        },
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } },
            ],
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } },
            ],
          },
        ],
      },
    });

    if (conflictingAppointment) {
      throw new Error('Doctor is not available at this time slot');
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        clinicId: parseInt(clinicId),
        scheduleId: scheduleId ? parseInt(scheduleId) : null,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        reason: reason || null,
        status: 'pending',
      },
      include: {
        patient: true,
        doctor: true,
        clinic: true,
        schedule: true,
      },
    });

    return appointment;
  },

  // Cập nhật appointment
  updateAppointment: async (id, data) => {
    const { date, startTime, endTime, reason, status, scheduleId } = data;

    const updateData = {};
    if (date) updateData.date = new Date(date);
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (reason !== undefined) updateData.reason = reason;
    if (status) updateData.status = status;
    if (scheduleId !== undefined)
      updateData.scheduleId = scheduleId ? parseInt(scheduleId) : null;

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        patient: true,
        doctor: true,
        clinic: true,
        schedule: true,
      },
    });

    return appointment;
  },

  // Xóa appointment
  deleteAppointment: async (id) => {
    await prisma.appointment.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Appointment deleted successfully' };
  },

  // Cập nhật trạng thái appointment
  updateStatus: async (id, status) => {
    const validStatuses = [
      'pending',
      'confirmed',
      'completed',
      'cancelled',
      'no-show',
    ];

    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        patient: true,
        doctor: true,
        clinic: true,
      },
    });

    return appointment;
  },

  // Lấy appointments của một bệnh nhân
  getPatientAppointments: async (patientId, filters = {}) => {
    const { status, page = 1, limit = 10 } = filters;
    const where = { patientId: parseInt(patientId) };

    if (status) where.status = status;

    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          doctor: {
            select: {
              id: true,
              fullName: true,
              specialization: true,
            },
          },
          clinic: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
          feedback: true,
          payment: true,
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          date: 'desc',
        },
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Lấy appointments của một bác sĩ
  getDoctorAppointments: async (doctorId, filters = {}) => {
    const { status, date, page = 1, limit = 10 } = filters;
    const where = { doctorId: parseInt(doctorId) };

    if (status) where.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
              phone: true,
              email: true,
            },
          },
          clinic: {
            select: {
              id: true,
              name: true,
            },
          },
          feedback: true,
          payment: true,
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          startTime: 'asc',
        },
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Lấy appointments của một phòng khám
  getClinicAppointments: async (clinicId, filters = {}) => {
    const { status, date, page = 1, limit = 10 } = filters;
    const where = { clinicId: parseInt(clinicId) };

    if (status) where.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
              phone: true,
            },
          },
          doctor: {
            select: {
              id: true,
              fullName: true,
              specialization: true,
            },
          },
          payment: true,
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          startTime: 'asc',
        },
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Thống kê appointments
  getStatistics: async (filters = {}) => {
    const { startDate, endDate, doctorId, clinicId } = filters;
    const where = {};

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    if (doctorId) where.doctorId = parseInt(doctorId);
    if (clinicId) where.clinicId = parseInt(clinicId);

    const [total, pending, confirmed, completed, cancelled, noShow] =
      await Promise.all([
        prisma.appointment.count({ where }),
        prisma.appointment.count({ where: { ...where, status: 'pending' } }),
        prisma.appointment.count({ where: { ...where, status: 'confirmed' } }),
        prisma.appointment.count({ where: { ...where, status: 'completed' } }),
        prisma.appointment.count({ where: { ...where, status: 'cancelled' } }),
        prisma.appointment.count({ where: { ...where, status: 'no-show' } }),
      ]);

    return {
      total,
      byStatus: {
        pending,
        confirmed,
        completed,
        cancelled,
        noShow,
      },
    };
  },
};
