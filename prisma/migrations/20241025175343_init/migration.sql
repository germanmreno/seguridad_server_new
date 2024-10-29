-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Visitor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dni_type_id` INTEGER NOT NULL,
    `dni_number` INTEGER NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `contact_number_prefix_id` INTEGER NOT NULL,
    `contact_number` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Visit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `visitor_id` INTEGER NOT NULL,
    `visit_type_id` INTEGER NOT NULL,
    `entity_id` INTEGER NOT NULL,
    `administrative_unit_id` BIGINT NOT NULL,
    `area_id` BIGINT NOT NULL,
    `direction_id` BIGINT NOT NULL,
    `visit_date` DATETIME(3) NOT NULL,
    `exit_date` DATETIME(3) NOT NULL,
    `entry_type` VARCHAR(191) NOT NULL,
    `vehicle_pate` VARCHAR(191) NOT NULL,
    `vehicle_model` VARCHAR(191) NOT NULL,
    `visit_reason` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VisitType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VisitorCompany` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `visitor_id` INTEGER NOT NULL,
    `company_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alert` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reason_alert` VARCHAR(191) NOT NULL,
    `visitor_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NumbersPrefix` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DnisType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(15) NOT NULL,
    `abbreviation` VARCHAR(5) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdministrativeUnit` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `entity_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Direction` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `administrative_unit_id` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Area` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `direction_id` BIGINT NULL,
    `administrative_unit_id` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Visitor` ADD CONSTRAINT `Visitor_dni_type_id_fkey` FOREIGN KEY (`dni_type_id`) REFERENCES `DnisType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visitor` ADD CONSTRAINT `Visitor_contact_number_prefix_id_fkey` FOREIGN KEY (`contact_number_prefix_id`) REFERENCES `NumbersPrefix`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_visitor_id_fkey` FOREIGN KEY (`visitor_id`) REFERENCES `Visitor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_visit_type_id_fkey` FOREIGN KEY (`visit_type_id`) REFERENCES `VisitType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_entity_id_fkey` FOREIGN KEY (`entity_id`) REFERENCES `Entity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_administrative_unit_id_fkey` FOREIGN KEY (`administrative_unit_id`) REFERENCES `AdministrativeUnit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_area_id_fkey` FOREIGN KEY (`area_id`) REFERENCES `Area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_direction_id_fkey` FOREIGN KEY (`direction_id`) REFERENCES `Direction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisitorCompany` ADD CONSTRAINT `VisitorCompany_visitor_id_fkey` FOREIGN KEY (`visitor_id`) REFERENCES `Visitor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisitorCompany` ADD CONSTRAINT `VisitorCompany_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alert` ADD CONSTRAINT `Alert_visitor_id_fkey` FOREIGN KEY (`visitor_id`) REFERENCES `Visitor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdministrativeUnit` ADD CONSTRAINT `AdministrativeUnit_entity_id_fkey` FOREIGN KEY (`entity_id`) REFERENCES `Entity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Direction` ADD CONSTRAINT `Direction_administrative_unit_id_fkey` FOREIGN KEY (`administrative_unit_id`) REFERENCES `AdministrativeUnit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Area` ADD CONSTRAINT `Area_direction_id_fkey` FOREIGN KEY (`direction_id`) REFERENCES `Direction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Area` ADD CONSTRAINT `Area_administrative_unit_id_fkey` FOREIGN KEY (`administrative_unit_id`) REFERENCES `AdministrativeUnit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
