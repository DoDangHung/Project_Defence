-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "acceptedInsurances" TEXT[] DEFAULT ARRAY[]::TEXT[];
