/*
  Warnings:

  - You are about to drop the column `fingerprint_cbor` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `fingerprint_folder` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `location` table. All the data in the column will be lost.
  - You are about to drop the `employeesattendance` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[fingerprintId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `employeesattendance` DROP FOREIGN KEY `EmployeesAttendance_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `employeesattendance` DROP FOREIGN KEY `EmployeesAttendance_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `employeesattendance` DROP FOREIGN KEY `EmployeesAttendance_userId_fkey`;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `fingerprint_cbor`,
    DROP COLUMN `fingerprint_folder`,
    ADD COLUMN `fingerprintId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `location` DROP COLUMN `updated_at`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `employeesattendance`;

-- CreateTable
CREATE TABLE `EmployeeFingerPrints` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `fingerprint_key` TEXT NOT NULL,
    `format` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmployeeFingerPrints_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Employee_fingerprintId_key` ON `Employee`(`fingerprintId`);

-- AddForeignKey
ALTER TABLE `EmployeeFingerPrints` ADD CONSTRAINT `EmployeeFingerPrints_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
