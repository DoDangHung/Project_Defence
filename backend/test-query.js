import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testQuery() {
  try {
    // Query 1: Kiểm tra Doctor có userId không
    const result = await prisma.$queryRaw`
      SELECT d.id, d."userId", u.id as user_id, u."firstName", u."lastName" 
      FROM "Doctor" d 
      LEFT JOIN "User" u ON d."userId" = u.id 
      WHERE d.id = 1
    `;

    console.log('✅ Query result:', result);

    // Query 2: Kiểm tra tất cả doctors
    const allDoctors = await prisma.$queryRaw`
      SELECT d.id, d."userId", u."firstName", u."lastName", u.email
      FROM "Doctor" d 
      LEFT JOIN "User" u ON d."userId" = u.id
      LIMIT 5
    `;

    console.log('\n✅ All doctors:', allDoctors);

    // Query 3: Test Prisma include
    const doctorWithUser = await prisma.doctor.findFirst({
      where: { id: 1 },
      include: {
        user: {
          include: {
            role: true,
          },
        },
        department: true,
      },
    });

    console.log(
      '\n✅ Prisma include result:',
      JSON.stringify(doctorWithUser, null, 2)
    );
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testQuery();
