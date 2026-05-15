-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "queueNumber" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "queuePosition" TEXT NOT NULL DEFAULT '1/3';
