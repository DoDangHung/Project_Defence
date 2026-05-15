-- Migration: Add payment refund policy and transactions
-- Created: 2026-05-12

-- ============================================
-- 1. Add new columns to Payment table
-- ============================================

ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "refundPercentage" DECIMAL(5,2) DEFAULT 100;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "forfeitedAt" TIMESTAMP;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "cancellationDeadline" TIMESTAMP;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "cancellationHalfwayDeadline" TIMESTAMP;

-- Update depositStatus to include 'not_required' and 'forfeited' options
-- This is informational - PostgreSQL doesn't enforce enum values

-- ============================================
-- 2. Create PaymentTransaction table
-- ============================================

CREATE TABLE IF NOT EXISTS "PaymentTransaction" (
    "id" SERIAL PRIMARY KEY,
    "paymentId" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL, -- deposit, final, additional, refund, forfeit
    "amount" DECIMAL(12,2) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
    "transactionId" VARCHAR(255),
    "gatewayResponse" JSONB,
    "refundPercentage" DECIMAL(5,2),
    "refundReason" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT "PaymentTransaction_paymentId_fkey" FOREIGN KEY ("paymentId") 
        REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "PaymentTransaction_paymentId_idx" ON "PaymentTransaction"("paymentId");
CREATE INDEX IF NOT EXISTS "PaymentTransaction_type_idx" ON "PaymentTransaction"("type");
CREATE INDEX IF NOT EXISTS "PaymentTransaction_status_idx" ON "PaymentTransaction"("status");

-- ============================================
-- 3. Add relation from Payment to PaymentTransaction
-- ============================================

-- Note: Prisma handles this automatically via the relation
-- No manual ALTER needed as Prisma will add the foreign key when regenerating

-- ============================================
-- Comments for documentation
-- ============================================

COMMENT ON TABLE "PaymentTransaction" IS 'Transaction log for all payment activities';
COMMENT ON COLUMN "PaymentTransaction"."type" IS 'deposit, final, additional, refund, forfeit';
COMMENT ON COLUMN "PaymentTransaction"."status" IS 'pending, completed, failed, refunded';
