-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "about" TEXT,
ADD COLUMN     "achievements" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "isProfileApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "languages" TEXT,
ADD COLUMN     "profileApprovedAt" TIMESTAMP(3),
ADD COLUMN     "profileApprovedBy" INTEGER,
ADD COLUMN     "services" TEXT,
ADD COLUMN     "training" TEXT;
