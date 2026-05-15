import bcrypt from 'bcryptjs';
import prisma from './config/db.js';

async function resetAdminPassword() {
  try {
    // Tìm user admin
    const admin = await prisma.user.findFirst({
      where: {
        role: {
          name: 'ADMIN'
        }
      }
    });

    if (!admin) {
      console.log('❌ Không tìm thấy user admin');
      return;
    }

    console.log(`✅ Tìm thấy admin: ${admin.email}`);

    // Tạo password mới
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: admin.id },
      data: { password: hashedPassword }
    });

    console.log(`\n✅ Password đã được reset!`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password mới: ${newPassword}`);
    console.log(`\n⚠️  Hãy đổi password sau khi đăng nhập!`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
