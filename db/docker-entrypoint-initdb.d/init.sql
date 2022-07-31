-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema preprocessing
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema preprocessing
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `preprocessing` DEFAULT CHARACTER SET utf8 ;
USE `preprocessing` ;

-- -----------------------------------------------------
-- Table `preprocessing`.`Project`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `preprocessing`.`Project` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `preprocessing`.`Stage`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `preprocessing`.`Stage` (
  `id` INT NOT NULL,
  `idProject` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `originDir` VARCHAR(200) NOT NULL,
  `destDir` VARCHAR(200) NOT NULL,
  `script` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`destDir` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  INDEX `fk_Stage_Project1_idx` (`idProject` ASC) VISIBLE,
  CONSTRAINT `fk_Stage_Project1`
    FOREIGN KEY (`idProject`)
    REFERENCES `preprocessing`.`Project` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `preprocessing`.`FileState`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `preprocessing`.`FileState` (
  `id` INT NOT NULL,
  `state` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `state_UNIQUE` (`state` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `preprocessing`.`File`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `preprocessing`.`File` (
  `id` INT NOT NULL,
  `idStage` INT NOT NULL,
  `idFileState` INT NOT NULL,
  `md5` CHAR(32) NOT NULL,
  `location` VARCHAR(200) NOT NULL,
  `isDirectory` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_files_stages_idx` (`idStage` ASC) VISIBLE,
  INDEX `fk_File_FileState1_idx` (`idFileState` ASC) VISIBLE,
  CONSTRAINT `fk_files_stages`
    FOREIGN KEY (`idStage`)
    REFERENCES `preprocessing`.`Stage` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_File_FileState1`
    FOREIGN KEY (`idFileState`)
    REFERENCES `preprocessing`.`FileState` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `preprocessing`.`FileState`
-- -----------------------------------------------------
START TRANSACTION;
USE `preprocessing`;
INSERT INTO `preprocessing`.`FileState` (`id`, `state`) VALUES (1, 'IN PROGRESS');
INSERT INTO `preprocessing`.`FileState` (`id`, `state`) VALUES (2, 'READY');
INSERT INTO `preprocessing`.`FileState` (`id`, `state`) VALUES (3, 'IN USE');

COMMIT;

