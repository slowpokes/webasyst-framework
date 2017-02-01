-- MySQL dump 10.13  Distrib 5.5.49, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: bd9
-- ------------------------------------------------------
-- Server version	5.5.49-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `SC_news_table`
--

DROP TABLE IF EXISTS `SC_news_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SC_news_table` (
  `NID` int(11) NOT NULL AUTO_INCREMENT,
  `add_date` varchar(30) DEFAULT NULL,
  `title_ru` text,
  `title_en` text,
  `picture` varchar(30) DEFAULT NULL,
  `textToPublication_ru` text,
  `textToPublication_en` text,
  `textToMail` text,
  `add_stamp` int(11) DEFAULT NULL,
  `priority` int(10) unsigned NOT NULL DEFAULT '0',
  `emailed` tinyint(1) DEFAULT NULL,
  `type` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`NID`),
  UNIQUE KEY `UK_SC_news_table_NID` (`NID`),
  KEY `IX_SC_news_table_emailed` (`emailed`),
  KEY `IX_SC_news_table_priority` (`priority`),
  FULLTEXT KEY `IX_SC_news_table_picture` (`picture`),
  FULLTEXT KEY `IX_SC_news_table_textToMail` (`textToMail`),
  FULLTEXT KEY `IX_SC_news_table_textToPublication_en` (`textToPublication_en`),
  FULLTEXT KEY `IX_SC_news_table_textToPublication_ru` (`textToPublication_ru`),
  FULLTEXT KEY `IX_SC_news_table_title_en` (`title_en`),
  FULLTEXT KEY `IX_SC_news_table_title_ru` (`title_ru`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=5835;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `b2c_regions`
--

DROP TABLE IF EXISTS `b2c_regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `b2c_regions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banner_banners`
--

DROP TABLE IF EXISTS `banner_banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banner_banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `width` int(11) NOT NULL DEFAULT '0',
  `height` int(11) NOT NULL DEFAULT '0',
  `click` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banner_items`
--

DROP TABLE IF EXISTS `banner_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banner_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `banner_id` int(11) NOT NULL,
  `on` int(1) NOT NULL DEFAULT '1',
  `url` varchar(255) NOT NULL DEFAULT '',
  `link` varchar(255) NOT NULL DEFAULT '',
  `alt` varchar(255) NOT NULL DEFAULT '',
  `title` varchar(255) NOT NULL DEFAULT '',
  `new_window` int(1) NOT NULL DEFAULT '0',
  `click` int(11) NOT NULL DEFAULT '0',
  `nofollow` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banners_banner`
--

DROP TABLE IF EXISTS `banners_banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banners_banner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `width` int(11) NOT NULL DEFAULT '0',
  `height` int(11) NOT NULL DEFAULT '0',
  `scale` int(11) NOT NULL DEFAULT '0',
  `create_datetime` datetime NOT NULL,
  `params` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banners_click`
--

DROP TABLE IF EXISTS `banners_click`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banners_click` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_id` int(11) NOT NULL DEFAULT '0',
  `ip` varchar(255) NOT NULL DEFAULT '',
  `user_agent` varchar(255) NOT NULL DEFAULT '',
  `create_datetime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banners_image`
--

DROP TABLE IF EXISTS `banners_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banners_image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `banner_id` int(11) NOT NULL DEFAULT '0',
  `upload_datetime` datetime NOT NULL,
  `original_filename` varchar(255) NOT NULL DEFAULT '',
  `ext` varchar(10) NOT NULL DEFAULT '',
  `url` varchar(255) NOT NULL DEFAULT '',
  `alt` varchar(1000) NOT NULL DEFAULT '',
  `disabled` int(11) NOT NULL DEFAULT '0',
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banners_view`
--

DROP TABLE IF EXISTS `banners_view`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banners_view` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `banner_id` int(11) NOT NULL DEFAULT '0',
  `ip` varchar(255) NOT NULL DEFAULT '',
  `user_agent` varchar(255) NOT NULL DEFAULT '',
  `create_datetime` datetime NOT NULL,
  `url` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `blog_blog`
--

DROP TABLE IF EXISTS `blog_blog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_blog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL,
  `status` enum('public','private') NOT NULL DEFAULT 'public',
  `icon` varchar(255) NOT NULL DEFAULT '',
  `color` varchar(50) NOT NULL DEFAULT '',
  `qty` int(11) NOT NULL DEFAULT '0',
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `list` (`status`,`sort`),
  KEY `routing` (`url`,`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `blog_comment`
--

DROP TABLE IF EXISTS `blog_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `left` int(11) DEFAULT NULL,
  `right` int(11) DEFAULT NULL,
  `depth` int(11) NOT NULL DEFAULT '0',
  `parent` int(11) NOT NULL DEFAULT '0',
  `post_id` int(11) NOT NULL,
  `blog_id` int(11) NOT NULL,
  `datetime` datetime NOT NULL,
  `status` enum('approved','deleted') NOT NULL DEFAULT 'approved',
  `text` text NOT NULL,
  `contact_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `site` varchar(255) DEFAULT NULL,
  `auth_provider` varchar(100) DEFAULT NULL,
  `ip` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_id` (`contact_id`),
  KEY `parent` (`parent`),
  KEY `status` (`status`),
  KEY `count` (`blog_id`,`post_id`,`status`),
  KEY `comment` (`post_id`,`left`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `blog_page`
--

DROP TABLE IF EXISTS `blog_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `route` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT '',
  `url` varchar(255) DEFAULT NULL,
  `full_url` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `create_datetime` datetime NOT NULL,
  `update_datetime` datetime NOT NULL,
  `create_contact_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `routing` (`route`,`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `blog_page_params`
--

DROP TABLE IF EXISTS `blog_page_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_page_params` (
  `page_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`page_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `blog_post`
--

DROP TABLE IF EXISTS `blog_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `blog_id` int(11) NOT NULL DEFAULT '1',
  `contact_id` int(11) NOT NULL,
  `contact_name` varchar(150) DEFAULT '',
  `datetime` datetime DEFAULT NULL,
  `title` varchar(255) NOT NULL DEFAULT '',
  `status` enum('draft','deadline','scheduled','published') NOT NULL DEFAULT 'draft',
  `text` mediumtext NOT NULL,
  `text_before_cut` text,
  `cut_link_label` varchar(255) DEFAULT NULL,
  `url` varchar(255) NOT NULL DEFAULT '',
  `comments_allowed` tinyint(1) NOT NULL DEFAULT '1',
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_keywords` text,
  `meta_description` text,
  `album_id` int(11) DEFAULT NULL,
  `album_link_type` enum('blog','photos') DEFAULT NULL,
  `main_image` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `routing` (`status`,`url`,`blog_id`),
  KEY `feed` (`status`,`blog_id`,`datetime`),
  KEY `contact` (`contact_id`,`blog_id`,`status`,`datetime`),
  KEY `datetime` (`datetime`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `blog_post_params`
--

DROP TABLE IF EXISTS `blog_post_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_post_params` (
  `post_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`post_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categories_store`
--

DROP TABLE IF EXISTS `categories_store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories_store` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent` int(11) DEFAULT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `checklists_list`
--

DROP TABLE IF EXISTS `checklists_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `checklists_list` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `color_class` varchar(32) NOT NULL DEFAULT 'c-white',
  `icon` varchar(255) NOT NULL DEFAULT 'notebook',
  `count` int(11) NOT NULL DEFAULT '0',
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `sort` (`sort`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `checklists_list_items`
--

DROP TABLE IF EXISTS `checklists_list_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `checklists_list_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `list_id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `done` datetime DEFAULT NULL,
  `contact_id` bigint(20) DEFAULT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `list_id` (`list_id`),
  KEY `sort` (`sort`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contacts_history`
--

DROP TABLE IF EXISTS `contacts_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contacts_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `hash` text NOT NULL,
  `contact_id` bigint(20) NOT NULL,
  `position` int(11) NOT NULL DEFAULT '0',
  `accessed` datetime DEFAULT NULL,
  `cnt` int(11) NOT NULL DEFAULT '-1',
  PRIMARY KEY (`id`),
  KEY `contact_id` (`contact_id`),
  KEY `accessed` (`contact_id`,`accessed`),
  KEY `hash` (`contact_id`,`hash`(24)),
  KEY `position` (`contact_id`,`position`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contacts_rights`
--

DROP TABLE IF EXISTS `contacts_rights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contacts_rights` (
  `group_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `writable` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`group_id`,`category_id`),
  KEY `list_id` (`category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `courier_nakl`
--

DROP TABLE IF EXISTS `courier_nakl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courier_nakl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(15,4) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `courier_nakl_order`
--

DROP TABLE IF EXISTS `courier_nakl_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courier_nakl_order` (
  `nakl_id` int(11) NOT NULL,
  `site_id` varchar(100) NOT NULL,
  `order_id` int(11) NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `couriers_courier`
--

DROP TABLE IF EXISTS `couriers_courier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `couriers_courier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `archive` int(11) NOT NULL,
  `default_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `couriers_order`
--

DROP TABLE IF EXISTS `couriers_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `couriers_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courier_id` int(11) NOT NULL,
  `site_id` varchar(20) NOT NULL,
  `order_id` int(11) NOT NULL,
  `status` varchar(20) NOT NULL,
  `shipping_datetime` datetime NOT NULL,
  `salary` decimal(15,4) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_id` (`site_id`,`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `geo_area`
--

DROP TABLE IF EXISTS `geo_area`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `geo_area` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `geo_base`
--

DROP TABLE IF EXISTS `geo_base`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `geo_base` (
  `long_ip1` bigint(20) NOT NULL,
  `long_ip2` bigint(20) NOT NULL,
  `ip1` varchar(16) NOT NULL,
  `ip2` varchar(16) NOT NULL,
  `country` varchar(2) NOT NULL,
  `city_id` int(10) NOT NULL,
  KEY `INDEX` (`long_ip1`,`long_ip2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `geo_citi`
--

DROP TABLE IF EXISTS `geo_citi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `geo_citi` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `area_code` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fcity_id` (`id`),
  KEY `fcity_id_2` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `geo_cities`
--

DROP TABLE IF EXISTS `geo_cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `geo_cities` (
  `city_id` int(10) NOT NULL,
  `city` varchar(128) NOT NULL,
  `region` varchar(128) NOT NULL,
  `district` varchar(128) NOT NULL,
  `lat` float NOT NULL,
  `lng` float NOT NULL,
  `region_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `geo_timezone`
--

DROP TABLE IF EXISTS `geo_timezone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `geo_timezone` (
  `id` int(14) NOT NULL AUTO_INCREMENT,
  `region_id` int(14) NOT NULL,
  `name` varchar(255) NOT NULL,
  `timezone` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_draft_recipients`
--

DROP TABLE IF EXISTS `mailer_draft_recipients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_draft_recipients` (
  `message_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact_id` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_form`
--

DROP TABLE IF EXISTS `mailer_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_form` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `create_datetime` datetime NOT NULL,
  `create_contact_id` int(11) NOT NULL,
  `locale` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_form_params`
--

DROP TABLE IF EXISTS `mailer_form_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_form_params` (
  `form_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`form_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_form_subscribe_lists`
--

DROP TABLE IF EXISTS `mailer_form_subscribe_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_form_subscribe_lists` (
  `form_id` int(11) NOT NULL,
  `list_id` int(11) NOT NULL,
  PRIMARY KEY (`form_id`,`list_id`),
  KEY `list_id_idx` (`list_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_message`
--

DROP TABLE IF EXISTS `mailer_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `create_datetime` datetime NOT NULL,
  `create_contact_id` int(11) NOT NULL,
  `status` smallint(6) NOT NULL DEFAULT '0',
  `send_datetime` datetime DEFAULT NULL,
  `finished_datetime` datetime DEFAULT NULL,
  `sender_id` int(11) NOT NULL DEFAULT '0',
  `from_name` varchar(255) NOT NULL DEFAULT '',
  `from_email` varchar(255) NOT NULL DEFAULT '',
  `reply_to` varchar(255) NOT NULL DEFAULT '',
  `return_path` varchar(255) NOT NULL DEFAULT '',
  `priority` smallint(6) NOT NULL DEFAULT '0',
  `subject` varchar(255) NOT NULL,
  `body` mediumtext NOT NULL,
  `attachments` text,
  `list_id` int(11) NOT NULL DEFAULT '0',
  `is_template` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_message_log`
--

DROP TABLE IF EXISTS `mailer_message_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_message_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `message_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact_id` int(11) NOT NULL,
  `datetime` datetime DEFAULT NULL,
  `status` smallint(6) NOT NULL DEFAULT '0',
  `error` text,
  `error_class` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `message_id` (`message_id`,`email`),
  KEY `error_class` (`error_class`),
  KEY `message_id_status` (`message_id`,`status`),
  KEY `contact_id` (`contact_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_message_params`
--

DROP TABLE IF EXISTS `mailer_message_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_message_params` (
  `message_id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`message_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_message_recipients`
--

DROP TABLE IF EXISTS `mailer_message_recipients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_message_recipients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` int(11) NOT NULL,
  `group` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `value` text NOT NULL,
  `count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `message_id` (`message_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_return_path`
--

DROP TABLE IF EXISTS `mailer_return_path`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_return_path` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `server` varchar(255) NOT NULL,
  `port` mediumint(9) NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `ssl` tinyint(1) NOT NULL,
  `last_error` text,
  `last_campaign_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `last_campaign_date` (`last_campaign_date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_sender`
--

DROP TABLE IF EXISTS `mailer_sender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_sender` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_sender_params`
--

DROP TABLE IF EXISTS `mailer_sender_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_sender_params` (
  `sender_id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`sender_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_subscribe_list`
--

DROP TABLE IF EXISTS `mailer_subscribe_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_subscribe_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `create_contact_id` int(11) NOT NULL,
  `create_datetime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_subscriber`
--

DROP TABLE IF EXISTS `mailer_subscriber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_subscriber` (
  `contact_id` int(11) NOT NULL,
  `list_id` int(11) NOT NULL,
  `datetime` datetime NOT NULL,
  `contact_email_id` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`list_id`,`contact_id`,`contact_email_id`),
  KEY `contact_id` (`contact_id`),
  KEY `contact_email_id` (`contact_email_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_subscriber_temp`
--

DROP TABLE IF EXISTS `mailer_subscriber_temp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_subscriber_temp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hash` varchar(100) NOT NULL,
  `data` text NOT NULL,
  `create_datetime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hash` (`hash`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mailer_unsubscriber`
--

DROP TABLE IF EXISTS `mailer_unsubscriber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mailer_unsubscriber` (
  `email` varchar(255) NOT NULL,
  `list_id` int(11) NOT NULL,
  `message_id` int(10) DEFAULT NULL,
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`email`,`list_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photos_album`
--

DROP TABLE IF EXISTS `photos_album`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos_album` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `type` int(1) NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `description` text,
  `hash` varchar(32) NOT NULL DEFAULT '',
  `url` varchar(255) DEFAULT NULL,
  `full_url` varchar(255) DEFAULT NULL,
  `status` smallint(6) NOT NULL DEFAULT '0',
  `conditions` text,
  `create_datetime` datetime NOT NULL,
  `contact_id` int(11) NOT NULL,
  `thumb` int(11) NOT NULL DEFAULT '0',
  `sort` int(11) NOT NULL DEFAULT '0',
  `key_photo_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`parent_id`,`url`),
  UNIQUE KEY `full_url` (`full_url`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photos_album_count`
--

DROP TABLE IF EXISTS `photos_album_count`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos_album_count` (
  `album_id` int(11) NOT NULL,
  `contact_id` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  PRIMARY KEY (`album_id`,`contact_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photos_album_params`
--

DROP TABLE IF EXISTS `photos_album_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos_album_params` (
  `album_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`album_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photos_album_photos`
--

DROP TABLE IF EXISTS `photos_album_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos_album_photos` (
  `album_id` int(11) NOT NULL,
  `photo_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`album_id`,`photo_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photos_album_rights`
--

DROP TABLE IF EXISTS `photos_album_rights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos_album_rights` (
  `group_id` int(11) NOT NULL,
  `album_id` int(11) NOT NULL,
  PRIMARY KEY (`group_id`,`album_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photos_comment`
--

DROP TABLE IF EXISTS `photos_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `left` int(11) DEFAULT NULL,
  `right` int(11) DEFAULT NULL,
  `depth` int(11) NOT NULL DEFAULT '0',
  `parent` int(11) NOT NULL DEFAULT '0',
  `photo_id` int(11) NOT NULL,
  `datetime` datetime NOT NULL,
  `status` enum('approved','deleted') NOT NULL DEFAULT 'approved',
  `text` text NOT NULL,
  `contact_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `site` varchar(100) DEFAULT NULL,
  `auth_provider` varchar(100) DEFAULT NULL,
  `ip` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_id` (`contact_id`),
  KEY `photo_id` (`photo_id`),
  KEY `parent` (`parent`),
  KEY `status` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photos_page`
--

DROP TABLE IF EXISTS `photos_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `route` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT '',
  `url` varchar(255) DEFAULT NULL,
  `full_url` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `create_datetime` datetime NOT NULL,
  `update_datetime` datetime NOT NULL,
  `create_contact_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photos_page_params`
--

DROP TABLE IF EXISTS `photos_page_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos_page_params` (
  `page_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`page_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photos_photo`
--

DROP TABLE IF EXISTS `photos_photo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos_photo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `ext` varchar(10) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `rate` decimal(3,2) NOT NULL DEFAULT '0.00',
  `width` int(5) NOT NULL DEFAULT '0',
  `height` int(5) NOT NULL DEFAULT '0',
  `contact_id` int(11) NOT NULL,
  `upload_datetime` datetime NOT NULL,
  `edit_datetime` datetime DEFAULT NULL,
  `status` smallint(6) NOT NULL DEFAULT '0',
  `hash` varchar(32) NOT NULL DEFAULT '',
  `url` varchar(255) DEFAULT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `stack_count` int(11) NOT NULL DEFAULT '0',
  `sort` int(11) NOT NULL DEFAULT '0',
  `source` varchar(32) NOT NULL DEFAULT 'backend',
  `app_id` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`),
  KEY `app_id` (`app_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photos_photo_exif`
--

DROP TABLE IF EXISTS `photos_photo_exif`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos_photo_exif` (
  `photo_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`photo_id`,`name`),
  KEY `exif` (`name`,`value`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photos_photo_rights`
--

DROP TABLE IF EXISTS `photos_photo_rights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos_photo_rights` (
  `group_id` int(11) NOT NULL,
  `photo_id` int(11) NOT NULL,
  PRIMARY KEY (`group_id`,`photo_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photos_photo_tags`
--

DROP TABLE IF EXISTS `photos_photo_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos_photo_tags` (
  `photo_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`photo_id`,`tag_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photos_tag`
--

DROP TABLE IF EXISTS `photos_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products_store`
--

DROP TABLE IF EXISTS `products_store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products_store` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_store` int(11) unsigned NOT NULL,
  `code` varchar(64) DEFAULT NULL,
  `barcode` varchar(50) NOT NULL,
  `image_id` int(11) unsigned NOT NULL,
  `product` varchar(255) NOT NULL,
  `buy_price` int(11) NOT NULL,
  `amount_real` int(11) NOT NULL DEFAULT '0',
  `amount_virt` int(11) NOT NULL DEFAULT '0',
  `virt_flag` tinyint(1) NOT NULL DEFAULT '1',
  `weight` int(11) NOT NULL DEFAULT '0' COMMENT 'Масса в граммах',
  `add_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `row` varchar(255) NOT NULL,
  `stillage` varchar(255) NOT NULL,
  `shelf` varchar(255) NOT NULL,
  `place` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `redirect2`
--

DROP TABLE IF EXISTS `redirect2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `redirect2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` varchar(100) NOT NULL,
  `url` varchar(1000) NOT NULL,
  `redirect` varchar(1000) NOT NULL,
  `add_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `visible` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `url` (`url`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shipment_b2c_zones`
--

DROP TABLE IF EXISTS `shipment_b2c_zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipment_b2c_zones` (
  `region` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `zip_from` int(11) NOT NULL,
  `zip_to` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shipment_codecheck`
--

DROP TABLE IF EXISTS `shipment_codecheck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipment_codecheck` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `site_id` varchar(30) NOT NULL,
  `order_id` int(11) NOT NULL,
  `barcode` varchar(100) NOT NULL,
  `operation_type` varchar(300) NOT NULL,
  `operation_text` varchar(300) NOT NULL,
  `operation_date` datetime NOT NULL,
  `operation_zip` varchar(300) NOT NULL,
  `operation_place` varchar(300) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shipment_hermes_points`
--

DROP TABLE IF EXISTS `shipment_hermes_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipment_hermes_points` (
  `id` int(11) NOT NULL,
  `address` varchar(1000) NOT NULL,
  `name` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `region` varchar(2) NOT NULL,
  `latitude` decimal(11,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shipment_nakl`
--

DROP TABLE IF EXISTS `shipment_nakl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipment_nakl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  `counter` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `create_date` datetime NOT NULL,
  `status` int(11) NOT NULL,
  `del_date` datetime NOT NULL,
  `orders_count` int(11) NOT NULL,
  `orders_total` decimal(15,4) NOT NULL,
  `extension` varchar(100) NOT NULL,
  `extension_small` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shipment_nakl_order`
--

DROP TABLE IF EXISTS `shipment_nakl_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipment_nakl_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nakl_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `site` varchar(50) NOT NULL,
  `params` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shipment_pochta_orders`
--

DROP TABLE IF EXISTS `shipment_pochta_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipment_pochta_orders` (
  `id` int(11) NOT NULL,
  `status` int(10) NOT NULL,
  `type` varchar(255) NOT NULL,
  `shipment_date` date NOT NULL,
  `pod` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shipment_pochta_shpi`
--

DROP TABLE IF EXISTS `shipment_pochta_shpi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipment_pochta_shpi` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_abtest`
--

DROP TABLE IF EXISTS `shop_abtest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_abtest` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `create_datetime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_abtest_variants`
--

DROP TABLE IF EXISTS `shop_abtest_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_abtest_variants` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `abtest_id` int(11) unsigned NOT NULL,
  `code` varchar(16) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `antest_code` (`abtest_id`,`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_affiliate_transaction`
--

DROP TABLE IF EXISTS `shop_affiliate_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_affiliate_transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_id` int(11) NOT NULL,
  `create_datetime` datetime NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `amount` decimal(15,4) NOT NULL,
  `balance` decimal(15,4) NOT NULL,
  `comment` text,
  `type` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_id` (`contact_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_api_courier`
--

DROP TABLE IF EXISTS `shop_api_courier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_api_courier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `enabled` int(1) NOT NULL DEFAULT '1',
  `contact_id` int(11) DEFAULT NULL,
  `create_datetime` datetime NOT NULL,
  `orders_processed` int(11) NOT NULL DEFAULT '0',
  `note` text,
  `api_token` varchar(32) DEFAULT NULL,
  `api_pin` varchar(32) DEFAULT NULL,
  `api_pin_expire` datetime DEFAULT NULL,
  `api_last_use` datetime DEFAULT NULL,
  `all_storefronts` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_api_courier_storefronts`
--

DROP TABLE IF EXISTS `shop_api_courier_storefronts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_api_courier_storefronts` (
  `courier_id` int(11) NOT NULL,
  `storefront` varchar(255) NOT NULL,
  KEY `courier` (`courier_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_banner`
--

DROP TABLE IF EXISTS `shop_banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_banner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(20) NOT NULL,
  `html` text NOT NULL,
  `create_datetime` datetime NOT NULL,
  `edit_datetime` datetime NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_banner_image`
--

DROP TABLE IF EXISTS `shop_banner_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_banner_image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `position` int(11) NOT NULL,
  `banner_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_brand`
--

DROP TABLE IF EXISTS `shop_brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_brand` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `meta_title` varchar(255) NOT NULL,
  `meta_keywords` text NOT NULL,
  `meta_description` text NOT NULL,
  `description` text NOT NULL,
  `create_datetime` datetime NOT NULL,
  `edit_datetime` datetime NOT NULL,
  `site_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_brandtag`
--

DROP TABLE IF EXISTS `shop_brandtag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_brandtag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `brandtag` varchar(255) NOT NULL,
  `sort` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_brandtag_brand`
--

DROP TABLE IF EXISTS `shop_brandtag_brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_brandtag_brand` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `brand` varchar(1000) NOT NULL,
  `brandtag_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_buyer_comments`
--

DROP TABLE IF EXISTS `shop_buyer_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_buyer_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `contact` int(11) NOT NULL,
  `comment` text NOT NULL,
  `date` datetime NOT NULL,
  `order_id` int(11) NOT NULL,
  `client` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_cart_items`
--

DROP TABLE IF EXISTS `shop_cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_cart_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) DEFAULT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `sku_id` int(11) NOT NULL,
  `create_datetime` datetime NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `type` enum('product','service') NOT NULL DEFAULT 'product',
  `service_id` int(11) DEFAULT NULL,
  `service_variant_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `code` (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_carts_plugin_contact`
--

DROP TABLE IF EXISTS `shop_carts_plugin_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_carts_plugin_contact` (
  `code` varchar(32) NOT NULL DEFAULT '',
  `contact` text,
  `contact_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_carts_plugin_log`
--

DROP TABLE IF EXISTS `shop_carts_plugin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_carts_plugin_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `message_id` int(10) unsigned NOT NULL DEFAULT '0',
  `code` varchar(32) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  `phone` varchar(255) NOT NULL DEFAULT '',
  `subject` text,
  `body` text,
  `body_sms` varchar(1000) NOT NULL DEFAULT '',
  `sent` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `comment` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `message_id` (`message_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_carts_plugin_message`
--

DROP TABLE IF EXISTS `shop_carts_plugin_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_carts_plugin_message` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(1000) NOT NULL DEFAULT '',
  `delay` int(10) unsigned NOT NULL DEFAULT '0',
  `source` varchar(255) NOT NULL DEFAULT '',
  `type` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `sender` varchar(255) NOT NULL,
  `subject` text,
  `body` text,
  `sender_sms` varchar(255) NOT NULL,
  `body_sms` varchar(1000) NOT NULL DEFAULT '',
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_carts_plugin_storefront`
--

DROP TABLE IF EXISTS `shop_carts_plugin_storefront`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_carts_plugin_storefront` (
  `code` varchar(32) NOT NULL,
  `storefront` varchar(255) NOT NULL,
  `contact_id` int(10) unsigned DEFAULT NULL,
  `edit_datetime` datetime DEFAULT NULL,
  `last_send_datetime` datetime DEFAULT NULL,
  `cancel` tinyint(1) NOT NULL DEFAULT '0',
  `restore` tinyint(1) NOT NULL DEFAULT '0',
  `order_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_category`
--

DROP TABLE IF EXISTS `shop_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `min_product_count` int(11) NOT NULL,
  `min_sum` decimal(15,4) NOT NULL,
  `wholesale_min_product_count` int(11) NOT NULL,
  `wholesale_min_sum` decimal(15,4) NOT NULL,
  `id_1c` varchar(36) DEFAULT NULL,
  `left_key` int(11) DEFAULT NULL,
  `right_key` int(11) DEFAULT NULL,
  `depth` int(11) NOT NULL DEFAULT '0',
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `dirpic` varchar(255) NOT NULL,
  `meta_title` varchar(1000) DEFAULT NULL,
  `meta_keywords` text,
  `meta_description` text,
  `type` int(1) NOT NULL DEFAULT '0',
  `url` varchar(255) DEFAULT NULL,
  `full_url` varchar(255) DEFAULT NULL,
  `count` int(11) NOT NULL DEFAULT '0',
  `description` text,
  `conditions` text,
  `create_datetime` datetime NOT NULL,
  `edit_datetime` datetime DEFAULT NULL,
  `filter` text,
  `sort_products` varchar(32) DEFAULT NULL,
  `include_sub_categories` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `site_id` int(11) unsigned NOT NULL,
  `alt_name` varchar(255) NOT NULL,
  `titlemask` varchar(255) DEFAULT NULL,
  `descriptionmask` text,
  `keywordsmask` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`parent_id`,`url`),
  UNIQUE KEY `full_url` (`full_url`),
  KEY `ns_keys` (`left_key`,`right_key`),
  KEY `id_1c` (`id_1c`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_category_broken`
--

DROP TABLE IF EXISTS `shop_category_broken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_category_broken` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `left_key` int(11) DEFAULT NULL,
  `right_key` int(11) DEFAULT NULL,
  `depth` int(11) NOT NULL DEFAULT '0',
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_keywords` text,
  `meta_description` text,
  `type` int(1) NOT NULL DEFAULT '0',
  `url` varchar(255) DEFAULT NULL,
  `full_url` varchar(255) DEFAULT NULL,
  `count` int(11) NOT NULL DEFAULT '0',
  `description` text,
  `conditions` text,
  `create_datetime` datetime NOT NULL,
  `edit_datetime` datetime DEFAULT NULL,
  `filter` text,
  `sort_products` varchar(32) DEFAULT NULL,
  `include_sub_categories` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `site_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`parent_id`,`url`),
  UNIQUE KEY `full_url` (`full_url`),
  KEY `parent_id` (`parent_id`),
  KEY `left_key` (`left_key`),
  KEY `right_key` (`right_key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_category_images`
--

DROP TABLE IF EXISTS `shop_category_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_category_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `standard_out` int(11) NOT NULL DEFAULT '1',
  `upload_datetime` datetime NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `ext` varchar(10) NOT NULL,
  `width` int(5) NOT NULL DEFAULT '0',
  `height` int(5) NOT NULL DEFAULT '0',
  `size` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_category_og`
--

DROP TABLE IF EXISTS `shop_category_og`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_category_og` (
  `category_id` int(11) NOT NULL,
  `property` varchar(255) NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`category_id`,`property`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_category_params`
--

DROP TABLE IF EXISTS `shop_category_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_category_params` (
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`category_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_category_products`
--

DROP TABLE IF EXISTS `shop_category_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_category_products` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`category_id`,`product_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_category_routes`
--

DROP TABLE IF EXISTS `shop_category_routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_category_routes` (
  `category_id` int(11) NOT NULL,
  `route` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`,`route`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_checkout_flow`
--

DROP TABLE IF EXISTS `shop_checkout_flow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_checkout_flow` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) DEFAULT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `year` smallint(6) DEFAULT NULL,
  `quarter` smallint(6) DEFAULT NULL,
  `month` smallint(6) DEFAULT NULL,
  `step` tinyint(2) NOT NULL DEFAULT '0',
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_clienttime`
--

DROP TABLE IF EXISTS `shop_clienttime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_clienttime` (
  `order_id` int(11) NOT NULL,
  `timezone` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_contact_category_discount`
--

DROP TABLE IF EXISTS `shop_contact_category_discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_contact_category_discount` (
  `category_id` int(10) NOT NULL,
  `discount` decimal(15,4) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_coupon`
--

DROP TABLE IF EXISTS `shop_coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_coupon` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) NOT NULL,
  `type` varchar(3) NOT NULL,
  `limit` int(11) DEFAULT NULL,
  `used` int(11) NOT NULL DEFAULT '0',
  `value` decimal(15,4) DEFAULT NULL,
  `comment` text,
  `expire_datetime` datetime DEFAULT NULL,
  `create_datetime` datetime NOT NULL,
  `create_contact_id` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_currency`
--

DROP TABLE IF EXISTS `shop_currency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_currency` (
  `code` char(3) NOT NULL,
  `rate` decimal(18,10) NOT NULL DEFAULT '1.0000000000',
  `rounding` decimal(8,2) DEFAULT NULL,
  `round_up_only` int(11) NOT NULL DEFAULT '1',
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_customer`
--

DROP TABLE IF EXISTS `shop_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_customer` (
  `contact_id` int(11) NOT NULL,
  `total_spent` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `affiliate_bonus` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `number_of_orders` int(11) NOT NULL DEFAULT '0',
  `last_order_id` int(11) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`contact_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_customers_filter`
--

DROP TABLE IF EXISTS `shop_customers_filter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_customers_filter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `hash` text,
  `create_datetime` datetime DEFAULT NULL,
  `contact_id` int(11) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_id` (`contact_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_discount_by_sum`
--

DROP TABLE IF EXISTS `shop_discount_by_sum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_discount_by_sum` (
  `type` varchar(32) NOT NULL,
  `sum` decimal(15,4) NOT NULL,
  `discount` decimal(15,4) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_expense`
--

DROP TABLE IF EXISTS `shop_expense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_expense` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(16) NOT NULL,
  `name` varchar(255) NOT NULL,
  `storefront` varchar(255) DEFAULT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `amount` decimal(15,4) NOT NULL,
  `color` varchar(7) DEFAULT NULL,
  `note` text,
  PRIMARY KEY (`id`),
  KEY `start_end` (`start`,`end`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_favoriteproducts`
--

DROP TABLE IF EXISTS `shop_favoriteproducts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_favoriteproducts` (
  `contact_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`contact_id`,`product_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_feature`
--

DROP TABLE IF EXISTS `shop_feature`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_feature` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT NULL,
  `code` varchar(64) NOT NULL,
  `status` enum('public','hidden','private') NOT NULL DEFAULT 'public',
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `selectable` int(11) NOT NULL,
  `multiple` int(11) NOT NULL,
  `count` int(10) unsigned NOT NULL DEFAULT '0',
  `sort` int(11) NOT NULL DEFAULT '0',
  `collapsed` tinyint(4) NOT NULL DEFAULT '1',
  `sort_values` int(11) NOT NULL DEFAULT '0',
  `hidden` int(11) NOT NULL,
  `link_type` varchar(200) NOT NULL,
  `sort_product` int(11) NOT NULL,
  `val_line` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_feature_values_color`
--

DROP TABLE IF EXISTS `shop_feature_values_color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_feature_values_color` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feature_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `code` mediumint(8) unsigned DEFAULT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `values` (`feature_id`,`value`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_feature_values_dimension`
--

DROP TABLE IF EXISTS `shop_feature_values_dimension`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_feature_values_dimension` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feature_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `value` double NOT NULL,
  `unit` varchar(255) NOT NULL,
  `type` varchar(16) NOT NULL,
  `value_base_unit` double NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `feature_id` (`feature_id`,`value`,`unit`,`type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_feature_values_double`
--

DROP TABLE IF EXISTS `shop_feature_values_double`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_feature_values_double` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feature_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `value` double NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `values` (`feature_id`,`value`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_feature_values_range`
--

DROP TABLE IF EXISTS `shop_feature_values_range`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_feature_values_range` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feature_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `begin` double DEFAULT NULL,
  `end` double DEFAULT NULL,
  `unit` varchar(255) NOT NULL,
  `type` varchar(16) NOT NULL,
  `begin_base_unit` double DEFAULT NULL,
  `end_base_unit` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `feature_id` (`feature_id`,`begin`,`end`,`unit`,`type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_feature_values_text`
--

DROP TABLE IF EXISTS `shop_feature_values_text`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_feature_values_text` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feature_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `value` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_feature_values_varchar`
--

DROP TABLE IF EXISTS `shop_feature_values_varchar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_feature_values_varchar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feature_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `values` (`feature_id`,`value`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_flexdiscount`
--

DROP TABLE IF EXISTS `shop_flexdiscount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_flexdiscount` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mask` varchar(15) NOT NULL,
  `value` varchar(15) NOT NULL,
  `discount_percentage` int(3) NOT NULL DEFAULT '0',
  `discount` int(10) NOT NULL DEFAULT '0',
  `affiliate` int(11) NOT NULL,
  `category_id` int(10) NOT NULL DEFAULT '0',
  `type_id` int(10) NOT NULL DEFAULT '0',
  `coupon_id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(200) NOT NULL DEFAULT '',
  `expire_datetime` datetime DEFAULT NULL,
  `sort` int(10) NOT NULL DEFAULT '0',
  `code` varchar(50) NOT NULL DEFAULT '',
  `set_id` varchar(255) NOT NULL DEFAULT '',
  `contact_category_id` int(11) NOT NULL DEFAULT '0',
  `discounteachitem` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `m_v_c_t_c_s_c` (`mask`,`value`,`category_id`,`type_id`,`coupon_id`,`set_id`,`contact_category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_flexdiscount_affiliate`
--

DROP TABLE IF EXISTS `shop_flexdiscount_affiliate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_flexdiscount_affiliate` (
  `contact_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `affiliate` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`contact_id`,`order_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_flexdiscount_coupon`
--

DROP TABLE IF EXISTS `shop_flexdiscount_coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_flexdiscount_coupon` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(16) NOT NULL,
  `limit` int(11) NOT NULL DEFAULT '-1',
  `used` int(11) NOT NULL DEFAULT '0',
  `create_datetime` datetime NOT NULL,
  `expire_datetime` datetime DEFAULT NULL,
  `comment` text NOT NULL,
  `color` varchar(6) NOT NULL DEFAULT '',
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_flexdiscount_coupon_order`
--

DROP TABLE IF EXISTS `shop_flexdiscount_coupon_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_flexdiscount_coupon_order` (
  `coupon_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `discount` float(14,2) NOT NULL,
  `affiliate` int(11) NOT NULL,
  `datetime` datetime NOT NULL,
  KEY `coupon` (`coupon_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_flexdiscount_settings`
--

DROP TABLE IF EXISTS `shop_flexdiscount_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_flexdiscount_settings` (
  `field` varchar(30) NOT NULL,
  `ext` varchar(30) NOT NULL DEFAULT '',
  `value` varchar(255) NOT NULL,
  UNIQUE KEY `field_ext` (`field`,`ext`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_followup`
--

DROP TABLE IF EXISTS `shop_followup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_followup` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `delay` int(10) NOT NULL,
  `first_order_only` tinyint(3) NOT NULL DEFAULT '1',
  `subject` text NOT NULL,
  `body` text NOT NULL,
  `last_cron_time` datetime NOT NULL,
  `from` varchar(32) DEFAULT NULL,
  `source` varchar(64) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `transport` enum('sms','email') NOT NULL DEFAULT 'email',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_importexport`
--

DROP TABLE IF EXISTS `shop_importexport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_importexport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plugin` varchar(64) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `config` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`plugin`,`id`,`sort`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_inheritfilters_params`
--

DROP TABLE IF EXISTS `shop_inheritfilters_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_inheritfilters_params` (
  `category_id` int(11) NOT NULL DEFAULT '0',
  `inherit_from_me` tinyint(1) DEFAULT NULL,
  `not_inherit` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_notification`
--

DROP TABLE IF EXISTS `shop_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `event` varchar(64) NOT NULL,
  `transport` enum('email','sms','http') NOT NULL DEFAULT 'email',
  `source` varchar(64) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `event` (`event`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_notification_params`
--

DROP TABLE IF EXISTS `shop_notification_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_notification_params` (
  `notification_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`notification_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_order`
--

DROP TABLE IF EXISTS `shop_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_id` int(11) DEFAULT NULL,
  `create_datetime` datetime NOT NULL,
  `update_datetime` datetime DEFAULT NULL,
  `state_id` varchar(32) NOT NULL DEFAULT 'new',
  `total` decimal(15,4) NOT NULL,
  `currency` char(3) NOT NULL,
  `rate` decimal(15,8) NOT NULL DEFAULT '1.00000000',
  `tax` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `shipping` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `discount` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `assigned_contact_id` int(11) DEFAULT NULL,
  `paid_year` smallint(6) DEFAULT NULL,
  `paid_quarter` smallint(6) DEFAULT NULL,
  `paid_month` smallint(6) DEFAULT NULL,
  `paid_date` date DEFAULT NULL,
  `is_first` tinyint(1) NOT NULL DEFAULT '0',
  `unsettled` tinyint(1) NOT NULL DEFAULT '0',
  `comment` text,
  `site_id` int(11) unsigned NOT NULL,
  `roistat_visit` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `state_id` (`state_id`),
  KEY `contact_id` (`contact_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_order_items`
--

DROP TABLE IF EXISTS `shop_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `product_id` int(11) NOT NULL,
  `sku_id` int(11) NOT NULL,
  `sku_code` varchar(255) NOT NULL DEFAULT '',
  `type` enum('product','service') NOT NULL,
  `service_id` int(11) DEFAULT NULL,
  `service_variant_id` int(11) DEFAULT NULL,
  `price` decimal(15,4) NOT NULL,
  `quantity` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `stock_id` int(11) DEFAULT NULL,
  `virtualstock_id` int(11) DEFAULT NULL,
  `purchase_price` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `total_discount` decimal(15,4) NOT NULL DEFAULT '0.0000',
  PRIMARY KEY (`id`),
  KEY `product_order` (`product_id`,`order_id`),
  KEY `order_type` (`order_id`,`type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_order_log`
--

DROP TABLE IF EXISTS `shop_order_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_order_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `action_id` varchar(32) NOT NULL,
  `datetime` datetime NOT NULL,
  `before_state_id` varchar(16) NOT NULL,
  `after_state_id` varchar(16) NOT NULL,
  `text` text,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_order_log_params`
--

DROP TABLE IF EXISTS `shop_order_log_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_order_log_params` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `log_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`order_id`,`log_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_order_params`
--

DROP TABLE IF EXISTS `shop_order_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_order_params` (
  `order_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`order_id`,`name`),
  KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_page`
--

DROP TABLE IF EXISTS `shop_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `route` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT '',
  `url` varchar(255) DEFAULT NULL,
  `full_url` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `create_datetime` datetime NOT NULL,
  `update_datetime` datetime NOT NULL,
  `create_contact_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_page_params`
--

DROP TABLE IF EXISTS `shop_page_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_page_params` (
  `page_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`page_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_plugin`
--

DROP TABLE IF EXISTS `shop_plugin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_plugin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `plugin` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `logo` text NOT NULL,
  `status` int(11) NOT NULL,
  `sort` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `type` (`type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_plugin_settings`
--

DROP TABLE IF EXISTS `shop_plugin_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_plugin_settings` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product`
--

DROP TABLE IF EXISTS `shop_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `multiplicity` int(11) NOT NULL,
  `min_product_count` int(11) NOT NULL,
  `wholesale_multiplicity` int(11) NOT NULL,
  `wholesale_min_product_count` int(11) NOT NULL,
  `id_1c` varchar(36) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `summary` text,
  `meta_title` varchar(1000) DEFAULT NULL,
  `meta_keywords` text,
  `meta_description` text,
  `description` text,
  `contact_id` int(11) DEFAULT NULL,
  `create_datetime` datetime NOT NULL,
  `edit_datetime` datetime DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `type_id` int(11) DEFAULT NULL,
  `image_id` int(11) DEFAULT NULL,
  `image_filename` varchar(255) NOT NULL DEFAULT '',
  `video_url` varchar(255) DEFAULT NULL,
  `sku_id` int(11) DEFAULT NULL,
  `ext` varchar(10) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `price` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `compare_price` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `currency` char(3) DEFAULT NULL,
  `min_price` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `max_price` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `tax_id` int(11) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `cross_selling` tinyint(1) DEFAULT NULL,
  `upselling` tinyint(1) DEFAULT NULL,
  `rating_count` int(11) NOT NULL DEFAULT '0',
  `total_sales` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `category_id` int(11) DEFAULT NULL,
  `badge` varchar(255) DEFAULT NULL,
  `site_id` int(11) unsigned NOT NULL,
  `sku_type` tinyint(1) NOT NULL DEFAULT '0',
  `base_price_selectable` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `human_name` varchar(1000) NOT NULL,
  `sku_count` int(11) NOT NULL DEFAULT '1',
  `compare_price_selectable` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `purchase_price_selectable` decimal(15,4) NOT NULL DEFAULT '0.0000',
  PRIMARY KEY (`id`),
  KEY `url` (`url`),
  KEY `total_sales` (`total_sales`),
  KEY `id_1c` (`id_1c`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_features`
--

DROP TABLE IF EXISTS `shop_product_features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_features` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `sku_id` int(11) DEFAULT NULL,
  `feature_id` int(11) NOT NULL,
  `feature_value_id` int(11) NOT NULL,
  `create_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `feature` (`product_id`,`sku_id`,`feature_id`,`feature_value_id`),
  KEY `product_feature` (`product_id`,`feature_id`,`feature_value_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_features_selectable`
--

DROP TABLE IF EXISTS `shop_product_features_selectable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_features_selectable` (
  `product_id` int(11) NOT NULL,
  `feature_id` int(11) NOT NULL,
  `value_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`feature_id`,`value_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_images`
--

DROP TABLE IF EXISTS `shop_product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `upload_datetime` datetime NOT NULL,
  `edit_datetime` datetime DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `width` int(5) NOT NULL DEFAULT '0',
  `height` int(5) NOT NULL DEFAULT '0',
  `size` int(11) DEFAULT NULL,
  `filename` varchar(255) NOT NULL DEFAULT '',
  `original_filename` varchar(255) DEFAULT NULL,
  `ext` varchar(10) DEFAULT NULL,
  `badge_type` int(4) DEFAULT NULL,
  `badge_code` text,
  `sku_image` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_log_full`
--

DROP TABLE IF EXISTS `shop_product_log_full`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_log_full` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `product_id` int(11) NOT NULL,
  `contact_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `status` int(1) NOT NULL,
  `params` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_og`
--

DROP TABLE IF EXISTS `shop_product_og`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_og` (
  `product_id` int(11) NOT NULL,
  `property` varchar(255) NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`product_id`,`property`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_pages`
--

DROP TABLE IF EXISTS `shop_product_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT '',
  `url` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `create_datetime` datetime NOT NULL,
  `update_datetime` datetime NOT NULL,
  `create_contact_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `keywords` text,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`,`url`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_params`
--

DROP TABLE IF EXISTS `shop_product_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_params` (
  `product_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`product_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_related`
--

DROP TABLE IF EXISTS `shop_product_related`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_related` (
  `product_id` int(11) NOT NULL,
  `type` enum('cross_selling','upselling') NOT NULL,
  `related_product_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`type`,`related_product_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_reviews`
--

DROP TABLE IF EXISTS `shop_product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `left_key` int(11) DEFAULT NULL,
  `right_key` int(11) DEFAULT NULL,
  `depth` int(11) NOT NULL DEFAULT '0',
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `product_id` int(11) NOT NULL,
  `review_id` int(11) NOT NULL DEFAULT '0',
  `datetime` datetime NOT NULL,
  `status` enum('approved','deleted') NOT NULL DEFAULT 'approved',
  `title` varchar(64) DEFAULT NULL,
  `text` text,
  `rate` decimal(3,2) DEFAULT NULL,
  `contact_id` int(11) unsigned NOT NULL DEFAULT '0',
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `site` varchar(100) DEFAULT NULL,
  `auth_provider` varchar(100) DEFAULT NULL,
  `ip` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_id` (`contact_id`),
  KEY `status` (`status`),
  KEY `parent_id` (`parent_id`),
  KEY `product_id` (`product_id`,`review_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_services`
--

DROP TABLE IF EXISTS `shop_product_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `sku_id` int(11) DEFAULT NULL,
  `service_id` int(11) NOT NULL,
  `service_variant_id` int(11) NOT NULL,
  `price` decimal(15,4) DEFAULT NULL,
  `primary_price` decimal(15,4) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`,`sku_id`,`service_id`,`service_variant_id`),
  KEY `service_id` (`service_id`,`service_variant_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_sku_images`
--

DROP TABLE IF EXISTS `shop_product_sku_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_sku_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `sku_id` int(11) NOT NULL,
  `upload_datetime` datetime NOT NULL,
  `edit_datetime` datetime DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `width` int(5) NOT NULL DEFAULT '0',
  `height` int(5) NOT NULL DEFAULT '0',
  `size` int(11) DEFAULT NULL,
  `ext` varchar(10) DEFAULT NULL,
  `badge_type` int(4) DEFAULT NULL,
  `badge_code` text,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_skus`
--

DROP TABLE IF EXISTS `shop_product_skus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_skus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `id_1c` varchar(36) DEFAULT NULL,
  `sku` varchar(255) NOT NULL,
  `sort` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `image_id` int(11) DEFAULT NULL,
  `price` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `primary_price` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `purchase_price` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `compare_price` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `count` int(11) DEFAULT NULL,
  `available` tinyint(1) NOT NULL DEFAULT '1',
  `dimension_id` int(11) DEFAULT NULL,
  `file_name` varchar(255) NOT NULL DEFAULT '',
  `file_size` int(11) NOT NULL DEFAULT '0',
  `file_description` text,
  `virtual` tinyint(1) NOT NULL DEFAULT '0',
  `warehouse_sku_id` int(11) NOT NULL,
  `sku_image_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `id_1c` (`id_1c`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_stocks`
--

DROP TABLE IF EXISTS `shop_product_stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_stocks` (
  `sku_id` int(11) NOT NULL,
  `stock_id` int(11) NOT NULL DEFAULT '0',
  `product_id` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  PRIMARY KEY (`sku_id`,`stock_id`),
  KEY `product_id` (`product_id`,`sku_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_stocks_log`
--

DROP TABLE IF EXISTS `shop_product_stocks_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_stocks_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `sku_id` int(11) NOT NULL,
  `stock_id` int(11) DEFAULT NULL,
  `stock_name` varchar(255) DEFAULT NULL,
  `before_count` int(11) DEFAULT NULL,
  `after_count` int(11) DEFAULT NULL,
  `diff_count` int(11) DEFAULT NULL,
  `type` varchar(32) NOT NULL,
  `description` text,
  `datetime` datetime NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `transfer_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`,`sku_id`),
  KEY `stock_id` (`stock_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_product_tags`
--

DROP TABLE IF EXISTS `shop_product_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_product_tags` (
  `product_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`tag_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_productbrands`
--

DROP TABLE IF EXISTS `shop_productbrands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_productsets`
--

DROP TABLE IF EXISTS `shop_productsets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_productsets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `discount` decimal(12,2) DEFAULT NULL,
  `currency` varchar(3) DEFAULT NULL,
  `count` int(3) NOT NULL DEFAULT '4',
  `usercreate` int(1) NOT NULL DEFAULT '1',
  `status` int(1) NOT NULL DEFAULT '1',
  `include_product` int(1) NOT NULL DEFAULT '1',
  `custom_color` int(1) NOT NULL DEFAULT '0',
  `locale` varchar(5) NOT NULL DEFAULT '',
  `html_before` text,
  `html_after` text,
  `change_skus` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_productsets_cart`
--

DROP TABLE IF EXISTS `shop_productsets_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_productsets_cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productsets_id` int(11) NOT NULL DEFAULT '0',
  `product_id` int(11) NOT NULL DEFAULT '0',
  `sku_id` int(11) NOT NULL,
  `code` varchar(32) NOT NULL DEFAULT '',
  `quantity` int(10) NOT NULL DEFAULT '1',
  `usercreate` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `code` (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_productsets_cart_items`
--

DROP TABLE IF EXISTS `shop_productsets_cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_productsets_cart_items` (
  `spci_id` int(11) NOT NULL,
  `sku_id` int(11) NOT NULL,
  PRIMARY KEY (`spci_id`,`sku_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_productsets_items`
--

DROP TABLE IF EXISTS `shop_productsets_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_productsets_items` (
  `inc_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` varchar(50) NOT NULL,
  `sku_id` int(11) NOT NULL DEFAULT '0',
  `productsets_id` int(11) NOT NULL,
  `sort_id` int(11) NOT NULL DEFAULT '0',
  `type` enum('product','category','set','all','available','complete','onrequest') NOT NULL,
  PRIMARY KEY (`productsets_id`,`type`,`id`,`sku_id`),
  UNIQUE KEY `inc_id` (`inc_id`),
  KEY `id_type` (`id`,`type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_productsets_locale`
--

DROP TABLE IF EXISTS `shop_productsets_locale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_productsets_locale` (
  `set_id` int(11) NOT NULL,
  `locale` varchar(5) NOT NULL,
  `msg` varchar(255) NOT NULL,
  `msg2` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`set_id`,`locale`,`msg`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_productsets_settings`
--

DROP TABLE IF EXISTS `shop_productsets_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_productsets_settings` (
  `field` varchar(30) NOT NULL,
  `ext` varchar(30) NOT NULL DEFAULT '',
  `value` varchar(255) NOT NULL,
  UNIQUE KEY `field_ext` (`field`,`ext`),
  KEY `field` (`field`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_promo`
--

DROP TABLE IF EXISTS `shop_promo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_promo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(32) NOT NULL DEFAULT 'link',
  `title` text,
  `body` text,
  `link` text,
  `color` varchar(8) DEFAULT NULL,
  `background_color` varchar(8) DEFAULT NULL,
  `ext` varchar(6) NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `countdown_datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_promo_routes`
--

DROP TABLE IF EXISTS `shop_promo_routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_promo_routes` (
  `promo_id` int(10) unsigned NOT NULL,
  `storefront` varchar(255) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`storefront`,`promo_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_push_client`
--

DROP TABLE IF EXISTS `shop_push_client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_push_client` (
  `contact_id` int(11) NOT NULL,
  `client_id` varchar(64) NOT NULL,
  `shop_url` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT '',
  UNIQUE KEY `client` (`client_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_sales`
--

DROP TABLE IF EXISTS `shop_sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_sales` (
  `hash` varchar(32) NOT NULL,
  `date` date NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `order_count` int(11) NOT NULL DEFAULT '0',
  `sales` float NOT NULL DEFAULT '0',
  `shipping` float NOT NULL DEFAULT '0',
  `tax` float NOT NULL DEFAULT '0',
  `purchase` float NOT NULL DEFAULT '0',
  `cost` float NOT NULL DEFAULT '0',
  `new_customer_count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`hash`,`name`,`date`),
  KEY `date` (`date`),
  KEY `hash_date` (`hash`,`date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_search_index`
--

DROP TABLE IF EXISTS `shop_search_index`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_search_index` (
  `word_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `weight` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`word_id`),
  KEY `word` (`word_id`,`product_id`,`weight`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_search_word`
--

DROP TABLE IF EXISTS `shop_search_word`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_search_word` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_seoreference`
--

DROP TABLE IF EXISTS `shop_seoreference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_seoreference` (
  `domain` varchar(255) NOT NULL DEFAULT '',
  `link` varchar(255) NOT NULL DEFAULT '',
  `keywords` text NOT NULL,
  `count` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_seoreference_links`
--

DROP TABLE IF EXISTS `shop_seoreference_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_seoreference_links` (
  `link` varchar(255) NOT NULL DEFAULT '',
  `page` varchar(255) NOT NULL DEFAULT '',
  `keywords` text NOT NULL,
  KEY `page` (`page`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_service`
--

DROP TABLE IF EXISTS `shop_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `price` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `currency` char(3) DEFAULT NULL,
  `variant_id` int(11) NOT NULL,
  `tax_id` int(11) DEFAULT '0',
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_service_variants`
--

DROP TABLE IF EXISTS `shop_service_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_service_variants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `primary_price` decimal(15,4) NOT NULL DEFAULT '0.0000',
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_set`
--

DROP TABLE IF EXISTS `shop_set`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_set` (
  `id` varchar(64) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `rule` varchar(32) DEFAULT NULL,
  `type` int(1) DEFAULT '0',
  `count` int(11) NOT NULL DEFAULT '0',
  `sort` int(11) NOT NULL DEFAULT '0',
  `create_datetime` datetime NOT NULL,
  `edit_datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_set_products`
--

DROP TABLE IF EXISTS `shop_set_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_set_products` (
  `set_id` varchar(64) NOT NULL,
  `product_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`set_id`,`product_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_specialoffer`
--

DROP TABLE IF EXISTS `shop_specialoffer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_specialoffer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `create_datetime` datetime NOT NULL,
  `start_datetime` datetime DEFAULT NULL,
  `end_datetime` datetime DEFAULT NULL,
  `discount` decimal(15,4) DEFAULT NULL,
  `currency` varchar(3) DEFAULT NULL,
  `badge` varchar(255) DEFAULT NULL,
  `params` text,
  PRIMARY KEY (`id`),
  KEY `datetime` (`start_datetime`,`end_datetime`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_specialoffer_items`
--

DROP TABLE IF EXISTS `shop_specialoffer_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_specialoffer_items` (
  `specialoffer_id` int(11) NOT NULL,
  `type` enum('product','category','set','all') NOT NULL,
  `item_id` varchar(64) NOT NULL,
  PRIMARY KEY (`specialoffer_id`,`type`,`item_id`),
  KEY `item` (`type`,`item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_stock`
--

DROP TABLE IF EXISTS `shop_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `low_count` int(11) NOT NULL DEFAULT '0',
  `critical_count` int(11) NOT NULL DEFAULT '0',
  `sort` int(11) NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `public` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_stock_rules`
--

DROP TABLE IF EXISTS `shop_stock_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_stock_rules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sort` int(11) NOT NULL DEFAULT '0',
  `stock_id` int(11) DEFAULT NULL,
  `virtualstock_id` int(11) DEFAULT NULL,
  `rule_type` varchar(255) NOT NULL,
  `rule_data` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_tag`
--

DROP TABLE IF EXISTS `shop_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_tax`
--

DROP TABLE IF EXISTS `shop_tax`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_tax` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `included` int(11) NOT NULL DEFAULT '0',
  `address_type` varchar(8) NOT NULL DEFAULT 'shipping',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_tax_regions`
--

DROP TABLE IF EXISTS `shop_tax_regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_tax_regions` (
  `tax_id` int(11) NOT NULL,
  `country_iso3` varchar(3) NOT NULL,
  `region_code` varchar(8) DEFAULT NULL,
  `tax_value` decimal(7,4) NOT NULL DEFAULT '0.0000',
  `tax_name` varchar(255) DEFAULT NULL,
  `params` text,
  UNIQUE KEY `tax_country_region` (`tax_id`,`country_iso3`,`region_code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_tax_zip_codes`
--

DROP TABLE IF EXISTS `shop_tax_zip_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_tax_zip_codes` (
  `tax_id` int(11) NOT NULL,
  `zip_expr` varchar(16) NOT NULL,
  `tax_value` decimal(7,4) NOT NULL DEFAULT '0.0000',
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`tax_id`,`zip_expr`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_transfer`
--

DROP TABLE IF EXISTS `shop_transfer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_transfer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `string_id` varchar(255) DEFAULT NULL,
  `create_datetime` datetime DEFAULT NULL,
  `finalize_datetime` datetime DEFAULT NULL,
  `status` enum('sent','completed','cancelled') NOT NULL DEFAULT 'sent',
  `stock_id_from` int(11) NOT NULL,
  `stock_id_to` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `string_id` (`string_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_transfer_products`
--

DROP TABLE IF EXISTS `shop_transfer_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_transfer_products` (
  `product_id` int(11) NOT NULL,
  `sku_id` int(11) NOT NULL,
  `transfer_id` int(11) NOT NULL,
  `count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`product_id`,`sku_id`,`transfer_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_type`
--

DROP TABLE IF EXISTS `shop_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sort` int(11) NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `cross_selling` varchar(64) NOT NULL DEFAULT 'alsobought',
  `upselling` tinyint(1) NOT NULL DEFAULT '0',
  `count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_type_features`
--

DROP TABLE IF EXISTS `shop_type_features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_type_features` (
  `type_id` int(11) NOT NULL,
  `feature_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`type_id`,`feature_id`),
  KEY `feature_id` (`feature_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_type_services`
--

DROP TABLE IF EXISTS `shop_type_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_type_services` (
  `type_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  PRIMARY KEY (`type_id`,`service_id`),
  KEY `service_id` (`service_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_type_upselling`
--

DROP TABLE IF EXISTS `shop_type_upselling`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_type_upselling` (
  `type_id` int(11) NOT NULL,
  `feature` varchar(32) NOT NULL,
  `feature_id` int(11) DEFAULT NULL,
  `cond` varchar(16) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`type_id`,`feature`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_virtualstock`
--

DROP TABLE IF EXISTS `shop_virtualstock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_virtualstock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `low_count` int(11) NOT NULL DEFAULT '0',
  `critical_count` int(11) NOT NULL DEFAULT '0',
  `sort` int(11) NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `public` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_virtualstock_stocks`
--

DROP TABLE IF EXISTS `shop_virtualstock_stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_virtualstock_stocks` (
  `virtualstock_id` int(11) NOT NULL,
  `stock_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_wholesale`
--

DROP TABLE IF EXISTS `shop_wholesale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_wholesale` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `sku_id` int(11) NOT NULL,
  `min_sku_count` int(11) NOT NULL,
  `multiplicity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `sku_id` (`sku_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `site_block`
--

DROP TABLE IF EXISTS `site_block`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_block` (
  `id` varchar(64) NOT NULL,
  `content` text NOT NULL,
  `create_datetime` datetime NOT NULL,
  `description` text NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `site_domain`
--

DROP TABLE IF EXISTS `site_domain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_domain` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `title` varchar(128) NOT NULL DEFAULT '',
  `style` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `site_page`
--

DROP TABLE IF EXISTS `site_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain_id` int(11) NOT NULL,
  `route` varchar(64) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT '',
  `url` varchar(255) DEFAULT NULL,
  `full_url` varchar(255) DEFAULT NULL,
  `content` longtext NOT NULL,
  `create_datetime` datetime NOT NULL,
  `update_datetime` datetime NOT NULL,
  `create_contact_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `url` (`domain_id`,`route`,`full_url`),
  KEY `parent_id` (`parent_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `site_page_params`
--

DROP TABLE IF EXISTS `site_page_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_page_params` (
  `page_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`page_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `smartb_banner`
--

DROP TABLE IF EXISTS `smartb_banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smartb_banner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `width` int(11) NOT NULL DEFAULT '0',
  `height` int(11) NOT NULL DEFAULT '0',
  `scale` int(11) NOT NULL DEFAULT '0',
  `responsive` int(11) NOT NULL,
  `create_datetime` datetime NOT NULL,
  `params` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `smartb_banners`
--

DROP TABLE IF EXISTS `smartb_banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smartb_banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `width` int(11) NOT NULL DEFAULT '0',
  `height` int(11) NOT NULL DEFAULT '0',
  `click` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `smartb_click`
--

DROP TABLE IF EXISTS `smartb_click`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smartb_click` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_id` int(11) NOT NULL DEFAULT '0',
  `ip` varchar(255) NOT NULL DEFAULT '',
  `user_agent` varchar(255) NOT NULL DEFAULT '',
  `create_datetime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `smartb_image`
--

DROP TABLE IF EXISTS `smartb_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smartb_image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `banner_id` int(11) NOT NULL DEFAULT '0',
  `upload_datetime` datetime NOT NULL,
  `original_filename` varchar(255) NOT NULL DEFAULT '',
  `ext` varchar(10) NOT NULL DEFAULT '',
  `url` varchar(255) NOT NULL DEFAULT '',
  `alt` varchar(1000) NOT NULL DEFAULT '',
  `disabled` int(11) NOT NULL DEFAULT '0',
  `sort` int(11) NOT NULL DEFAULT '0',
  `custom_html` varchar(10000) NOT NULL,
  `custom_html_position` varchar(255) NOT NULL,
  `scheduled` tinyint(1) NOT NULL DEFAULT '0',
  `schedule_datetime_start` date NOT NULL,
  `schedule_datetime_end` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `smartb_items`
--

DROP TABLE IF EXISTS `smartb_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smartb_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `banner_id` int(11) NOT NULL,
  `on` int(1) NOT NULL DEFAULT '1',
  `url` varchar(255) NOT NULL DEFAULT '',
  `link` varchar(255) NOT NULL DEFAULT '',
  `alt` varchar(255) NOT NULL DEFAULT '',
  `title` varchar(255) NOT NULL DEFAULT '',
  `new_window` int(1) NOT NULL DEFAULT '0',
  `click` int(11) NOT NULL DEFAULT '0',
  `nofollow` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `smartb_view`
--

DROP TABLE IF EXISTS `smartb_view`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smartb_view` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `banner_id` int(11) NOT NULL DEFAULT '0',
  `ip` varchar(255) NOT NULL DEFAULT '',
  `user_agent` varchar(255) NOT NULL DEFAULT '',
  `create_datetime` datetime NOT NULL,
  `url` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stickies_sheet`
--

DROP TABLE IF EXISTS `stickies_sheet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stickies_sheet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `sort` int(11) NOT NULL,
  `background_id` varchar(10) DEFAULT '',
  `create_datetime` datetime NOT NULL,
  `creator_contact_id` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stickies_sticky`
--

DROP TABLE IF EXISTS `stickies_sticky`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stickies_sticky` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sheet_id` int(11) NOT NULL,
  `content` text,
  `creator_contact_id` int(11) DEFAULT NULL,
  `create_datetime` datetime NOT NULL,
  `update_datetime` datetime NOT NULL,
  `size_width` int(11) NOT NULL DEFAULT '0',
  `size_height` int(11) NOT NULL DEFAULT '0',
  `position_top` int(11) NOT NULL DEFAULT '0',
  `position_left` int(11) NOT NULL DEFAULT '0',
  `color` varchar(16) NOT NULL DEFAULT '',
  `font_size` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `sheet_id` (`sheet_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_announcement`
--

DROP TABLE IF EXISTS `wa_announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_announcement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_id` varchar(32) NOT NULL,
  `text` text NOT NULL,
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `app_datetime` (`datetime`,`app_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_api_auth_codes`
--

DROP TABLE IF EXISTS `wa_api_auth_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_api_auth_codes` (
  `code` varchar(32) NOT NULL,
  `contact_id` int(11) NOT NULL,
  `client_id` varchar(32) NOT NULL,
  `scope` text NOT NULL,
  `expires` datetime NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_api_tokens`
--

DROP TABLE IF EXISTS `wa_api_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_api_tokens` (
  `contact_id` int(11) NOT NULL,
  `client_id` varchar(32) NOT NULL,
  `token` varchar(32) NOT NULL,
  `scope` text NOT NULL,
  `create_datetime` datetime NOT NULL,
  `expires` datetime DEFAULT NULL,
  PRIMARY KEY (`token`),
  UNIQUE KEY `contact_client` (`contact_id`,`client_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_app_settings`
--

DROP TABLE IF EXISTS `wa_app_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_app_settings` (
  `app_id` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`app_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_contact`
--

DROP TABLE IF EXISTS `wa_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `firstname` varchar(50) NOT NULL DEFAULT '',
  `middlename` varchar(50) NOT NULL DEFAULT '',
  `lastname` varchar(50) NOT NULL DEFAULT '',
  `title` varchar(50) NOT NULL DEFAULT '',
  `company` varchar(150) NOT NULL DEFAULT '',
  `jobtitle` varchar(50) NOT NULL DEFAULT '',
  `company_contact_id` int(11) NOT NULL DEFAULT '0',
  `is_company` tinyint(1) NOT NULL DEFAULT '0',
  `is_user` tinyint(1) NOT NULL DEFAULT '0',
  `login` varchar(32) DEFAULT NULL,
  `password` varchar(128) NOT NULL DEFAULT '',
  `last_datetime` datetime DEFAULT NULL,
  `sex` enum('m','f') DEFAULT NULL,
  `about` text,
  `photo` int(10) NOT NULL DEFAULT '0',
  `create_datetime` datetime NOT NULL,
  `create_app_id` varchar(32) NOT NULL DEFAULT '',
  `create_method` varchar(32) NOT NULL DEFAULT '',
  `create_contact_id` int(11) NOT NULL DEFAULT '0',
  `locale` varchar(8) NOT NULL DEFAULT '',
  `timezone` varchar(64) NOT NULL DEFAULT '',
  `birth_day` tinyint(2) unsigned DEFAULT NULL,
  `birth_month` tinyint(2) unsigned DEFAULT NULL,
  `birth_year` smallint(4) DEFAULT NULL,
  `birthday` int(22) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`),
  KEY `name` (`name`),
  KEY `id_name` (`id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_contact_categories`
--

DROP TABLE IF EXISTS `wa_contact_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_contact_categories` (
  `category_id` int(11) NOT NULL,
  `contact_id` int(11) NOT NULL,
  PRIMARY KEY (`category_id`,`contact_id`),
  KEY `contact_id` (`contact_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_contact_category`
--

DROP TABLE IF EXISTS `wa_contact_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_contact_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `system_id` varchar(64) DEFAULT NULL,
  `app_id` varchar(32) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `cnt` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `system_id` (`system_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_contact_data`
--

DROP TABLE IF EXISTS `wa_contact_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_contact_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_id` int(11) NOT NULL,
  `field` varchar(32) NOT NULL,
  `ext` varchar(32) NOT NULL DEFAULT '',
  `value` varchar(255) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `contact_field_sort` (`contact_id`,`field`,`sort`),
  KEY `contact_id` (`contact_id`),
  KEY `value` (`value`),
  KEY `field` (`field`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_contact_data_text`
--

DROP TABLE IF EXISTS `wa_contact_data_text`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_contact_data_text` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_id` int(11) NOT NULL,
  `field` varchar(32) NOT NULL,
  `ext` varchar(32) NOT NULL DEFAULT '',
  `value` text NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `contact_field_sort` (`contact_id`,`field`,`sort`),
  KEY `contact_id` (`contact_id`),
  KEY `field` (`field`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_contact_emails`
--

DROP TABLE IF EXISTS `wa_contact_emails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_contact_emails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `ext` varchar(32) NOT NULL DEFAULT '',
  `sort` int(11) NOT NULL DEFAULT '0',
  `status` enum('unknown','confirmed','unconfirmed','unavailable') NOT NULL DEFAULT 'unknown',
  PRIMARY KEY (`id`),
  UNIQUE KEY `contact_sort` (`contact_id`,`sort`),
  KEY `email` (`email`),
  KEY `status` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_contact_field_values`
--

DROP TABLE IF EXISTS `wa_contact_field_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_contact_field_values` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_field` varchar(64) NOT NULL,
  `parent_value` varchar(255) NOT NULL,
  `field` varchar(64) NOT NULL,
  `value` varchar(255) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `parent_field` (`parent_field`,`parent_value`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_contact_rights`
--

DROP TABLE IF EXISTS `wa_contact_rights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_contact_rights` (
  `group_id` int(11) NOT NULL,
  `app_id` varchar(32) NOT NULL,
  `name` varchar(64) NOT NULL,
  `value` int(11) NOT NULL,
  PRIMARY KEY (`group_id`,`app_id`,`name`),
  KEY `name_value` (`name`,`value`,`group_id`,`app_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_contact_settings`
--

DROP TABLE IF EXISTS `wa_contact_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_contact_settings` (
  `contact_id` int(11) NOT NULL,
  `app_id` varchar(32) NOT NULL DEFAULT '',
  `name` varchar(32) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`contact_id`,`app_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_country`
--

DROP TABLE IF EXISTS `wa_country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_country` (
  `name` varchar(255) NOT NULL,
  `iso3letter` varchar(3) NOT NULL,
  `iso2letter` varchar(2) NOT NULL,
  `isonumeric` varchar(3) NOT NULL,
  `fav_sort` int(11) DEFAULT NULL,
  PRIMARY KEY (`iso3letter`),
  UNIQUE KEY `isonumeric` (`isonumeric`),
  UNIQUE KEY `iso2letter` (`iso2letter`),
  KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_dashboard`
--

DROP TABLE IF EXISTS `wa_dashboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_dashboard` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `hash` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hash` (`hash`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_group`
--

DROP TABLE IF EXISTS `wa_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `cnt` int(11) NOT NULL DEFAULT '0',
  `icon` varchar(255) DEFAULT NULL,
  `sort` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_log`
--

DROP TABLE IF EXISTS `wa_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app_id` varchar(32) NOT NULL,
  `contact_id` int(11) NOT NULL,
  `datetime` datetime NOT NULL,
  `action` varchar(255) NOT NULL,
  `subject_contact_id` int(11) DEFAULT NULL,
  `params` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_login_log`
--

DROP TABLE IF EXISTS `wa_login_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_login_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_id` int(11) NOT NULL,
  `datetime_in` datetime NOT NULL,
  `datetime_out` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_metro`
--

DROP TABLE IF EXISTS `wa_metro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_metro` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `line_id` int(6) NOT NULL DEFAULT '0',
  `color` varchar(6) NOT NULL,
  `sort` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_redirect`
--

DROP TABLE IF EXISTS `wa_redirect`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_redirect` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` varchar(100) NOT NULL,
  `url` varchar(1000) NOT NULL,
  `redirect` varchar(1000) NOT NULL,
  `add_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `visible` int(11) NOT NULL DEFAULT '1',
  `is_bad` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `url` (`url`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_region`
--

DROP TABLE IF EXISTS `wa_region`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_region` (
  `country_iso3` varchar(3) NOT NULL,
  `code` varchar(8) NOT NULL,
  `name` varchar(255) NOT NULL,
  `fav_sort` int(11) DEFAULT NULL,
  `delivery` varchar(100) NOT NULL,
  PRIMARY KEY (`country_iso3`,`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_transaction`
--

DROP TABLE IF EXISTS `wa_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plugin` varchar(50) NOT NULL,
  `app_id` varchar(50) NOT NULL,
  `merchant_id` varchar(50) DEFAULT NULL,
  `native_id` varchar(255) NOT NULL,
  `create_datetime` datetime NOT NULL,
  `update_datetime` datetime NOT NULL,
  `type` varchar(20) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `order_id` varchar(50) DEFAULT NULL,
  `customer_id` varchar(50) DEFAULT NULL,
  `result` varchar(20) NOT NULL,
  `error` varchar(255) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL,
  `view_data` text,
  `amount` float DEFAULT NULL,
  `currency_id` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugin` (`plugin`),
  KEY `app_id` (`app_id`),
  KEY `merchant_id` (`merchant_id`),
  KEY `transaction_native_id` (`native_id`),
  KEY `parent_id` (`parent_id`),
  KEY `order_id` (`order_id`),
  KEY `customer_id` (`customer_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_transaction_data`
--

DROP TABLE IF EXISTS `wa_transaction_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_transaction_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transaction_id` int(11) NOT NULL,
  `field_id` varchar(50) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transaction_id` (`transaction_id`),
  KEY `field_id` (`field_id`),
  KEY `value` (`value`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_user_groups`
--

DROP TABLE IF EXISTS `wa_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_user_groups` (
  `contact_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`contact_id`,`group_id`),
  KEY `group_id` (`group_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_widget`
--

DROP TABLE IF EXISTS `wa_widget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_widget` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `widget` varchar(32) NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact_id` int(11) NOT NULL,
  `dashboard_id` int(11) DEFAULT NULL,
  `create_datetime` datetime NOT NULL,
  `app_id` varchar(32) NOT NULL,
  `block` int(11) NOT NULL,
  `sort` int(11) NOT NULL,
  `size` char(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wa_widget_params`
--

DROP TABLE IF EXISTS `wa_widget_params`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wa_widget_params` (
  `widget_id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`widget_id`,`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse_categories`
--

DROP TABLE IF EXISTS `warehouse_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `parent` int(11) NOT NULL,
  `sort` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse_consignment`
--

DROP TABLE IF EXISTS `warehouse_consignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse_consignment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `create_datetime` datetime NOT NULL,
  `finish_datetime` datetime NOT NULL,
  `status` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `is_return` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse_consignment_sku`
--

DROP TABLE IF EXISTS `warehouse_consignment_sku`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse_consignment_sku` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wh_sku_id` int(11) NOT NULL,
  `add_date` datetime NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `count` int(11) NOT NULL,
  `consignment_id` int(11) NOT NULL,
  `sold` int(11) NOT NULL,
  `order_id` varchar(255) DEFAULT NULL,
  `defect` tinyint(1) NOT NULL DEFAULT '0',
  `comment` varchar(1024) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wh_sku_id` (`wh_sku_id`,`consignment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse_inventory`
--

DROP TABLE IF EXISTS `warehouse_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse_inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `create_datetime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `finish_datetime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse_inventory_skus`
--

DROP TABLE IF EXISTS `warehouse_inventory_skus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse_inventory_skus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `inventory_id` int(11) NOT NULL,
  `wh_sku_id` int(11) NOT NULL,
  `create_date` datetime NOT NULL,
  `amount` int(11) NOT NULL,
  `realamount` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `inventory_id` (`inventory_id`,`wh_sku_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse_moves`
--

DROP TABLE IF EXISTS `warehouse_moves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse_moves` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wh_sku_id` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  `add_date` datetime NOT NULL,
  `type` varchar(255) NOT NULL,
  `order_id` int(11) NOT NULL,
  `consignment_id` int(11) NOT NULL,
  `comment` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse_needed`
--

DROP TABLE IF EXISTS `warehouse_needed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse_needed` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `img` varchar(1024) DEFAULT NULL,
  `count` int(11) DEFAULT '0',
  `url` varchar(1024) DEFAULT NULL,
  `comment` varchar(2056) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse_product_skus`
--

DROP TABLE IF EXISTS `warehouse_product_skus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse_product_skus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wh_product_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(20) NOT NULL,
  `barcode` varchar(20) NOT NULL,
  `barcode_addl` varchar(20) NOT NULL,
  `image` varchar(255) NOT NULL,
  `buy_price` int(11) NOT NULL,
  `real_amount` int(11) NOT NULL,
  `available_amount` int(11) NOT NULL,
  `virtual` int(1) NOT NULL,
  `weight` int(11) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `pos_1` varchar(255) NOT NULL,
  `pos_2` varchar(255) NOT NULL,
  `pos_3` varchar(255) NOT NULL,
  `pos_4` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse_products`
--

DROP TABLE IF EXISTS `warehouse_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `wh_category_id` int(11) NOT NULL,
  `sort` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse_purchase`
--

DROP TABLE IF EXISTS `warehouse_purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse_purchase` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoice_date` date NOT NULL,
  `shop` varchar(255) CHARACTER SET utf8 NOT NULL,
  `sku_id` int(11) NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `type` varchar(255) CHARACTER SET utf8 NOT NULL,
  `url` varchar(255) CHARACTER SET utf8 NOT NULL,
  `img` varchar(255) CHARACTER SET utf8 NOT NULL,
  `count` int(11) NOT NULL DEFAULT '1',
  `comment` varchar(1024) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `disable` tinyint(1) NOT NULL DEFAULT '0',
  `user` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse_purchase_provider_price`
--

DROP TABLE IF EXISTS `warehouse_purchase_provider_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse_purchase_provider_price` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `bought_count` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse_purchase_provider_product`
--

DROP TABLE IF EXISTS `warehouse_purchase_provider_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse_purchase_provider_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `count` int(11) NOT NULL DEFAULT '1',
  `bought_count` int(11) NOT NULL DEFAULT '0',
  `available` tinyint(1) NOT NULL DEFAULT '1',
  `disable` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-02-01 10:06:30
