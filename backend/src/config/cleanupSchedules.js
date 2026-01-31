import prisma from './db.js';

async function main() {
  const deleted = await prisma.schedule.deleteMany({
    where: {
      roomId: null,
    },
  });
  console.log(`✅ Đã xóa ${deleted.count} schedules không có roomId`);
}

main()
  .catch((error) => {
    console.error('❌ Lỗi:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
