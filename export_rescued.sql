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
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `customer_payments`
--

LOCK TABLES `customer_payments` WRITE;
/*!40000 ALTER TABLE `customer_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` (is_deleted, outstanding_balance, created_at, id, updated_at, address, contract_details, email, gst_number, mobile, name) VALUES (_binary '',0,'2026-06-30 13:10:45.222075',1,'2026-07-03 06:46:00.958939',NULL,NULL,NULL,'33AAAAA0001A1Z1','9999999901','Sri Ram Constructions');
INSERT INTO `customers` (is_deleted, outstanding_balance, created_at, id, updated_at, address, contract_details, email, gst_number, mobile, name) VALUES (_binary '',0,'2026-06-30 13:10:45.228646',2,'2026-07-03 06:45:52.290170',NULL,NULL,NULL,'33BBBBB0002B1Z2','9999999902','Madurai Blue Metals');
INSERT INTO `customers` (is_deleted, outstanding_balance, created_at, id, updated_at, address, contract_details, email, gst_number, mobile, name) VALUES (_binary '',0,'2026-06-30 13:10:45.234107',3,'2026-07-03 06:45:44.616464',NULL,NULL,NULL,'33CCCCC0003C1Z3','9999999903','Chennai Builders');
INSERT INTO `customers` (is_deleted, outstanding_balance, created_at, id, updated_at, address, contract_details, email, gst_number, mobile, name) VALUES (_binary '',0,'2026-06-30 13:10:45.239421',4,'2026-07-03 06:45:36.539008',NULL,NULL,NULL,'33DDDDD0004D1Z4','9999999904','Salem Sands Ltd');
INSERT INTO `customers` (is_deleted, outstanding_balance, created_at, id, updated_at, address, contract_details, email, gst_number, mobile, name) VALUES (_binary '',0,'2026-06-30 13:10:45.243426',5,'2026-07-03 06:45:26.430363',NULL,NULL,NULL,'33EEEEE0005E1Z5','9999999905','Coimbatore Cement Traders');
INSERT INTO `customers` (is_deleted, outstanding_balance, created_at, id, updated_at, address, contract_details, email, gst_number, mobile, name) VALUES (_binary '\0',0,'2026-07-09 10:06:25.459177',6,'2026-07-09 10:06:25.459177',NULL,NULL,NULL,'TEMP-ae202716','TEMP-ae202716','fc work');
INSERT INTO `customers` (is_deleted, outstanding_balance, created_at, id, updated_at, address, contract_details, email, gst_number, mobile, name) VALUES (_binary '\0',0,'2026-07-09 10:08:57.133672',7,'2026-07-09 10:08:57.133672',NULL,NULL,NULL,'TEMP-ea1da76e','TEMP-ea1da76e','fc work');
INSERT INTO `customers` (is_deleted, outstanding_balance, created_at, id, updated_at, address, contract_details, email, gst_number, mobile, name) VALUES (_binary '\0',0,'2026-07-09 10:22:15.607099',8,'2026-07-09 10:22:15.607099',NULL,NULL,NULL,'TEMP-e492de74','TEMP-e492de74','testing customer ');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `driver_attendance`
--

LOCK TABLES `driver_attendance` WRITE;
/*!40000 ALTER TABLE `driver_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `driver_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `fuel_logs`
--

LOCK TABLES `fuel_logs` WRITE;
/*!40000 ALTER TABLE `fuel_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `fuel_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `incomes`
--

LOCK TABLES `incomes` WRITE;
/*!40000 ALTER TABLE `incomes` DISABLE KEYS */;
/*!40000 ALTER TABLE `incomes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `inventory_items`
--

LOCK TABLES `inventory_items` WRITE;
/*!40000 ALTER TABLE `inventory_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `maintenance_logs`
--

LOCK TABLES `maintenance_logs` WRITE;
/*!40000 ALTER TABLE `maintenance_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenance_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
INSERT INTO `trips` (advance_paid, break_hours, diesel_cost, distance_km, driver_salary, end_date, end_meter, food_amount, is_deleted, load_weight, material_purchase_cost, start_date, start_meter, total_hours, trip_charges, created_at, customer_id, driver_id, id, updated_at, vehicle_id, payment_status, destination, end_time, material, source, start_time, status, current_latitude, current_longitude, last_location_update) VALUES (5000,NULL,NULL,355,2851,'2026-06-08',NULL,NULL,_binary '\0',11,NULL,'2026-06-07',NULL,NULL,31615,'2026-06-30 13:10:45.249716',5,4,1,'2026-06-30 13:10:45.249716',3,'UNPAID','Hyderabad',NULL,'Cement','Salem',NULL,'COMPLETED',NULL,NULL,NULL);
INSERT INTO `trips` (advance_paid, break_hours, diesel_cost, distance_km, driver_salary, end_date, end_meter, food_amount, is_deleted, load_weight, material_purchase_cost, start_date, start_meter, total_hours, trip_charges, created_at, customer_id, driver_id, id, updated_at, vehicle_id, payment_status, destination, end_time, material, source, start_time, status, current_latitude, current_longitude, last_location_update) VALUES (5000,NULL,NULL,411,2455,'2026-06-05',NULL,NULL,_binary '\0',26,NULL,'2026-06-04',NULL,NULL,21310,'2026-06-30 13:10:45.279236',3,3,2,'2026-06-30 13:10:45.279236',1,'UNPAID','Cochin',NULL,'Cement','Trichy',NULL,'COMPLETED',NULL,NULL,NULL);
INSERT INTO `trips` (advance_paid, break_hours, diesel_cost, distance_km, driver_salary, end_date, end_meter, food_amount, is_deleted, load_weight, material_purchase_cost, start_date, start_meter, total_hours, trip_charges, created_at, customer_id, driver_id, id, updated_at, vehicle_id, payment_status, destination, end_time, material, source, start_time, status, current_latitude, current_longitude, last_location_update) VALUES (5000,NULL,NULL,658,2244,'2026-06-04',NULL,NULL,_binary '\0',18,NULL,'2026-06-01',NULL,NULL,33762,'2026-06-30 13:10:45.305402',1,4,3,'2026-06-30 13:10:45.305402',8,'UNPAID','Cochin',NULL,'Steel','Coimbatore',NULL,'COMPLETED',NULL,NULL,NULL);
INSERT INTO `trips` (advance_paid, break_hours, diesel_cost, distance_km, driver_salary, end_date, end_meter, food_amount, is_deleted, load_weight, material_purchase_cost, start_date, start_meter, total_hours, trip_charges, created_at, customer_id, driver_id, id, updated_at, vehicle_id, payment_status, destination, end_time, material, source, start_time, status, current_latitude, current_longitude, last_location_update) VALUES (5000,NULL,NULL,319,2004,'2026-06-26',NULL,NULL,_binary '\0',10,NULL,'2026-06-24',NULL,NULL,22266,'2026-06-30 13:10:45.323507',1,3,4,'2026-06-30 13:10:45.323507',7,'UNPAID','Pondicherry',NULL,'Steel','Coimbatore',NULL,'COMPLETED',NULL,NULL,NULL);
INSERT INTO `trips` (advance_paid, break_hours, diesel_cost, distance_km, driver_salary, end_date, end_meter, food_amount, is_deleted, load_weight, material_purchase_cost, start_date, start_meter, total_hours, trip_charges, created_at, customer_id, driver_id, id, updated_at, vehicle_id, payment_status, destination, end_time, material, source, start_time, status, current_latitude, current_longitude, last_location_update) VALUES (5000,NULL,NULL,467,2933,'2026-06-27',NULL,NULL,_binary '\0',15,NULL,'2026-06-26',NULL,NULL,20158,'2026-06-30 13:10:45.343309',3,4,5,'2026-06-30 13:10:45.343309',10,'UNPAID','Pondicherry',NULL,'Cement','Chennai',NULL,'COMPLETED',NULL,NULL,NULL);
INSERT INTO `trips` (advance_paid, break_hours, diesel_cost, distance_km, driver_salary, end_date, end_meter, food_amount, is_deleted, load_weight, material_purchase_cost, start_date, start_meter, total_hours, trip_charges, created_at, customer_id, driver_id, id, updated_at, vehicle_id, payment_status, destination, end_time, material, source, start_time, status, current_latitude, current_longitude, last_location_update) VALUES (5000,NULL,NULL,781,2962,'2026-06-22',NULL,NULL,_binary '\0',26,NULL,'2026-06-19',NULL,NULL,27429,'2026-06-30 13:10:45.362592',5,3,6,'2026-06-30 13:10:45.362592',1,'UNPAID','Trivandrum',NULL,'Sand','Salem',NULL,'COMPLETED',NULL,NULL,NULL);
INSERT INTO `trips` (advance_paid, break_hours, diesel_cost, distance_km, driver_salary, end_date, end_meter, food_amount, is_deleted, load_weight, material_purchase_cost, start_date, start_meter, total_hours, trip_charges, created_at, customer_id, driver_id, id, updated_at, vehicle_id, payment_status, destination, end_time, material, source, start_time, status, current_latitude, current_longitude, last_location_update) VALUES (5000,NULL,NULL,532,2464,'2026-06-25',NULL,NULL,_binary '\0',27,NULL,'2026-06-23',NULL,NULL,29930,'2026-06-30 13:10:45.380998',5,4,7,'2026-06-30 13:10:45.380998',3,'UNPAID','Hyderabad',NULL,'Cement','Trichy',NULL,'COMPLETED',NULL,NULL,NULL);
INSERT INTO `trips` (advance_paid, break_hours, diesel_cost, distance_km, driver_salary, end_date, end_meter, food_amount, is_deleted, load_weight, material_purchase_cost, start_date, start_meter, total_hours, trip_charges, created_at, customer_id, driver_id, id, updated_at, vehicle_id, payment_status, destination, end_time, material, source, start_time, status, current_latitude, current_longitude, last_location_update) VALUES (5000,NULL,NULL,587,2384,NULL,NULL,NULL,_binary '',28,NULL,'2026-06-25',NULL,NULL,17420,'2026-06-30 13:10:45.394284',3,3,8,'2026-07-09 14:09:31.200330',2,'PAID','Pondicherry',NULL,'Steel','Madurai',NULL,'IN_PROGRESS',12.036600000000014,79.90329999999992,'2026-07-09 14:09:31.196118');
INSERT INTO `trips` (advance_paid, break_hours, diesel_cost, distance_km, driver_salary, end_date, end_meter, food_amount, is_deleted, load_weight, material_purchase_cost, start_date, start_meter, total_hours, trip_charges, created_at, customer_id, driver_id, id, updated_at, vehicle_id, payment_status, destination, end_time, material, source, start_time, status, current_latitude, current_longitude, last_location_update) VALUES (5000,NULL,NULL,779,2096,NULL,NULL,NULL,_binary '',13,NULL,'2026-06-12',NULL,NULL,20247,'2026-06-30 13:10:45.407947',2,4,9,'2026-07-09 07:17:47.229432',5,'UNPAID','Bangalore',NULL,'Cement','Chennai',NULL,'IN_PROGRESS',NULL,NULL,NULL);
INSERT INTO `trips` (advance_paid, break_hours, diesel_cost, distance_km, driver_salary, end_date, end_meter, food_amount, is_deleted, load_weight, material_purchase_cost, start_date, start_meter, total_hours, trip_charges, created_at, customer_id, driver_id, id, updated_at, vehicle_id, payment_status, destination, end_time, material, source, start_time, status, current_latitude, current_longitude, last_location_update) VALUES (5000,NULL,NULL,317,2926,NULL,NULL,NULL,_binary '',18,NULL,'2026-06-21',NULL,NULL,15605,'2026-06-30 13:10:45.420243',3,3,10,'2026-07-09 07:17:34.614440',6,'UNPAID','Trivandrum',NULL,'Cement','Salem',NULL,'IN_PROGRESS',NULL,NULL,NULL);
INSERT INTO `trips` (advance_paid, break_hours, diesel_cost, distance_km, driver_salary, end_date, end_meter, food_amount, is_deleted, load_weight, material_purchase_cost, start_date, start_meter, total_hours, trip_charges, created_at, customer_id, driver_id, id, updated_at, vehicle_id, payment_status, destination, end_time, material, source, start_time, status, current_latitude, current_longitude, last_location_update) VALUES (NULL,NULL,10000,NULL,1200,NULL,NULL,250,_binary '\0',17,0,'2026-07-09',NULL,NULL,0,'2026-07-09 10:54:18.163089',8,9,11,'2026-07-09 10:54:18.163089',11,'UNPAID','madhuranthagam',NULL,'-','pondicherry ',NULL,'IN_PROGRESS',NULL,NULL,NULL);
/*!40000 ALTER TABLE `trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (created_at, id, updated_at, email, mobile, password, security_pin, username, role) VALUES ('2026-06-30 13:10:44.794392',2,'2026-06-30 13:10:44.794392','ecrelumlai@gmail.com','8056673379','$2a$10$NwUbRbHTg1YRrcCVNRKZau8u5yYuPvW/.2CD.HyqGJLWHSBhVdOCS','1234','Elumalai','ADMIN');
INSERT INTO `users` (created_at, id, updated_at, email, mobile, password, security_pin, username, role) VALUES ('2026-06-30 13:10:44.867452',3,'2026-06-30 13:33:42.653737','kumar@pavithraerp.com','9876543210','$2a$10$sO2hYT6jPGSThs2WvLuFr.ddCduEh59smt.SiKtsw6TB1Mru6rLbO','1234','kumar','DRIVER');
INSERT INTO `users` (created_at, id, updated_at, email, mobile, password, security_pin, username, role) VALUES ('2026-06-30 13:10:44.942666',4,'2026-06-30 13:33:42.655684','selvam@pavithraerp.com','9876543211','$2a$10$GP6WzEbgAnb0ON9BZUrW9.OUEkujBnA1KQV/7zQq3X/HwSkNPifCi','1234','selvam','DRIVER');
INSERT INTO `users` (created_at, id, updated_at, email, mobile, password, security_pin, username, role) VALUES ('2026-06-30 13:10:45.091399',6,'2026-06-30 13:10:45.091399','owner2@pavithraerp.com','2222222222','$2a$10$/TKBVJlRc8.anene7g7o6uELXhaN7YR8l4aDIyAPDtxpS6bC/PljO','2222','owner2','SUPER_ADMIN');
INSERT INTO `users` (created_at, id, updated_at, email, mobile, password, security_pin, username, role) VALUES ('2026-06-30 13:10:45.172419',7,'2026-06-30 13:10:45.172419','owner3@pavithraerp.com','3333333333','$2a$10$.ED4c6ca3UByK18Xodu.X.LZckl6JwG9.JMV6z6vaaz9mXi82Qxn6','3333','owner3','SUPER_ADMIN');
INSERT INTO `users` (created_at, id, updated_at, email, mobile, password, security_pin, username, role) VALUES ('2026-07-09 10:08:57.147398',9,'2026-07-09 10:48:27.468310','temp-0aa8e58b@example.com','TEMP-0aa8e58b','driver123','1234','Ranjith Driver','DRIVER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vehicle_documents`
--

LOCK TABLES `vehicle_documents` WRITE;
/*!40000 ALTER TABLE `vehicle_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vehicle_loans`
--

LOCK TABLES `vehicle_loans` WRITE;
/*!40000 ALTER TABLE `vehicle_loans` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle_loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES ('2027-06-30','2026-07-04',_binary '',NULL,'2026-12-30','2026-07-30',NULL,NULL,'2026-06-30 13:10:45.177134',1,'2026-06-30 13:35:20.425736',NULL,NULL,NULL,'In-Trip','Tipper Lorry','TN 22 AB 1234');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES ('2027-02-28','2026-09-30',_binary '',NULL,'2026-07-11','2026-08-30',NULL,NULL,'2026-06-30 13:10:45.183785',2,'2026-06-30 13:35:47.170070',NULL,NULL,NULL,'In-Trip','Tipper Lorry','TN 19 BR 5776');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES ('2026-09-30','2026-11-30',_binary '',8,'2026-10-30','2026-07-20',NULL,NULL,'2026-06-30 13:10:45.186982',3,'2026-06-30 13:36:06.111222',NULL,'20ft',NULL,'Active','Container Lorry','TN 22 CD 5678');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES ('2027-04-30','2026-08-30',_binary '',15,'2027-02-28','2026-09-30',NULL,NULL,'2026-06-30 13:10:45.192812',4,'2026-06-30 13:36:24.388911',NULL,'32ft',NULL,'Active','Container Lorry','TN 19 GH 9012');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES ('2026-07-17','2027-01-30',_binary '',8,'2027-03-30','2026-10-30',NULL,NULL,'2026-06-30 13:10:45.197506',5,'2026-06-30 13:36:38.483455',NULL,'20ft',NULL,'In-Trip','Container Lorry','TN 22 EF 3456');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES ('2026-09-30','2026-07-30',_binary '',NULL,'2026-08-30','2026-07-30',NULL,NULL,'2026-06-30 13:10:45.201264',6,'2026-06-30 13:36:48.511859',NULL,NULL,NULL,'Active','Open Truck','TN 01 AB 9999');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES ('2026-12-30','2026-11-30',_binary '',NULL,'2026-11-30','2026-08-30',NULL,NULL,'2026-06-30 13:10:45.204863',7,'2026-06-30 13:36:58.522813',NULL,NULL,NULL,'Maintenance','Tipper Lorry','TN 02 XY 1234');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES ('2027-05-30','2027-02-28',_binary '',20,'2027-04-30','2026-11-30',NULL,NULL,'2026-06-30 13:10:45.208878',8,'2026-06-30 13:37:10.351692',NULL,'40ft',NULL,'Active','Container Lorry','TN 03 ZA 5555');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES ('2027-06-30','2027-06-30',_binary '',NULL,'2027-06-30','2026-12-30',NULL,NULL,'2026-06-30 13:10:45.213940',9,'2026-06-30 13:37:20.037328',NULL,NULL,NULL,'In-Trip','Tanker','TN 04 CD 7777');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES ('2026-11-30','2026-09-30',_binary '',NULL,'2026-10-30','2026-09-30',NULL,NULL,'2026-06-30 13:10:45.218479',10,'2026-06-30 13:37:33.961647',NULL,NULL,NULL,'Active','Refrigerator Truck','TN 05 EF 8888');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES (NULL,NULL,_binary '\0',NULL,NULL,NULL,4400000,NULL,'2026-06-30 14:24:25.544838',11,'2026-06-30 14:24:25.546486','PER_TRIP','',NULL,'Active','Tipper Lorry','TN 19 BU 1792');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES (NULL,NULL,_binary '\0',NULL,NULL,NULL,120000,NULL,'2026-06-30 14:25:30.668533',12,'2026-06-30 14:25:30.668533','MONTHLY','',NULL,'Active','Tipper Lorry','TN 57 AC 5727');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES (NULL,NULL,_binary '\0',NULL,NULL,NULL,2600000,NULL,'2026-06-30 14:27:04.100574',13,'2026-06-30 14:27:04.100574','HOURLY','',NULL,'Active','JCB','TN 19 T 7672');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES (NULL,NULL,_binary '\0',NULL,NULL,NULL,0,NULL,'2026-06-30 14:28:10.782626',14,'2026-06-30 14:28:10.782626','HOURLY','',NULL,'Active','JCB','TN 19 BX 8021');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES (NULL,NULL,_binary '\0',12,NULL,NULL,1100000,NULL,'2026-07-03 06:21:22.890178',15,'2026-07-03 08:25:01.141898','PER_TRIP','160',NULL,'Active','Container Lorry','TN 59 CF 6093');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES (NULL,NULL,_binary '\0',18,NULL,NULL,2100000,NULL,'2026-07-03 06:24:12.648113',16,'2026-07-03 06:24:12.648113','PER_TRIP','20',NULL,'Active','Container Lorry','TN 19 BS 4030');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES (NULL,NULL,_binary '\0',NULL,NULL,NULL,2400000,NULL,'2026-07-03 06:30:19.254832',17,'2026-07-03 06:30:19.254832','HOURLY','',NULL,'Active','Harvesting Machine','TN 19 --------');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES (NULL,NULL,_binary '',NULL,NULL,NULL,252000,NULL,'2026-07-03 07:38:44.854962',18,'2026-07-03 08:05:13.539350','OWN_USE','',NULL,'Active','Bike','TN 19 BU 8687');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES (NULL,NULL,_binary '\0',NULL,NULL,NULL,160000,NULL,'2026-07-03 08:04:45.204491',19,'2026-07-03 08:12:41.876329','PER_TRIP','',NULL,'Active','Open Type Lorry','TN 15 MC 0200');
INSERT INTO `vehicles` (fc_expiry, insurance_expiry, is_deleted, max_load_tons, pollution_expiry, permit_expiry, state_permit_expiry, purchase_price, created_at, id, updated_at, billing_type, container_size, monthly_contract_amount, status, type, vehicle_number) VALUES (NULL,NULL,_binary '\0',NULL,NULL,NULL,27000,NULL,'2026-07-09 07:16:00.379389',20,'2026-07-09 07:16:00.379389','PER_TRIP','',NULL,'Active','Cars','TN 19 BS 9631');
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

-- Dump completed on 2026-07-10 17:37:36
