import prisma from '../../config/db.js';

export const doctorClinicService = {
  // Assign doctor to clinic (with optional room)
  assignDoctorToClinic: async (data) => {
    const { doctorId, clinicId, roomId, isPrimary = false } = data;

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(doctorId) },
    });

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    // Check if clinic exists
    const clinic = await prisma.clinic.findUnique({
      where: { id: parseInt(clinicId) },
    });

    if (!clinic) {
      throw new Error('Clinic not found');
    }

    // Check if room exists (if provided)
    if (roomId) {
      const room = await prisma.room.findUnique({
        where: { id: parseInt(roomId) },
      });
      if (!room) {
        throw new Error('Room not found');
      }
    }

    // Check if assignment already exists
    const existing = await prisma.doctorClinicAssignment.findUnique({
      where: {
        doctorId_clinicId: {
          doctorId: parseInt(doctorId),
          clinicId: parseInt(clinicId),
        },
      },
    });

    if (existing) {
      // Update existing assignment
      return prisma.doctorClinicAssignment.update({
        where: { id: existing.id },
        data: {
          roomId: roomId ? parseInt(roomId) : null,
          isPrimary,
          status: 'active',
        },
        include: {
          doctor: {
            include: { user: true },
          },
          clinic: true,
          room: true,
        },
      });
    }

    // If isPrimary, unset other primary assignments
    if (isPrimary) {
      await prisma.doctorClinicAssignment.updateMany({
        where: { doctorId: parseInt(doctorId) },
        data: { isPrimary: false },
      });
    }

    // Create new assignment
    return prisma.doctorClinicAssignment.create({
      data: {
        doctorId: parseInt(doctorId),
        clinicId: parseInt(clinicId),
        roomId: roomId ? parseInt(roomId) : null,
        isPrimary,
        status: 'active',
      },
      include: {
        doctor: {
          include: { user: true },
        },
        clinic: true,
        room: true,
      },
    });
  },

  // Get all assignments for a doctor
  getDoctorAssignments: async (doctorId) => {
    console.log('getDoctorAssignments service called, doctorId:', doctorId);
    return prisma.doctorClinicAssignment.findMany({
      where: { doctorId: parseInt(doctorId) },
      include: {
        clinic: true,
        room: true,
      },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    });
  },

  // Get all assignments for a clinic
  getClinicDoctorAssignments: async (clinicId) => {
    return prisma.doctorClinicAssignment.findMany({
      where: { clinicId: parseInt(clinicId) },
      include: {
        doctor: {
          include: { user: true },
        },
        room: true,
      },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    });
  },

  // Get all assignments (admin view)
  getAllAssignments: async (filters = {}) => {
    const { clinicId, doctorId, page = 1, limit = 20 } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (clinicId) where.clinicId = parseInt(clinicId);
    if (doctorId) where.doctorId = parseInt(doctorId);

    const [assignments, total] = await Promise.all([
      prisma.doctorClinicAssignment.findMany({
        where,
        include: {
          doctor: {
            include: { user: true },
          },
          clinic: true,
          room: true,
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.doctorClinicAssignment.count({ where }),
    ]);

    return {
      data: assignments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Remove doctor from clinic
  removeAssignment: async (id) => {
    return prisma.doctorClinicAssignment.delete({
      where: { id: parseInt(id) },
    });
  },

  // Update assignment (change room, primary status)
  updateAssignment: async (id, data) => {
    const { roomId, isPrimary, status } = data;

    // If isPrimary, unset other primary assignments for this doctor
    if (isPrimary) {
      const assignment = await prisma.doctorClinicAssignment.findUnique({
        where: { id: parseInt(id) },
      });

      if (assignment) {
        await prisma.doctorClinicAssignment.updateMany({
          where: { doctorId: assignment.doctorId, id: { not: parseInt(id) } },
          data: { isPrimary: false },
        });
      }
    }

    const updateData = {};
    if (roomId !== undefined) updateData.roomId = roomId ? parseInt(roomId) : null;
    if (isPrimary !== undefined) updateData.isPrimary = isPrimary;
    if (status !== undefined) updateData.status = status;

    return prisma.doctorClinicAssignment.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        doctor: {
          include: { user: true },
        },
        clinic: true,
        room: true,
      },
    });
  },
};
