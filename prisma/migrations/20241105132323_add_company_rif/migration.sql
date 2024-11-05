/*
  Warnings:

  - You are about to drop the column `license_plate` on the `vehicle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rif]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rif` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plate` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `rif` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `vehicle` DROP COLUMN `license_plate`,
    ADD COLUMN `plate` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Company_rif_key` ON `Company`(`rif`);
