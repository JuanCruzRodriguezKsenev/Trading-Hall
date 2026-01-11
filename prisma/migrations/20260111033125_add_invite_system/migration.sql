/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `World` will be added. If there are existing duplicate values, this will fail.
  - The required column `inviteCode` was added to the `World` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `ownerId` to the `World` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "World_name_key";

-- AlterTable
ALTER TABLE "World" ADD COLUMN     "inviteCode" TEXT NOT NULL,
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "World_inviteCode_key" ON "World"("inviteCode");

-- AddForeignKey
ALTER TABLE "World" ADD CONSTRAINT "World_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
