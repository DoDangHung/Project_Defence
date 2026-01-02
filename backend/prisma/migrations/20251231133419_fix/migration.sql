/*
  Warnings:

  - You are about to drop the column `departmentId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `nurseId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `Patient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_nurseId_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_roomId_fkey";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "departmentId",
DROP COLUMN "doctorId",
DROP COLUMN "nurseId",
DROP COLUMN "roomId";
