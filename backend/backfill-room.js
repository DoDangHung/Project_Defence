import prisma from './src/config/db.js';

async function backfillRoomId() {
  console.log('🔍 Đang tìm các appointment chưa có roomId...');

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

  console.log(`📋 Tìm thấy ${appointments.length} appointment cần cập nhật`);

  let updated = 0;
  for (const apt of appointments) {
    if (apt.schedule?.roomId) {
      await prisma.appointment.update({
        where: { id: apt.id },
        data: { roomId: apt.schedule.roomId },
      });
      updated++;
      console.log(`✅ Appointment #${apt.id} → roomId: ${apt.schedule.roomId}`);
    } else {
      console.log(`⚠️  Appointment #${apt.id} không có room trong schedule`);
    }
  }

  console.log(`\n🎉 Hoàn tất! Đã cập nhật ${updated}/${appointments.length} appointment`);
  process.exit(0);
}

backfillRoomId().catch((err) => {
  console.error('❌ Lỗi:', err);
  process.exit(1);
});
