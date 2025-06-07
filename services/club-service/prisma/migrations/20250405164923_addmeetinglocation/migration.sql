/*
  Warnings:

  - You are about to drop the column `logo` on the `Club` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Club" DROP COLUMN "logo",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "meetingLocation" TEXT;
