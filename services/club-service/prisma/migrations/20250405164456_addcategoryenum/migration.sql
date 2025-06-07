/*
  Warnings:

  - Added the required column `category` to the `Club` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClubCategory" AS ENUM ('ACADEMIC', 'SPORTS', 'CULTURAL', 'TECHNOLOGY', 'SOCIAL');

-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "category" "ClubCategory" NOT NULL;
