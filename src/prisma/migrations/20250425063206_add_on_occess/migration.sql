/*
  Warnings:

  - You are about to drop the column `fingerprint_xml` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employee` DROP COLUMN `fingerprint_xml`,
    ADD COLUMN `fingerprint_cbor` LONGBLOB NULL,
    ADD COLUMN `fingerprint_folder` VARCHAR(191) NULL;
