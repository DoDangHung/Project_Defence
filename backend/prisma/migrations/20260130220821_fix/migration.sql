/*
  Warnings:

  - You are about to drop the column `bedId` on the `Admission` table. All the data in the column will be lost.
  - You are about to drop the column `nurseId` on the `Admission` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConditionState` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicalRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Nurse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prescription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VitalSign` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admission" DROP CONSTRAINT "Admission_bedId_fkey";

-- DropForeignKey
ALTER TABLE "Admission" DROP CONSTRAINT "Admission_nurseId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Bed" DROP CONSTRAINT "Bed_roomId_fkey";

-- DropForeignKey
ALTER TABLE "ConditionState" DROP CONSTRAINT "ConditionState_admissionId_fkey";

-- DropForeignKey
ALTER TABLE "ConditionState" DROP CONSTRAINT "ConditionState_patientId_fkey";

-- DropForeignKey
ALTER TABLE "ConditionState" DROP CONSTRAINT "ConditionState_updatedByDoctorId_fkey";

-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Nurse" DROP CONSTRAINT "Nurse_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Nurse" DROP CONSTRAINT "Nurse_userId_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_patientId_fkey";

-- DropForeignKey
ALTER TABLE "VitalSign" DROP CONSTRAINT "VitalSign_medicalRecordId_fkey";

-- AlterTable
ALTER TABLE "Admission" DROP COLUMN "bedId",
DROP COLUMN "nurseId";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "departmentId";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "Bed";

-- DropTable
DROP TABLE "ConditionState";

-- DropTable
DROP TABLE "Department";

-- DropTable
DROP TABLE "MedicalRecord";

-- DropTable
DROP TABLE "Nurse";

-- DropTable
DROP TABLE "PaymentTransaction";

-- DropTable
DROP TABLE "Prescription";

-- DropTable
DROP TABLE "VitalSign";
