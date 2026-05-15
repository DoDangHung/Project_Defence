import prisma from './src/config/db.js';

async function check() {
  const doctors = await prisma.doctor.findMany({
    include: { user: { select: { id: true, email: true } } }
  });
  console.log('All doctors (Doctor ID -> User ID):');
  doctors.forEach(d => console.log(`  Doctor ID ${d.id} -> User ID ${d.userId} (${d.user?.email || 'NO USER'})`));

  const appointments = await prisma.appointment.findMany({
    take: 3,
    include: {
      doctor: {
        select: {
          id: true,
          specialization: true,
          user: {
            select: { firstName: true, lastName: true, email: true }
          }
        }
      }
    }
  });
  console.log('\nAppointments - what doctor data looks like:');
  appointments.forEach(a => {
    console.log(`  Doctor: id=${a.doctor.id}, user=${a.doctor.user?.email}`);
    console.log(`  Expected userId for message: ${a.doctor.userId}`);
  });
}

check().catch(console.error).finally(() => prisma.$disconnect());
