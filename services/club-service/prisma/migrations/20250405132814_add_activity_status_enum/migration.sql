-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'CANCELLED');

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "status" "ActivityStatus" NOT NULL DEFAULT 'PENDING';
