import bcrypt from 'bcryptjs';
import prisma from './config/db.js';

async function createAdmin() {
  try {
    // 1. Tìm hoặc tạo role ADMIN
    let adminRole = await prisma.role.findUnique({
      where: { name: 'ADMIN' }
    });

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: { name: 'ADMIN' }
      });
      console.log('✅ Đã tạo role ADMIN');
    } else {
      console.log('✅ Role ADMIN đã tồn tại');
    }

    // 2. Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@hospital.com' }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin đã tồn tại với email: admin@hospital.com');
      console.log('   Password: admin123');
      return;
    }

    // 3. Tạo user admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@hospital.com',
        password: hashedPassword,
        phone: '0123456789',
        gender: 'male',
        roleId: adminRole.id,
        status: 'active'
      }
    });

    // 4. Tạo record Admin
    await prisma.admin.create({
      data: {
        userId: admin.id,
        position: 'System Administrator'
      }
    });

    console.log('\n✅ Tạo tài khoản admin thành công!');
    console.log('   Email: admin@hospital.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  Hãy đổi password sau khi đăng nhập!');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
