// Script để update specialty Orthodontics thành "Khám nha khoa"
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixSpecialty() {
  try {
    // 1. Kiểm tra specialty hiện tại
    const currentSpecialty = await prisma.specialty.findUnique({
      where: { slug: 'orthodontics' }
    });
    console.log('Current specialty:', currentSpecialty);

    // 2. Kiểm tra xem slug 'kham-nha-khoa' đã tồn tại chưa
    const existingSlug = await prisma.specialty.findUnique({
      where: { slug: 'kham-nha-khoa' }
    });
    console.log('Existing with slug kham-nha-khoa:', existingSlug);

    // 3. Kiểm tra xem specialty 'nha-khoa-tong-quat' có tồn tại không
    const nhaKhoaSlug = await prisma.specialty.findUnique({
      where: { slug: 'nha-khoa-tong-quat' }
    });
    console.log('Specialty with slug nha-khoa-tong-quat:', nhaKhoaSlug);

    // 4. Update Orthodontics thành "Khám nha khoa" với slug đúng
    const updated = await prisma.specialty.update({
      where: { id: 13 },
      data: {
        name: 'Khám nha khoa',
        slug: 'kham-nha-khoa'
      }
    });
    console.log('✅ Updated specialty:', updated);

    // 5. Verify
    const verify = await prisma.specialty.findMany({
      where: { categoryId: 3 },
      select: { id: true, name: true, slug: true, categoryId: true }
    });
    console.log('Specialties in category 3 (Khám nha khoa):', verify);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixSpecialty();
