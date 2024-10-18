/*
  Warnings:

  - A unique constraint covering the columns `[snUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_snUsername_key" ON "User"("snUsername");
