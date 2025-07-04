/*
  Warnings:

  - Added the required column `email` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "email" TEXT NOT NULL;
