/*
  Warnings:

  - The `status` column on the `Activity` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "status",
ADD COLUMN     "status" "ActivityStatus" NOT NULL DEFAULT 'UPCOMING';
