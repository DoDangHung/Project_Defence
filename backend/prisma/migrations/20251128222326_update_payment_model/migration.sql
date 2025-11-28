/*
  Warnings:

  - You are about to drop the column `amount` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `consultationFee` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depositAmount` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingAmount` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amount",
DROP COLUMN "method",
DROP COLUMN "paidAt",
DROP COLUMN "status",
DROP COLUMN "transactionId",
ADD COLUMN     "additionalCharges" JSONB DEFAULT '[]',
ADD COLUMN     "consultationFee" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "depositAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "depositPaidAt" TIMESTAMP(3),
ADD COLUMN     "depositStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "depositTransactionId" TEXT,
ADD COLUMN     "finalPaidAt" TIMESTAMP(3),
ADD COLUMN     "finalTransactionId" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentProvider" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "payosOrderId" TEXT,
ADD COLUMN     "refundAmount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "refundReason" TEXT,
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ADD COLUMN     "remainingAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "stripePaymentIntentId" TEXT,
ADD COLUMN     "totalPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" SERIAL NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "transactionType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "transactionId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentTransaction_paymentId_idx" ON "PaymentTransaction"("paymentId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_transactionId_idx" ON "PaymentTransaction"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_patientId_idx" ON "Payment"("patientId");

-- CreateIndex
CREATE INDEX "Payment_paymentStatus_idx" ON "Payment"("paymentStatus");

-- CreateIndex
CREATE INDEX "Payment_depositStatus_idx" ON "Payment"("depositStatus");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
