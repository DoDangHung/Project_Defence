import bcrypt from 'bcrypt';
import prisma from './src/config/db.js';

async function check() {
  const user = await prisma.user.findUnique({
    where: { email: 'alex@gmail.com' },
  });

  if (!user) {
    console.error('User not found');
    return;
  }

  console.log('Stored password:', user.password);

  const isMatch = await bcrypt.compare('12345678', user.password);
  console.log('Password match:', isMatch);

  await prisma.$disconnect();
}

check();
