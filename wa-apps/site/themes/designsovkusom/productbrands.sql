-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Aug 19, 2014 at 05:16 PM
-- Server version: 5.5.34
-- PHP Version: 5.5.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `bd9`
--

-- --------------------------------------------------------

--
-- Table structure for table `shop_productbrands`
--

CREATE TABLE `shop_productbrands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `description` text,
  `title` varchar(255) DEFAULT NULL,
  `meta_keywords` text,
  `meta_description` text,
  `seo_description` text,
  `image` varchar(5) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `filter` text,
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  `carousel` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `shop_productbrands`
--

INSERT INTO `shop_productbrands` (`id`, `name`, `summary`, `description`, `title`, `meta_keywords`, `meta_description`, `seo_description`, `image`, `url`, `filter`, `hidden`, `carousel`) VALUES
(476, 'Chanel', '', '', '', '', '', '', '.gif', '', NULL, 0, 1),
(437, 'AIM', '', '', '', '', '', '', NULL, '', NULL, 0, 1),
(433, 'A. Lange & Sohne', '', '', '', '', '', '', '.gif', '', NULL, 0, 1),
(446, 'Arora', '', '', '', '', '', '', NULL, '', NULL, 0, 0),
(436, 'Agent Provocateur', '', '', '', '', '', '', '.gif', '', NULL, 0, 1),
(1062, 'Alla Pugacheva', '', '', '', '', '', '', '.gif', '', NULL, 0, 1),
(439, 'All Inclusive', '', '', '', '', '', '', '.gif', '', NULL, 0, 1),
(440, 'Alpha', '', '', '', '', '', '', '.gif', '', NULL, 0, 1),
(1060, 'Amouage', '', '', '', '', '', '', '.gif', '', NULL, 0, 1),
(441, 'Angel Schlesser', '', '', '', '', '', '', '.gif', '', NULL, 0, 1);
