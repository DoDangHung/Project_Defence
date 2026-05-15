import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkAssignments() {
  const assignments = await prisma.doctorClinicAssignment.findMany({
    where: { doctorId: 1 },
    include: { clinic: true, room: true }
  });
  console.log('Assignments for doctorId 1:', JSON.stringify(assignments, null, 2));
  await prisma.$disconnect();
}

checkAssignments();
