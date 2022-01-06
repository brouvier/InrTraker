-- --------------------------------------------------------
-- Version du serveur:           10.3.29-MariaDB - Source distribution
-- SE du serveur:                Linux
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour inr_traker
DROP DATABASE IF EXISTS `inr_traker`;
CREATE DATABASE IF NOT EXISTS `inr_traker` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `inr_traker`;

-- Listage de la structure de la table inr_traker. drug
DROP TABLE IF EXISTS `drug`;
CREATE TABLE IF NOT EXISTS `drug` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `label` varchar(50) NOT NULL,
  `posology` varchar(500) NOT NULL,
  `maxFrequency` tinyint(3) unsigned NOT NULL DEFAULT 1 COMMENT 'Fréquence maximum des prises en heure',
	`order` TINYINT(4) NOT NULL DEFAULT '9',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table inr_traker. drug_intake
DROP TABLE IF EXISTS `drug_intake`;
CREATE TABLE IF NOT EXISTS `drug_intake` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fkDrugId` int(10) unsigned NOT NULL,
  `intake` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKDrug` (`fkDrugId`),
  CONSTRAINT `FKDrug` FOREIGN KEY (`fkDrugId`) REFERENCES `drug` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

-- Listage de la structure de la table inr_traker. inr_measure
DROP TABLE IF EXISTS `inr_measure`;
CREATE TABLE IF NOT EXISTS `inr_measure` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `measureDate` date DEFAULT NULL COMMENT 'Jour de la mesure',
  `inr` float DEFAULT NULL COMMENT 'Valeur de l''INR',
  `comment` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Les données exportées n'étaient pas sélectionnées.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
