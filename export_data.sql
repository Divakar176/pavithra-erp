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
  `created_at` datetime(6) NOT NULL,
  `entity_id` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action_name` varchar(100) NOT NULL,
  `entity_name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `details` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_payments`
--

DROP TABLE IF EXISTS `customer_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_payments` (
  `amount` double NOT NULL,
  `payment_date` date NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `customer_id` bigint NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `payment_mode` varchar(255) DEFAULT NULL,
  `reference_notes` varchar(255) DEFAULT NULL,
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
  `is_deleted` bit(1) NOT NULL,
  `outstanding_balance` double NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contract_details` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gst_number` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKcuu4e61wdwoopdgsh61owqq2f` (`mobile`),
  UNIQUE KEY `UKeh0370jmnamqanxbnk1idd88q` (`gst_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driver_attendance`
--

DROP TABLE IF EXISTS `driver_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver_attendance` (
  `date` date NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `driver_id` bigint NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `remarks` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
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
  `amount` double NOT NULL,
  `date` date NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `driver_id` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `trip_id` bigint DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `vehicle_id` bigint DEFAULT NULL,
  `bill_url` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `expense_type` varchar(255) NOT NULL,
  `paid_to` varchar(255) DEFAULT NULL,
  `payment_mode` varchar(255) DEFAULT NULL,
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
  `amount` double NOT NULL,
  `date` date NOT NULL,
  `quantity` double NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) NOT NULL,
  `vehicle_id` bigint NOT NULL,
  `bill_url` varchar(255) DEFAULT NULL,
  `fuel_station` varchar(255) DEFAULT NULL,
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
  `amount` double NOT NULL,
  `date` date NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `trip_id` bigint DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `income_type` varchar(255) NOT NULL,
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
  `reorder_level` int NOT NULL,
  `stock_quantity` int NOT NULL,
  `unit_price` double DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) NOT NULL,
  `category` varchar(255) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
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
  `date` date NOT NULL,
  `labour_cost` double DEFAULT NULL,
  `spare_parts_cost` double DEFAULT NULL,
  `total_cost` double NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) NOT NULL,
  `vehicle_id` bigint NOT NULL,
  `bill_url` varchar(255) DEFAULT NULL,
  `service_type` varchar(255) NOT NULL,
  `vendor_details` varchar(255) DEFAULT NULL,
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
  `is_read` bit(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
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
  `advance_paid` double DEFAULT NULL,
  `break_hours` double DEFAULT NULL,
  `current_latitude` double DEFAULT NULL,
  `current_longitude` double DEFAULT NULL,
  `diesel_cost` double DEFAULT NULL,
  `distance_km` double DEFAULT NULL,
  `driver_salary` double DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `end_meter` double DEFAULT NULL,
  `food_amount` double DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  `load_weight` double DEFAULT NULL,
  `material_purchase_cost` double DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `start_meter` double DEFAULT NULL,
  `total_hours` double DEFAULT NULL,
  `trip_charges` double NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `customer_id` bigint NOT NULL,
  `driver_id` bigint NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_location_update` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `vehicle_id` bigint NOT NULL,
  `payment_status` varchar(20) NOT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `end_time` varchar(255) DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  `source` varchar(255) NOT NULL,
  `start_time` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKnghaxh3sjtlbwd9a1oag294q0` (`customer_id`),
  KEY `FKc4bs1fyinb8aw9pc740991lv7` (`driver_id`),
  KEY `FKqahsaodjirbk4if91c9bfnlgg` (`vehicle_id`),
  CONSTRAINT `FKc4bs1fyinb8aw9pc740991lv7` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKnghaxh3sjtlbwd9a1oag294q0` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FKqahsaodjirbk4if91c9bfnlgg` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
/*!40000 ALTER TABLE `trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `security_pin` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `role` enum('ACCOUNTANT','ADMIN','CUSTOMER','DRIVER','SUPER_ADMIN') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK63cf888pmqtt5tipcne79xsbm` (`mobile`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('2026-07-14 06:00:55.213745',1,'2026-07-14 07:03:55.220701','divakar@pavithraerp.com','0000000001','$2a$10$lxqY0h34N33K9hsJ.LiPdemefoW5eHzmiALP2pvm9XU8HcJUkxzvq','1234','divakar','SUPER_ADMIN'),('2026-07-14 06:00:55.305515',2,'2026-07-14 06:00:55.305515','ecrelumlai@gmail.com','8056673379','$2a$10$9vn9kebgPtDuU2rJMB0SBOA0RxGLxUIG7LOpjfFbRIIIi9pbXF2Fq','1234','Elumalai','ADMIN'),('2026-07-14 06:00:55.378208',3,'2026-07-14 06:00:55.378208','owner1@pavithraerp.com','1111111111','$2a$10$rAppoSm0zHdnlFn5cytNJ.8bzU4iB6aZPZ7gip3hZrUUPe8GB8N6.','1111','Ranjith','SUPER_ADMIN'),('2026-07-14 06:00:55.451540',4,'2026-07-14 06:00:55.451540','owner2@pavithraerp.com','2222222222','$2a$10$.vBw5gR7coRTHhMYbTlUz.pz9cjkT54RBLJ8KYo4FwdNEe8bKm0wC','2222','owner2','SUPER_ADMIN'),('2026-07-14 06:00:55.525561',5,'2026-07-14 06:00:55.525561','owner3@pavithraerp.com','3333333333','$2a$10$71HiJf8qTDcOjbhV4yaoRew1Nty.PDpInOLLraJVkQ8lmZ/NQ.YEO','3333','owner3','SUPER_ADMIN');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_documents`
--

DROP TABLE IF EXISTS `vehicle_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_documents` (
  `file_size` bigint NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) NOT NULL,
  `uploaded_at` datetime(6) NOT NULL,
  `vehicle_id` bigint NOT NULL,
  `type` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `original_filename` varchar(100) NOT NULL,
  `file_path` varchar(500) NOT NULL,
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
  `emi_amount` double NOT NULL,
  `emi_date` int NOT NULL,
  `interest_rate` double DEFAULT NULL,
  `loan_amount` double NOT NULL,
  `start_date` date NOT NULL,
  `tenure_months` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) NOT NULL,
  `vehicle_id` bigint NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
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
  `fc_expiry` date DEFAULT NULL,
  `insurance_expiry` date DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  `max_load_tons` int DEFAULT NULL,
  `permit_expiry` date DEFAULT NULL,
  `pollution_expiry` date DEFAULT NULL,
  `purchase_price` double DEFAULT NULL,
  `state_permit_expiry` date DEFAULT NULL,
  `tax_expiry` date DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) NOT NULL,
  `billing_type` varchar(255) DEFAULT NULL,
  `container_size` varchar(255) DEFAULT NULL,
  `rc_details` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `vehicle_number` varchar(255) NOT NULL,
  `assigned_driver_id` bigint DEFAULT NULL,
  `monthly_contract_amount` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpy3agdr9g5molxe2mj30p9i8i` (`vehicle_number`),
  KEY `FKsq8pc4w2f4wqb7hhub7ufdhbf` (`assigned_driver_id`),
  CONSTRAINT `FKsq8pc4w2f4wqb7hhub7ufdhbf` FOREIGN KEY (`assigned_driver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
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

-- Dump completed on 2026-07-17 15:36:52
