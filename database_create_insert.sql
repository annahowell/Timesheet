SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP DATABASE IF EXISTS `kits`;
CREATE DATABASE `kits` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `kits`;




CREATE TABLE `activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text COLLATE utf8_unicode_ci,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `projectID` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `projectID` (`projectID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `activity` (`id`, `name`, `start`, `end`, `projectID`) VALUES
(1,	'Visit Head Office',	'2017-05-10 08:00:00',	'2017-05-10 09:30:00',	1),
(3,	'Back Up Server',	'2017-05-10 09:30:00',	'2017-05-10 11:30:00',	2),
(7,	'No',	'2017-05-13 13:00:00',	'2017-05-13 15:00:00',	1),
(9,	'I think we\'re editing it at the same time lol',	'2017-05-12 10:30:00',	'2017-05-12 16:30:00',	29),
(10,	'Debug ticket  554',	'2017-05-10 11:30:00',	'2017-05-10 15:30:00',	5),
(11,	'Sprint standup',	'2017-05-11 14:00:00',	'2017-05-11 17:30:00',	3),
(12,	'Liam is awesome',	'2017-05-08 13:00:00',	'2017-05-08 15:00:00',	4);




CREATE TABLE `client` (
  `clientID` int(11) NOT NULL AUTO_INCREMENT,
  `clientName` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `clientContactName` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `clientPhoneNumber` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `clientEmail` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `clientAddress1` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `clientAddress2` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `clientPostCode` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`clientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `client` (`clientID`, `clientName`, `clientContactName`, `clientPhoneNumber`, `clientEmail`, `clientAddress1`, `clientAddress2`, `clientPostCode`) VALUES
(1,	'Lorem Ipsum Signs',	'Lorem',	'0800 123789',	'lorem@ipsum.co.uk',	'7 Bournemouth Road',	'Poole, Dorset',	'BH15 3NU'),
(2,	'Frydays',	'Andrew',	'01405 42585',	'rnare.Fusce.mollis@ipsumnon.co.uk',	'53 Gillett Road',	'Pool, Dorset',	'BH12 5BF'),
(3,	'Lacus Velit Aliquam PLC',	'Naomi',	'0834 331 9995',	'id.risus@sedestNunc.net',	'P.O. Box 458, 3951 Sit Rd.',	'Kenosha',	'GO7O 6GA'),
(4,	'Malesuada Fringilla',	'Madison',	'055 3971 9110',	'idiculus.mus.Proin@inceptoshymenaeos.co.uk',	'P.O. Box 986, 9366 Lectus. Avenue',	'Chippenham',	'EY3A 9XN'),
(5,	'Vehicula Risus Nulla Consulting',	'Macy',	'016977 2791',	'eget.massa@nascetur.org',	'Ap #524-5413 Nunc Road',	'Burcht',	'WM67 3EV'),
(6,	'Interdum Nunc Inc.',	'Shelly',	'0302 435 5178',	'risus@Duismi.ca',	'5963 Sit St.',	'Vishakhapatnam',	'U9W 3ZA'),
(10,	'Hillways Office Furniture',	'Steve',	'01202 771100',	'steve@hillways.co',	'99 Holdenhurst Road',	'Bournemouth, Dorset',	'BH8 8AB');




CREATE TABLE `employee` (
  `employeeID` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `firstName` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `lastName` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `dayRate` double NOT NULL,
  `userType` tinyint(1) NOT NULL DEFAULT '1',
  `permanent` tinyint(1) NOT NULL DEFAULT '0',
  `taxID` int(11) NOT NULL,
  PRIMARY KEY (`employeeID`),
  UNIQUE KEY `username` (`username`),
  KEY `employee_fk0` (`taxID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `employee` (`employeeID`, `username`, `password`, `firstName`, `lastName`, `dayRate`, `userType`, `permanent`, `taxID`) VALUES
(1,	'anna',	'$2y$10$StJzxlpFaPjLV1wOmoJeMeaRyQOsDvHeEZ8yPSZEgJq9/owqbEiD6',	'Anna',	'Thomas',	30,	3,	0,	1);




CREATE TABLE `project` (
  `projectID` int(11) NOT NULL AUTO_INCREMENT,
  `projectName` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `projectDescription` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `projectColour` tinytext COLLATE utf8_unicode_ci NOT NULL,
  `clientID` int(11) NOT NULL,
  PRIMARY KEY (`projectID`),
  KEY `clientID` (`clientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `project` (`projectID`, `projectName`, `projectDescription`, `projectColour`, `clientID`) VALUES
(1,	'Lorem Server Setup',	'Lorem Ipsum\'s server config',	'#00FF00',	1),
(2,	'Frydays App',	'iOS/Android app for Frydays Fish and Ships',	'#0000FF',	2),
(3,	'Lacus ',	'System For Lacus Company',	'#00CCCC',	3),
(4,	'Malesuada Fringilla',	'Network system',	'#FF0099',	4),
(5,	'Justo Proin ',	'Website for a fitness company',	'#FFFF00',	5),
(6,	'Lacus Website',	'Website for Lacus',	'#FF6600',	6),
(29,	'Hillways EPOS',	'Hillways Furniture EPOS System',	'#FF0000',	3);




CREATE TABLE `tax_code` (
  `taxID` int(11) NOT NULL AUTO_INCREMENT,
  `taxCodeName` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `taxRate` int(2) NOT NULL,
  PRIMARY KEY (`taxID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `tax_code` (`taxID`, `taxCodeName`, `taxRate`) VALUES
(1,	'Basic25',	25),
(2,	'Basic40',	40),
(3,	'Basic45',	45),
(4,	'Exempt',	0),
(7,	'Basic20',	20);

-- 2017-05-11 11:40:42
