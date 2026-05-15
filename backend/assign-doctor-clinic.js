import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function assignDoctorToNewClinic() {
  // Assign doctorId 1 to clinicId (thay đổi clinicId theo nhu cầu)
  const doctorId = 1;
  const clinicId = 2; // Thay đổi clinicId tại đây
  const roomId = 7;   // Thay đổi roomId tại đây (để null nếu không cần)

  const assignment = await prisma.doctorClinicAssignment.create({
    data: {
      doctorId,
      clinicId,
      roomId: roomId || null,
      isPrimary: false,
      status: 'active',
    },
    include: { clinic: true, room: true }
  });
  
  console.log('Created assignment:', JSON.stringify(assignment, null, 2));
  
  // Verify all assignments for this doctor
  const all = await prisma.doctorClinicAssignment.findMany({
    where: { doctorId },
    include: { clinic: true, room: true }
  });
  console.log('\nAll assignments for doctorId', doctorId + ':', JSON.stringify(all, null, 2));
  
  await prisma.$disconnect();
}

assignDoctorToNewClinic();
