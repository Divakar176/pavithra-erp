-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: pavithra_erp_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action_name` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `details` varchar(500) DEFAULT NULL,
  `entity_id` bigint DEFAULT NULL,
  `entity_name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'Deleted Vehicle','2026-07-20 07:31:25.604254','Deleted vehicle: TN 22 AB 1234',1,'Vehicle','divakar'),(2,'Deleted Vehicle','2026-07-20 07:31:36.783410','Deleted vehicle: TN 19 BR 5776',2,'Vehicle','divakar'),(3,'Deleted Vehicle','2026-07-20 07:31:57.052265','Deleted vehicle: TN 22 CD 5678',3,'Vehicle','divakar'),(4,'Deleted Vehicle','2026-07-20 07:32:14.397725','Deleted vehicle: TN 19 GH 9012',4,'Vehicle','divakar'),(5,'Deleted Vehicle','2026-07-20 07:32:30.363323','Deleted vehicle: TN 05 EF 8888',10,'Vehicle','divakar'),(6,'Deleted Vehicle','2026-07-20 07:32:45.842464','Deleted vehicle: TN 22 EF 3456',5,'Vehicle','divakar'),(7,'Deleted Vehicle','2026-07-20 07:32:55.638582','Deleted vehicle: TN 01 AB 9999',6,'Vehicle','divakar'),(8,'Deleted Vehicle','2026-07-20 07:33:03.747322','Deleted vehicle: TN 02 XY 1234',7,'Vehicle','divakar'),(9,'Deleted Vehicle','2026-07-20 07:33:14.056179','Deleted vehicle: TN 03 ZA 5555',8,'Vehicle','divakar'),(10,'Deleted Vehicle','2026-07-20 07:33:26.861986','Deleted vehicle: TN 04 CD 7777',9,'Vehicle','divakar');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_payments`
--

DROP TABLE IF EXISTS `customer_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_mode` varchar(255) DEFAULT NULL,
  `reference_notes` varchar(255) DEFAULT NULL,
  `customer_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKxc521vx929xnd26fu3dr6scf` (`customer_id`),
  CONSTRAINT `FKxc521vx929xnd26fu3dr6scf` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_payments`
--

