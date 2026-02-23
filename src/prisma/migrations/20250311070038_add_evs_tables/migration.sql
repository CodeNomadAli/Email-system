-- CreateTable
CREATE TABLE `Employee` (
    `id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NULL,
    `alias_name` VARCHAR(191) NULL,
    `birth_date` DATE NULL,
    `employee_no` VARCHAR(191) NULL,
    `verified_by_arizona_clerk` BOOLEAN NULL DEFAULT false,
    `expiration_date` DATE NULL,
    `registered_date` DATE NULL,
    `city_clerk_expiration_date` DATETIME(3) NULL,
    `identity_card` VARCHAR(191) NULL,
    `fingerprint_xml` TEXT NULL,
    `status` INTEGER NULL DEFAULT 3,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
