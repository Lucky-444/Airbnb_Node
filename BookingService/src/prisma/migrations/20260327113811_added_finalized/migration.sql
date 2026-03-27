/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `IdempotencyKey` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `idempotencykey` ADD COLUMN `finalized` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `key` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `IdempotencyKey_key_key` ON `IdempotencyKey`(`key`);
