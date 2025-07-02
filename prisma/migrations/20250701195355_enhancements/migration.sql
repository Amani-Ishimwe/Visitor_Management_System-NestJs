/*
  Warnings:

  - You are about to drop the column `email` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Visit` table. All the data in the column will be lost.
  - Added the required column `visitorId` to the `Visit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('ACTIVE', 'CHECKED_OUT', 'CANCELLED');

-- DropIndex
DROP INDEX "Visit_email_key";

-- DropIndex
DROP INDEX "Visit_phone_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "departmentId" TEXT;

-- AlterTable
ALTER TABLE "Visit" DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phone",
ADD COLUMN     "entryTime" TIMESTAMP(3),
ADD COLUMN     "exitTime" TIMESTAMP(3),
ADD COLUMN     "status" "VisitStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "visitorId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_email_key" ON "Visitor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_phone_key" ON "Visitor"("phone");

-- CreateIndex
CREATE INDEX "Visit_status_idx" ON "Visit"("status");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
