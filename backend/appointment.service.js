import prisma from './src/config/db.js';
export const checkDoctorConflict = async ({
  doctorId,
  date,
  startTime,
  endTime,
}) => {
  const start = performance.now();

  const conflict = await prisma.appointment.findFirst({
    where: {
      doctorId,
      date,
      status: { not: 'cancelled' },
      OR: [
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gt: startTime } },
          ],
        },
        {
          AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }],
        },
      ],
    },
  });

  const end = performance.now();

  return {
    hasConflict: !!conflict,
    executionTimeMs: end - start,
  };
};
