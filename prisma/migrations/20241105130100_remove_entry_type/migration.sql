/*
  Warnings:

  - You are about to drop the column `entry_type` on the `visit` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_model` on the `visit` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_pate` on the `visit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `visit` DROP FOREIGN KEY `Visit_area_id_fkey`;

-- DropForeignKey
ALTER TABLE `visit` DROP FOREIGN KEY `Visit_direction_id_fkey`;

-- AlterTable
ALTER TABLE `visit` DROP COLUMN `entry_type`,
    DROP COLUMN `vehicle_model`,
    DROP COLUMN `vehicle_pate`,
    ADD COLUMN `vehicle_id` INTEGER NULL,
    MODIFY `area_id` BIGINT NULL,
    MODIFY `direction_id` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_area_id_fkey` FOREIGN KEY (`area_id`) REFERENCES `Area`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_direction_id_fkey` FOREIGN KEY (`direction_id`) REFERENCES `Direction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
