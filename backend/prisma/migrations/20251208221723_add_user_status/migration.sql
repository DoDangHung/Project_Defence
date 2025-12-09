-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'terminated', 'blocked');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'active';
