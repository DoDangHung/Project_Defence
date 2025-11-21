import prisma from './config/db.js';

async function main() {
  const items = await prisma.availability.findMany();

  for (const a of items) {
    await prisma.availability.update({
      where: { id: a.id },
      data: {
        date: new Date(a.day), // nếu day là ISO
        start: new Date(a.startTime),
        end: new Date(a.endTime),
      },
    });
  }

  console.log('Converted!');
}

main();
