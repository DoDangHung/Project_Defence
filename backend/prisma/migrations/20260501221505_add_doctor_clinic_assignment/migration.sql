/*
  Warnings:

  - Added the required column `clinicId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Appointment_doctorId_date_slotIndex_key";

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "clinicId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "DoctorClinicAssignment" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "clinicId" INTEGER NOT NULL,
    "roomId" INTEGER,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorClinicAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DoctorClinicAssignment_doctorId_idx" ON "DoctorClinicAssignment"("doctorId");

-- CreateIndex
CREATE INDEX "DoctorClinicAssignment_clinicId_idx" ON "DoctorClinicAssignment"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorClinicAssignment_doctorId_clinicId_key" ON "DoctorClinicAssignment"("doctorId", "clinicId");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_date_idx" ON "Appointment"("doctorId", "date");

-- CreateIndex
CREATE INDEX "Schedule_doctorId_date_idx" ON "Schedule"("doctorId", "date");

-- CreateIndex
CREATE INDEX "Schedule_clinicId_idx" ON "Schedule"("clinicId");

-- AddForeignKey
ALTER TABLE "DoctorClinicAssignment" ADD CONSTRAINT "DoctorClinicAssignment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorClinicAssignment" ADD CONSTRAINT "DoctorClinicAssignment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorClinicAssignment" ADD CONSTRAINT "DoctorClinicAssignment_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
