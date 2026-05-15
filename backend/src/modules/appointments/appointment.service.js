import prisma from '../../config/db.js';
import { generateTimeSlots } from '../../utils/slotGenerator.js';
import { sendAppointmentConfirmation } from '../../services/email.service.js';

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
              userId: true,
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
          schedule: {
            include: { room: true },
          },
          feedback: true,
          payment: true,
          room: true,
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
  getAppointmentById: async (id) => {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
      include: {
        patient: {
          select: {
            id: true,
            age: true,
            gender: true,
            user: {
              // ✅ Lấy từ user relation
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
              // ✅ Lấy từ user relation
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
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
        schedule: {
          select: {
            id: true,
            maxPatientsPerSlot: true,
            room: true,
          },
        },
        feedback: true,
        payment: true,
        satisfaction: true,
        room: true,
      },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    return appointment;
  },

  // Tạo appointment mới - với Queue System
  createAppointment: async (data, maxRetries = 3) => {
    let attempt = 0;

    while (true) {
      try {
        const appointment = await prisma.$transaction(
          async (tx) => {
            const {
              patientId,
              doctorId,
              clinicId,
              scheduleId,
              date,
              startTime,
              endTime,
              slotIndex,
              reason,
            } = data;

            const startDate = new Date(startTime);
            const endDate = new Date(endTime);

            // Lấy roomId và maxPatientsPerSlot từ Schedule
            let roomId = null;
            let maxPatientsPerSlot = 3;
            if (scheduleId) {
              const schedule = await tx.schedule.findUnique({
                where: { id: parseInt(scheduleId) },
                select: { roomId: true, maxPatientsPerSlot: true },
              });
              if (schedule?.roomId) {
                roomId = schedule.roomId;
              }
              if (schedule?.maxPatientsPerSlot) {
                maxPatientsPerSlot = schedule.maxPatientsPerSlot;
              }
            }

            // Đếm số appointment hiện tại trong slot này (chưa bị hủy)
            const currentBookingsInSlot = await tx.appointment.count({
              where: {
                scheduleId: scheduleId ? parseInt(scheduleId) : null,
                slotIndex: slotIndex || 0,
                status: { not: 'cancelled' },
                date: {
                  gte: new Date(startDate.toDateString()),
                  lt: new Date(new Date(startDate.toDateString()).getTime() + 86400000),
                },
              },
            });

            // Kiểm tra nếu slot đã đầy
            if (currentBookingsInSlot >= maxPatientsPerSlot) {
              throw new Error('Khung giờ này đã đầy. Vui lòng chọn khung giờ khác.');
            }

            // Tính queueNumber tiếp theo trong slot này
            const existingAppointments = await tx.appointment.findMany({
              where: {
                scheduleId: scheduleId ? parseInt(scheduleId) : null,
                slotIndex: slotIndex || 0,
                status: { not: 'cancelled' },
                date: {
                  gte: new Date(startDate.toDateString()),
                  lt: new Date(new Date(startDate.toDateString()).getTime() + 86400000),
                },
              },
              orderBy: { queueNumber: 'desc' },
              take: 1,
            });

            const nextQueueNumber = existingAppointments.length > 0
              ? existingAppointments[0].queueNumber + 1
              : 1;

            // Tạo appointment
            const appointment = await tx.appointment.create({
              data: {
                patientId: parseInt(patientId),
                doctorId: parseInt(doctorId),
                clinicId: parseInt(clinicId),
                scheduleId: scheduleId ? parseInt(scheduleId) : null,
                roomId,
                date: new Date(date),
                startTime: startDate,
                endTime: endDate,
                slotStart: startDate,
                slotEnd: endDate,
                slotIndex: slotIndex || 0,
                queueNumber: nextQueueNumber,
                queuePosition: `${nextQueueNumber}/${maxPatientsPerSlot}`,
                reason: reason || null,
                status: 'pending',
              },
              include: {
                room: true,
                schedule: {
                  include: { room: true },
                },
              },
            });

            return appointment;
          },
          { isolationLevel: 'Serializable' },
        );

        // Gửi email xác nhận sau khi tạo thành công
        setImmediate(async () => {
          try {
            const [patient, doctor, clinic] = await Promise.all([
              prisma.patient.findUnique({
                where: { id: appointment.patientId },
                include: { user: true },
              }),
              prisma.doctor.findUnique({
                where: { id: appointment.doctorId },
                include: { user: true },
              }),
              prisma.clinic.findUnique({
                where: { id: appointment.clinicId },
              }),
            ]);
            await sendAppointmentConfirmation(appointment, patient, doctor, clinic);
          } catch (err) {
            console.error('Error sending confirmation email:', err.message);
          }
        });

        return appointment;
      } catch (err) {
        if (err.code === 'P2034' && attempt < maxRetries) {
          attempt++;
          continue;
        }
        throw err;
      }
    }
  },

  // Cập nhật appointment
  updateAppointment: async (id, data) => {
    const { date, startTime, endTime, reason, status, scheduleId, roomId } = data;

    const updateData = {};
    if (date) updateData.date = new Date(date);
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (reason !== undefined) updateData.reason = reason;
    if (status) updateData.status = status;
    if (scheduleId !== undefined)
      updateData.scheduleId = scheduleId ? parseInt(scheduleId) : null;
    if (roomId !== undefined)
      updateData.roomId = roomId ? parseInt(roomId) : null;

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        patient: true,
        doctor: true,
        clinic: true,
        schedule: {
          include: { room: true },
        },
        room: true,
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
          patient: {
            select: {
              id: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          doctor: {
            select: {
              id: true,
              userId: true,
              specialization: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
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
          room: true,
          schedule: {
            include: { room: true },
          },
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
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true,
                  email: true,
                },
              },
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
          room: true,
          schedule: {
            select: {
              id: true,
              maxPatientsPerSlot: true,
            },
          },
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: [
          { date: 'asc' },
          { startTime: 'asc' },
          { queueNumber: 'asc' },
        ],
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

  // Accept/Confirm appointment
  confirmAppointment: async (id, doctorId = null) => {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status === 'cancelled') {
      throw new Error('Cannot confirm a cancelled appointment');
    }

    if (appointment.status === 'confirmed') {
      throw new Error('Appointment is already confirmed');
    }

    // Nếu có doctorId, kiểm tra quyền
    if (doctorId && appointment.doctorId !== parseInt(doctorId)) {
      throw new Error(
        'Unauthorized: You can only confirm your own appointments',
      );
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        status: 'confirmed',
        updatedAt: new Date(),
      },
      include: {
        patient: {
          select: {
            id: true,
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
        room: true,
      },
    });

    return updatedAppointment;
  },

  // Reschedule appointment
  rescheduleAppointment: async (id, rescheduleData) => {
    const { date, startTime, endTime, scheduleId, reason } = rescheduleData;

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status === 'cancelled') {
      throw new Error('Cannot reschedule a cancelled appointment');
    }

    if (appointment.status === 'completed') {
      throw new Error('Cannot reschedule a completed appointment');
    }

    // Validate time inputs
    if (!startTime || !endTime) {
      throw new Error('Start time and end time are required for rescheduling');
    }

    const newStartDate = new Date(startTime);
    const newEndDate = new Date(endTime);
    const newDate = date ? new Date(date) : new Date(startTime);

    if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime())) {
      throw new Error('Invalid date format for startTime or endTime');
    }

    // Kiểm tra conflict với appointments khác
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: appointment.doctorId,
        date: newDate,
        status: { not: 'cancelled' },
        id: { not: parseInt(id) }, // Loại trừ appointment hiện tại
        OR: [
          {
            AND: [
              { startTime: { lte: newStartDate } },
              { endTime: { gt: newStartDate } },
            ],
          },
          {
            AND: [
              { startTime: { lt: newEndDate } },
              { endTime: { gte: newEndDate } },
            ],
          },
        ],
      },
    });

    if (conflictingAppointment) {
      throw new Error('Doctor is not available at this new time slot');
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        date: newDate,
        startTime: newStartDate,
        endTime: newEndDate,
        slotStart: newStartDate,
        slotEnd: newEndDate,
        scheduleId: scheduleId ? parseInt(scheduleId) : appointment.scheduleId,
        reason: reason || appointment.reason,
        status: 'pending', // Reset về pending sau khi reschedule
        updatedAt: new Date(),
      },
      include: {
        patient: {
          select: {
            id: true,
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
        schedule: {
          include: { room: true },
        },
        room: true,
      },
    });

    return updatedAppointment;
  },

  // Cancel appointment (soft delete)
  cancelAppointment: async (id, cancelData = {}) => {
    const { cancelReason, cancelledBy } = cancelData;

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status === 'cancelled') {
      throw new Error('Appointment is already cancelled');
    }

    if (appointment.status === 'completed') {
      throw new Error('Cannot cancel a completed appointment');
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        status: 'cancelled',
        cancelReason: cancelReason || null,
        cancelledBy: cancelledBy || null,
        cancelledAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        patient: {
          select: {
            id: true,
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
        room: true,
      },
    });

    return updatedAppointment;
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
              user: {
                // ✅ Sửa
                select: {
                  firstName: true,
                  lastName: true,
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
                // ✅ Sửa
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
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

  // Backfill roomId cho các appointment cũ chưa có roomId
  backfillRoomId: async () => {
    // Lấy tất cả appointment chưa có roomId nhưng có scheduleId
    const appointments = await prisma.appointment.findMany({
      where: {
        roomId: null,
        scheduleId: { not: null },
      },
      include: {
        schedule: {
          select: { roomId: true },
        },
      },
    });

    let updated = 0;
    for (const apt of appointments) {
      if (apt.schedule?.roomId) {
        await prisma.appointment.update({
          where: { id: apt.id },
          data: { roomId: apt.schedule.roomId },
        });
        updated++;
      }
    }

    return { updated, total: appointments.length };
  },
};
