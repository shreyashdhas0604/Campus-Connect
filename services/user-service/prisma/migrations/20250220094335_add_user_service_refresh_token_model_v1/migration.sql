/*
  Warnings:

  - You are about to drop the column `Division` on the `User` table. All the data in the column will be lost.
  - Added the required column `division` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `department` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Department" AS ENUM ('CE', 'IT', 'ENTC');

-- CreateEnum
CREATE TYPE "Div" AS ENUM ('DIV1', 'DIV2', 'DIV3', 'DIV4', 'DIV5', 'DIV6', 'DIV7', 'DIV8', 'DIV9', 'DIV10', 'DIV11', 'DIV12', 'DIV13');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Division",
ADD COLUMN     "division" "Div" NOT NULL,
DROP COLUMN "department",
ADD COLUMN     "department" "Department" NOT NULL;

-- DropEnum
DROP TYPE "department";

-- DropEnum
DROP TYPE "div";

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
