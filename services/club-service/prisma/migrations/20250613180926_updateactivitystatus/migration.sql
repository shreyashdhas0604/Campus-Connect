/*
  Warnings:

  - The values [PENDING,ACTIVE,INACTIVE] on the enum `ActivityStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityStatus_new" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');
ALTER TYPE "ActivityStatus" RENAME TO "ActivityStatus_old";
ALTER TYPE "ActivityStatus_new" RENAME TO "ActivityStatus";
DROP TYPE "ActivityStatus_old";
COMMIT;
