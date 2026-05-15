import prisma from '../../config/db.js';

// schedules.service.js

export const schedulesService = {
  // Helper: Tạo slots từ startTime và endTime
  generateTimeSlots: (startTime, endTime, slotDuration, scheduleId) => {
    const slots = [];
    const start = new Date(startTime);
    const end = new Date(endTime);

    let currentTime = new Date(start);
    let index = 0;

    while (currentTime < end) {
      const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);

      // Chỉ thêm slot nếu slotEnd không vượt quá endTime
      if (slotEnd <= end) {
        slots.push({
          id: `${scheduleId}-${index}`,
          index: index,
          start: new Date(currentTime),
          end: slotEnd,
          isBooked: false,
        });
        index++;
      }

      currentTime = slotEnd;
    }

    return slots;
  },

  // Tạo schedule
  createSchedules: async (data) => {
    const {
      doctorId,
      clinicId,
      date,
      startTime,
      endTime,
      roomId,
      slotDuration = 30,
    } = data;

    // Validate và convert sang Number
    const doctorIdNum = parseInt(doctorId);
    const roomIdNum = parseInt(roomId);
    const clinicIdNum = parseInt(clinicId);

    if (isNaN(doctorIdNum)) {
      throw new Error('doctorId không hợp lệ');
    }

    if (isNaN(clinicIdNum)) {
      throw new Error('clinicId không hợp lệ');
    }

    if (isNaN(roomIdNum)) {
      throw new Error('roomId không hợp lệ');
    }

    // Kiểm tra Doctor có tồn tại
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorIdNum },
    });

    if (!doctor) {
      throw new Error(`Doctor với ID ${doctorIdNum} không tồn tại`);
    }

    // Kiểm tra Clinic có tồn tại
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicIdNum },
    });

    if (!clinic) {
      throw new Error(`Clinic với ID ${clinicIdNum} không tồn tại`);
    }

    // Kiểm tra Room có tồn tại
    const room = await prisma.room.findUnique({
      where: { id: roomIdNum },
    });

    if (!room) {
      throw new Error(`Room với ID ${roomIdNum} không tồn tại`);
    }

    // Check overlap
    const overlap = await prisma.schedule.findFirst({
      where: {
        doctorId: doctorIdNum,
        date: new Date(date),
        AND: [
          { startTime: { lt: new Date(endTime) } },
          { endTime: { gt: new Date(startTime) } },
        ],
      },
    });

    if (overlap) {
      throw new Error('Bị trùng giờ với lịch khác');
    }

    // Tính số slots
    const slots = schedulesService.generateTimeSlots(
      startTime,
      endTime,
      slotDuration
    );

    // Tạo schedule
    return prisma.schedule.create({
      data: {
        doctorId: doctorIdNum,
        clinicId: clinicIdNum,
        roomId: roomIdNum,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        slotDuration: parseInt(slotDuration),
        totalSlots: slots.length,
      },
      include: {
        doctor: true,
        clinic: true,
        room: true,
      },
    });
  },

  // Lấy schedules với thông tin slots available
  getSchedulesByDoctor: async (doctorId) => {
    const schedules = await prisma.schedule.findMany({
      where: { doctorId },
      include: {
        appointments: {
          where: { status: { not: 'cancelled' } }, // Chỉ lấy appointment chưa bị hủy
        },
        room: true,
        clinic: true,
        doctor: {
          include: {
            specialties: true,
            clinicAssignments: {
              where: { status: 'active' },
              include: { clinic: true },
            },
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    // Thêm thông tin slots cho mỗi schedule
    return schedules.map((schedule) => {
      const slots = schedulesService.generateTimeSlots(
        schedule.startTime,
        schedule.endTime,
        schedule.slotDuration,
        schedule.roomId
      );

      const maxPatients = schedule.maxPatientsPerSlot || 3;

      // Đánh dấu slot nào đã book và đếm số lượt
      const slotsWithStatus = slots.map((slot, index) => {
        // Đếm số appointment trong slot này
        const appointmentsInSlot = schedule.appointments.filter(
          (apt) => apt.slotIndex === index
        );
        const bookedCount = appointmentsInSlot.length;
        const remainingSlots = maxPatients - bookedCount;

        return {
          index,
          start: slot.start,
          end: slot.end,
          bookedCount,
          maxPatients,
          remainingSlots,
          isFull: remainingSlots <= 0,
          appointments: appointmentsInSlot,
        };
      });

      const availableSlots = slotsWithStatus.filter((s) => !s.isFull).length;

      return {
        ...schedule,
        slots: slotsWithStatus,
        availableSlots,
        bookedSlots: schedule.appointments.length,
      };
    });
  },

  // Các methods khác giữ nguyên...
  updateSchedules: async (id, data) => {
    return prisma.schedule.update({
      where: { id: Number(id) },
      data,
    });
  },

  deleteSchedules: async (id) => {
    return prisma.schedule.delete({
      where: { id: Number(id) },
    });
  },

  getDoctorsAndSchedules: async (clinicId) => {
    return prisma.doctor.findMany({
      where: { clinicId },
      include: {
        user: true,
        specialty: true,
        schedules: {
          orderBy: { date: 'asc' },
        },
      },
    });
  },
};