LOCK TABLES `customer_payments` WRITE;
/*!40000 ALTER TABLE `customer_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `contract_details` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gst_number` varchar(255) DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `outstanding_balance` double NOT NULL DEFAULT '0',
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKcuu4e61wdwoopdgsh61owqq2f` (`mobile`),
  UNIQUE KEY `UKeh0370jmnamqanxbnk1idd88q` (`gst_number`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,NULL,NULL,'2026-06-30 13:10:45.222075',NULL,'33AAAAA0001A1Z1',_binary '\0','9999999901','Sri Ram Constructions',0,'2026-07-03 06:46:00.958939'),(2,NULL,NULL,'2026-06-30 13:10:45.228646',NULL,'33BBBBB0002B1Z2',_binary '\0','9999999902','Madurai Blue Metals',0,'2026-07-03 06:45:52.290170'),(3,NULL,NULL,'2026-06-30 13:10:45.234107',NULL,'33CCCCC0003C1Z3',_binary '\0','9999999903','Chennai Builders',0,'2026-07-03 06:45:44.616464'),(4,NULL,NULL,'2026-06-30 13:10:45.239421',NULL,'33DDDDD0004D1Z4',_binary '\0','9999999904','Salem Sands Ltd',0,'2026-07-03 06:45:36.539008'),(5,NULL,NULL,'2026-06-30 13:10:45.243426',NULL,'33EEEEE0005E1Z5',_binary '\0','9999999905','Coimbatore Cement Traders',0,'2026-07-03 06:45:26.430363'),(6,NULL,NULL,'2026-07-09 10:06:25.459177',NULL,'TEMP-ae202716',_binary '\0','TEMP-ae202716','fc work',0,'2026-07-09 10:06:25.459177'),(7,NULL,NULL,'2026-07-09 10:08:57.133672',NULL,'TEMP-ea1da76e',_binary '\0','TEMP-ea1da76e','fc work',0,'2026-07-09 10:08:57.133672'),(8,NULL,NULL,'2026-07-09 10:22:15.607099',NULL,'TEMP-e492de74',_binary '\0','TEMP-e492de74','testing customer ',0,'2026-07-09 10:22:15.607099');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driver_attendance`
--

DROP TABLE IF EXISTS `driver_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver_attendance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `date` date NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `driver_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5j2vsde0ikw2up0ctctq4xt2g` (`driver_id`),
  CONSTRAINT `FK5j2vsde0ikw2up0ctctq4xt2g` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver_attendance`
--

LOCK TABLES `driver_attendance` WRITE;
/*!40000 ALTER TABLE `driver_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `driver_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `bill_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `date` date NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `expense_type` varchar(255) NOT NULL,
  `paid_to` varchar(255) DEFAULT NULL,
  `payment_mode` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `driver_id` bigint DEFAULT NULL,
  `trip_id` bigint DEFAULT NULL,
  `vehicle_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgt0cbtxpyfy729in70hq4ekgs` (`driver_id`),
  KEY `FK9twvm79qw1voae3xgtn1xq5y9` (`trip_id`),
  KEY `FK5n5te603nt2t2hgs719qxhgqk` (`vehicle_id`),
  CONSTRAINT `FK5n5te603nt2t2hgs719qxhgqk` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`),
  CONSTRAINT `FK9twvm79qw1voae3xgtn1xq5y9` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`),
  CONSTRAINT `FKgt0cbtxpyfy729in70hq4ekgs` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fuel_logs`
--

DROP TABLE IF EXISTS `fuel_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fuel_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `bill_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `date` date NOT NULL,
  `fuel_station` varchar(255) DEFAULT NULL,
  `quantity` double NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `vehicle_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6jm7brsffeyb4mc2w2pmkn29p` (`vehicle_id`),
  CONSTRAINT `FK6jm7brsffeyb4mc2w2pmkn29p` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fuel_logs`
--

LOCK TABLES `fuel_logs` WRITE;
/*!40000 ALTER TABLE `fuel_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `fuel_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incomes`
--

DROP TABLE IF EXISTS `incomes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incomes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `date` date NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `income_type` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `trip_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqcp7woie7g1vswat7usr52x9o` (`trip_id`),
  CONSTRAINT `FKqcp7woie7g1vswat7usr52x9o` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incomes`
--

LOCK TABLES `incomes` WRITE;
/*!40000 ALTER TABLE `incomes` DISABLE KEYS */;
/*!40000 ALTER TABLE `incomes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_items`
--

DROP TABLE IF EXISTS `inventory_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `reorder_level` int NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `stock_quantity` int NOT NULL,
  `unit_price` double DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_items`
--

LOCK TABLES `inventory_items` WRITE;
/*!40000 ALTER TABLE `inventory_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance_logs`
--

DROP TABLE IF EXISTS `maintenance_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bill_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `date` date NOT NULL,
  `labour_cost` double DEFAULT NULL,
  `service_type` varchar(255) NOT NULL,
  `spare_parts_cost` double DEFAULT NULL,
  `total_cost` double NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `vendor_details` varchar(255) DEFAULT NULL,
  `vehicle_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4sljgq22c15wl545svbfehqt9` (`vehicle_id`),
  CONSTRAINT `FK4sljgq22c15wl545svbfehqt9` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_logs`
--

LOCK TABLES `maintenance_logs` WRITE;
/*!40000 ALTER TABLE `maintenance_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenance_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `message` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trips`
--

DROP TABLE IF EXISTS `trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trips` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `advance_paid` double DEFAULT NULL,
  `break_hours` double DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `current_latitude` double DEFAULT NULL,
  `current_longitude` double DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `diesel_cost` double DEFAULT NULL,
  `distance_km` double DEFAULT NULL,
  `driver_salary` double DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `end_meter` double DEFAULT NULL,
  `end_time` varchar(255) DEFAULT NULL,
  `food_amount` double DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  `last_location_update` datetime(6) DEFAULT NULL,
  `load_weight` double DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  `material_purchase_cost` double DEFAULT NULL,
  `payment_status` varchar(20) NOT NULL,
  `source` varchar(255) NOT NULL,
  `start_date` date DEFAULT NULL,
  `start_meter` double DEFAULT NULL,
  `start_time` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `total_hours` double DEFAULT NULL,
  `trip_charges` double NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `customer_id` bigint NOT NULL,
  `driver_id` bigint NOT NULL,
  `vehicle_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKnghaxh3sjtlbwd9a1oag294q0` (`customer_id`),
  KEY `FKc4bs1fyinb8aw9pc740991lv7` (`driver_id`),
  KEY `FKqahsaodjirbk4if91c9bfnlgg` (`vehicle_id`),
  CONSTRAINT `FKc4bs1fyinb8aw9pc740991lv7` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKnghaxh3sjtlbwd9a1oag294q0` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FKqahsaodjirbk4if91c9bfnlgg` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
INSERT INTO `trips` VALUES (1,5000,NULL,'2026-06-30 13:10:45.249716',NULL,NULL,'Hyderabad',NULL,355,2851,'2026-06-08',NULL,NULL,NULL,_binary '\0',NULL,11,'Cement',NULL,'UNPAID','Salem','2026-06-07',NULL,NULL,'COMPLETED',NULL,31615,'2026-06-30 13:10:45.249716',5,4,3),(2,5000,NULL,'2026-06-30 13:10:45.279236',NULL,NULL,'Cochin',NULL,411,2455,'2026-06-05',NULL,NULL,NULL,_binary '\0',NULL,26,'Cement',NULL,'UNPAID','Trichy','2026-06-04',NULL,NULL,'COMPLETED',NULL,21310,'2026-06-30 13:10:45.279236',3,3,1),(3,5000,NULL,'2026-06-30 13:10:45.305402',NULL,NULL,'Cochin',NULL,658,2244,'2026-06-04',NULL,NULL,NULL,_binary '\0',NULL,18,'Steel',NULL,'UNPAID','Coimbatore','2026-06-01',NULL,NULL,'COMPLETED',NULL,33762,'2026-06-30 13:10:45.305402',1,4,8),(4,5000,NULL,'2026-06-30 13:10:45.323507',NULL,NULL,'Pondicherry',NULL,319,2004,'2026-06-26',NULL,NULL,NULL,_binary '\0',NULL,10,'Steel',NULL,'UNPAID','Coimbatore','2026-06-24',NULL,NULL,'COMPLETED',NULL,22266,'2026-06-30 13:10:45.323507',1,3,7),(5,5000,NULL,'2026-06-30 13:10:45.343309',NULL,NULL,'Pondicherry',NULL,467,2933,'2026-06-27',NULL,NULL,NULL,_binary '\0',NULL,15,'Cement',NULL,'UNPAID','Chennai','2026-06-26',NULL,NULL,'COMPLETED',NULL,20158,'2026-06-30 13:10:45.343309',3,4,10),(6,5000,NULL,'2026-06-30 13:10:45.362592',NULL,NULL,'Trivandrum',NULL,781,2962,'2026-06-22',NULL,NULL,NULL,_binary '\0',NULL,26,'Sand',NULL,'UNPAID','Salem','2026-06-19',NULL,NULL,'COMPLETED',NULL,27429,'2026-06-30 13:10:45.362592',5,3,1),(7,5000,NULL,'2026-06-30 13:10:45.380998',NULL,NULL,'Hyderabad',NULL,532,2464,'2026-06-25',NULL,NULL,NULL,_binary '\0',NULL,27,'Cement',NULL,'UNPAID','Trichy','2026-06-23',NULL,NULL,'COMPLETED',NULL,29930,'2026-06-30 13:10:45.380998',5,4,3),(8,5000,NULL,'2026-06-30 13:10:45.394284',12.036600000000014,79.90329999999992,'Pondicherry',NULL,587,2384,NULL,NULL,NULL,NULL,_binary '\0','2026-07-09 14:09:31.196118',28,'Steel',NULL,'PAID','Madurai','2026-06-25',NULL,NULL,'IN_PROGRESS',NULL,17420,'2026-07-09 14:09:31.200330',3,3,2),(9,5000,NULL,'2026-06-30 13:10:45.407947',NULL,NULL,'Bangalore',NULL,779,2096,NULL,NULL,NULL,NULL,_binary '\0',NULL,13,'Cement',NULL,'UNPAID','Chennai','2026-06-12',NULL,NULL,'IN_PROGRESS',NULL,20247,'2026-07-09 07:17:47.229432',2,4,5),(10,5000,NULL,'2026-06-30 13:10:45.420243',NULL,NULL,'Trivandrum',NULL,317,2926,NULL,NULL,NULL,NULL,_binary '\0',NULL,18,'Cement',NULL,'UNPAID','Salem','2026-06-21',NULL,NULL,'IN_PROGRESS',NULL,15605,'2026-07-09 07:17:34.614440',3,3,6),(11,NULL,NULL,'2026-07-09 10:54:18.163089',NULL,NULL,'madhuranthagam',10000,NULL,1200,NULL,NULL,NULL,250,_binary '\0',NULL,17,'-',0,'UNPAID','pondicherry ','2026-07-09',NULL,NULL,'IN_PROGRESS',NULL,0,'2026-07-09 10:54:18.163089',8,9,11);
/*!40000 ALTER TABLE `trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ACCOUNTANT','ADMIN','CUSTOMER','DRIVER','SUPER_ADMIN') NOT NULL,
  `security_pin` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK63cf888pmqtt5tipcne79xsbm` (`mobile`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'2026-06-30 13:10:44.794392','ecrelumlai@gmail.com','8056673379','$2a$10$NwUbRbHTg1YRrcCVNRKZau8u5yYuPvW/.2CD.HyqGJLWHSBhVdOCS','ADMIN','1234','2026-06-30 13:10:44.794392','Elumalai'),(3,'2026-06-30 13:10:44.867452','kumar@pavithraerp.com','9876543210','$2a$10$sO2hYT6jPGSThs2WvLuFr.ddCduEh59smt.SiKtsw6TB1Mru6rLbO','DRIVER','1234','2026-06-30 13:33:42.653737','kumar'),(4,'2026-06-30 13:10:44.942666','selvam@pavithraerp.com','9876543211','$2a$10$GP6WzEbgAnb0ON9BZUrW9.OUEkujBnA1KQV/7zQq3X/HwSkNPifCi','DRIVER','1234','2026-06-30 13:33:42.655684','selvam'),(6,'2026-06-30 13:10:45.091399','owner2@pavithraerp.com','2222222222','$2a$10$/TKBVJlRc8.anene7g7o6uELXhaN7YR8l4aDIyAPDtxpS6bC/PljO','SUPER_ADMIN','2222','2026-06-30 13:10:45.091399','owner2'),(7,'2026-06-30 13:10:45.172419','owner3@pavithraerp.com','3333333333','$2a$10$.ED4c6ca3UByK18Xodu.X.LZckl6JwG9.JMV6z6vaaz9mXi82Qxn6','SUPER_ADMIN','3333','2026-06-30 13:10:45.172419','owner3'),(9,'2026-07-09 10:08:57.147398','temp-0aa8e58b@example.com','TEMP-0aa8e58b','driver123','DRIVER','1234','2026-07-09 10:48:27.468310','Ranjith Driver'),(10,'2026-07-20 06:34:56.011321','divakar@pavithraerp.com','0000000001','$2a$10$kYxXfjVDnAea3zZO2qmVG.tf5.ZBlz1WCeH84WMlNiuEfFmoL5n0i','SUPER_ADMIN','1234','2026-07-20 07:07:16.424572','divakar'),(11,'2026-07-20 06:34:56.105690','owner1@pavithraerp.com','1111111111','$2a$10$K04RiV9auxpYfS0O5xnhguetn6LJZidEckTLdVRY4FOUillJXyhPO','SUPER_ADMIN','1111','2026-07-20 06:34:56.105690','Ranjith');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_documents`
--

DROP TABLE IF EXISTS `vehicle_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file_path` varchar(500) NOT NULL,
  `file_size` bigint NOT NULL,
  `name` varchar(100) NOT NULL,
  `original_filename` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `uploaded_at` datetime(6) NOT NULL,
  `vehicle_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKccbx0lpva6nrqamv301oivid1` (`vehicle_id`),
  CONSTRAINT `FKccbx0lpva6nrqamv301oivid1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_documents`
--

LOCK TABLES `vehicle_documents` WRITE;
/*!40000 ALTER TABLE `vehicle_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_loans`
--

DROP TABLE IF EXISTS `vehicle_loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_loans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bank_name` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `emi_amount` double NOT NULL,
  `emi_date` int NOT NULL,
  `interest_rate` double DEFAULT NULL,
  `loan_amount` double NOT NULL,
  `start_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `tenure_months` int NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `vehicle_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1hdc25nsokfig77jchd39131g` (`vehicle_id`),
  CONSTRAINT `FK1hdc25nsokfig77jchd39131g` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_loans`
--

LOCK TABLES `vehicle_loans` WRITE;
/*!40000 ALTER TABLE `vehicle_loans` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle_loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `billing_type` varchar(255) DEFAULT NULL,
  `container_size` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `fc_expiry` date DEFAULT NULL,
  `insurance_expiry` date DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  `max_load_tons` int DEFAULT NULL,
  `monthly_contract_amount` double DEFAULT NULL,
  `permit_expiry` date DEFAULT NULL,
  `pollution_expiry` date DEFAULT NULL,
  `purchase_price` double DEFAULT NULL,
  `rc_details` varchar(255) DEFAULT NULL,
  `state_permit_expiry` date DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `tax_expiry` date DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `vehicle_number` varchar(255) NOT NULL,
  `assigned_driver_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpy3agdr9g5molxe2mj30p9i8i` (`vehicle_number`),
  KEY `FKsq8pc4w2f4wqb7hhub7ufdhbf` (`assigned_driver_id`),
  CONSTRAINT `FKsq8pc4w2f4wqb7hhub7ufdhbf` FOREIGN KEY (`assigned_driver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (1,NULL,NULL,'2026-06-30 13:10:45.177134','2027-06-30','2026-07-04',_binary '',NULL,NULL,'2026-07-30','2026-12-30',NULL,NULL,NULL,'In-Trip',NULL,'Tipper Lorry','2026-07-20 07:31:25.657437','TN 22 AB 1234',NULL),(2,NULL,NULL,'2026-06-30 13:10:45.183785','2027-02-28','2026-09-30',_binary '',NULL,NULL,'2026-08-30','2026-07-11',NULL,NULL,NULL,'In-Trip',NULL,'Tipper Lorry','2026-07-20 07:31:36.789515','TN 19 BR 5776',NULL),(3,NULL,'20ft','2026-06-30 13:10:45.186982','2026-09-30','2026-11-30',_binary '',8,NULL,'2026-07-20','2026-10-30',NULL,NULL,NULL,'Active',NULL,'Container Lorry','2026-07-20 07:31:57.058310','TN 22 CD 5678',NULL),(4,NULL,'32ft','2026-06-30 13:10:45.192812','2027-04-30','2026-08-30',_binary '',15,NULL,'2026-09-30','2027-02-28',NULL,NULL,NULL,'Active',NULL,'Container Lorry','2026-07-20 07:32:14.402477','TN 19 GH 9012',NULL),(5,NULL,'20ft','2026-06-30 13:10:45.197506','2026-07-17','2027-01-30',_binary '',8,NULL,'2026-10-30','2027-03-30',NULL,NULL,NULL,'In-Trip',NULL,'Container Lorry','2026-07-20 07:32:45.845769','TN 22 EF 3456',NULL),(6,NULL,NULL,'2026-06-30 13:10:45.201264','2026-09-30','2026-07-30',_binary '',NULL,NULL,'2026-07-30','2026-08-30',NULL,NULL,NULL,'Active',NULL,'Open Truck','2026-07-20 07:32:55.640644','TN 01 AB 9999',NULL),(7,NULL,NULL,'2026-06-30 13:10:45.204863','2026-12-30','2026-11-30',_binary '',NULL,NULL,'2026-08-30','2026-11-30',NULL,NULL,NULL,'Maintenance',NULL,'Tipper Lorry','2026-07-20 07:33:03.749322','TN 02 XY 1234',NULL),(8,NULL,'40ft','2026-06-30 13:10:45.208878','2027-05-30','2027-02-28',_binary '',20,NULL,'2026-11-30','2027-04-30',NULL,NULL,NULL,'Active',NULL,'Container Lorry','2026-07-20 07:33:14.058166','TN 03 ZA 5555',NULL),(9,NULL,NULL,'2026-06-30 13:10:45.213940','2027-06-30','2027-06-30',_binary '',NULL,NULL,'2026-12-30','2027-06-30',NULL,NULL,NULL,'In-Trip',NULL,'Tanker','2026-07-20 07:33:26.864001','TN 04 CD 7777',NULL),(10,NULL,NULL,'2026-06-30 13:10:45.218479','2026-11-30','2026-09-30',_binary '',NULL,NULL,'2026-09-30','2026-10-30',NULL,NULL,NULL,'Active',NULL,'Refrigerator Truck','2026-07-20 07:32:30.365601','TN 05 EF 8888',NULL),(11,'PER_TRIP','','2026-06-30 14:24:25.544838',NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,'Tipper Lorry','2026-06-30 14:24:25.546486','TN 19 BU 1792',NULL),(12,'MONTHLY','','2026-06-30 14:25:30.668533',NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,'Tipper Lorry','2026-06-30 14:25:30.668533','TN 57 AC 5727',NULL),(13,'HOURLY','','2026-06-30 14:27:04.100574',NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,'JCB','2026-06-30 14:27:04.100574','TN 19 T 7672',NULL),(14,'HOURLY','','2026-06-30 14:28:10.782626',NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,'JCB','2026-06-30 14:28:10.782626','TN 19 BX 8021',NULL),(15,'PER_TRIP','160','2026-07-03 06:21:22.890178',NULL,NULL,_binary '\0',12,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,'Container Lorry','2026-07-03 08:25:01.141898','TN 59 CF 6093',NULL),(16,'PER_TRIP','20','2026-07-03 06:24:12.648113',NULL,NULL,_binary '\0',18,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,'Container Lorry','2026-07-03 06:24:12.648113','TN 19 BS 4030',NULL),(17,'HOURLY','','2026-07-03 06:30:19.254832',NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,'Harvesting Machine','2026-07-03 06:30:19.254832','TN 19 --------',NULL),(18,'OWN_USE','','2026-07-03 07:38:44.854962',NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,'Bike','2026-07-03 08:05:13.539350','TN 19 BU 8687',NULL),(19,'PER_TRIP','','2026-07-03 08:04:45.204491',NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,'Open Type Lorry','2026-07-03 08:12:41.876329','TN 15 MC 0200',NULL),(20,'PER_TRIP','','2026-07-09 07:16:00.379389',NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Active',NULL,'Cars','2026-07-09 07:16:00.379389','TN 19 BS 9631',NULL);
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-20 13:24:07
