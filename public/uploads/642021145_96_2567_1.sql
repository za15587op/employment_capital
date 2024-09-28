-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 26, 2024 at 04:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employment_capital`
--

-- --------------------------------------------------------

--
-- Table structure for table `datetimeavailable`
--

CREATE TABLE `datetimeavailable` (
  `datetime_id` int(11) NOT NULL,
  `regist_id` int(11) DEFAULT NULL,
  `date_available` varchar(30) DEFAULT NULL,
  `is_parttime` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `datetimeavailable`
--

INSERT INTO `datetimeavailable` (`datetime_id`, `regist_id`, `date_available`, `is_parttime`) VALUES
(124, 137, '[\"จันทร์\",\"อังคาร\"]', 'fulltime'),
(126, 131, '[\"จันทร์\",\"อังคาร\"]', 'fulltime'),
(127, 138, '[\"จันทร์\",\"อังคาร\"]', 'fulltime'),
(129, 140, '[\"จันทร์\",\"อังคาร\"]', 'fulltime');

-- --------------------------------------------------------

--
-- Table structure for table `matching`
--

CREATE TABLE `matching` (
  `matching_id` int(11) NOT NULL,
  `student_id` varchar(11) DEFAULT NULL,
  `scholarship_id` int(11) DEFAULT NULL,
  `matchScore` float DEFAULT NULL,
  `matchDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organization`
--

CREATE TABLE `organization` (
  `organization_id` int(11) NOT NULL,
  `organization_name` varchar(255) DEFAULT NULL,
  `contactPhone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organization`
--

INSERT INTO `organization` (`organization_id`, `organization_name`, `contactPhone`) VALUES
(504, 'สำนักงานวิทยาเขตพัทลุง', '0999999999'),
(505, 'ฝ่ายการคลังและบริหารสินทรัพย์', '0888888888'),
(506, 'สำนักงานวิทยาเขตสงขลา', '0777777777'),
(507, 'ฝ่ายยุทธศาสตร์และพัฒนาคุณภาพองค์กร', '0666666666'),
(508, 'ฝ่ายกิจการนิสิต', '0555555555'),
(509, 'งานสื่อสารองค์กร', '0444444444'),
(510, 'สถาบันทรัพยากรการเรียนรู้และเทคโนโลยีดิจิทัล', '0333333333'),
(511, 'ฝ่ายวิชาการและการเรียนรู้', '0222222222'),
(512, 'คณะวิทยาศาสตร์และนวัตกรรมดิจิทัล', '0111111111'),
(513, 'คณะวิศวกรรมศาสตร์', '0000000000'),
(514, 'คณะเทคโนโลยีและการพัฒนาชุมชน', '0123456789'),
(515, 'คณะพยาบาลศาสตร์', '011223344'),
(516, 'คณะวิทยาการสุขภาพและการกีฬา', '1122334455'),
(517, 'คณะนิติศาสตร์', '9876543210'),
(518, 'คณะอุตสาหกรรมเกษตรและชีวภาพ', '1234567890'),
(519, 'คณะศึกษาศาสตร์', '1112131415');

-- --------------------------------------------------------

--
-- Table structure for table `scholarshiporganization`
--

CREATE TABLE `scholarshiporganization` (
  `scholarship_organ_id` int(11) NOT NULL,
  `scholarship_id` int(11) DEFAULT NULL,
  `organization_id` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `workType` varchar(255) DEFAULT NULL,
  `workTime` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`workTime`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scholarshiporganization`
--

INSERT INTO `scholarshiporganization` (`scholarship_organ_id`, `scholarship_id`, `organization_id`, `amount`, `workType`, `workTime`) VALUES
(463, 91, 504, 20, 'นอกเวลาทำการที่กำหนด', '[\"วันจันทร์\",\"วันอังคาร\"]'),
(464, 91, 505, NULL, NULL, NULL),
(465, 91, 506, NULL, NULL, NULL),
(466, 91, 507, NULL, NULL, NULL),
(467, 91, 508, NULL, NULL, NULL),
(468, 91, 509, NULL, NULL, NULL),
(469, 91, 510, NULL, NULL, NULL),
(470, 91, 511, NULL, NULL, NULL),
(471, 91, 512, NULL, NULL, NULL),
(472, 91, 513, NULL, NULL, NULL),
(473, 91, 514, NULL, NULL, NULL),
(474, 91, 515, NULL, NULL, NULL),
(475, 91, 516, NULL, NULL, NULL),
(476, 91, 517, NULL, NULL, NULL),
(477, 91, 518, NULL, NULL, NULL),
(478, 91, 519, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `scholarshipregistrations`
--

CREATE TABLE `scholarshipregistrations` (
  `regist_id` int(11) NOT NULL,
  `scholarship_id` int(11) DEFAULT NULL,
  `student_id` varchar(11) DEFAULT NULL,
  `related_works` varchar(255) DEFAULT NULL,
  `student_status` varchar(20) DEFAULT NULL,
  `join_org` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scholarshipregistrations`
--

INSERT INTO `scholarshipregistrations` (`regist_id`, `scholarship_id`, `student_id`, `related_works`, `student_status`, `join_org`) VALUES
(131, 91, '642021150', '', 'Pass', '[\"ฝ่ายการคลังและบริหารสินทรัพย์\",\"สำนักงานวิทยาเขตสงขลา\"]'),
(137, 92, '642021150', '', 'Pending', '[\"สำนักงานวิทยาเขตพัทลุง\",\"ฝ่ายยุทธศาสตร์และพัฒนาคุณภาพองค์กร\",\"งานสื่อสารองค์กร\"]'),
(138, 91, '642021200', '/uploads/642021200_91_2567_1.docx', 'Pending', NULL),
(140, 92, '642021200', '/uploads/642021200_92_2568_1.docx', 'Pending', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `scholarshiprequirement`
--

CREATE TABLE `scholarshiprequirement` (
  `scholarship_requirement_id` int(11) NOT NULL,
  `scholarship_organ_id` int(11) DEFAULT NULL,
  `skill_type_id` int(11) DEFAULT NULL,
  `required_level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scholarshiprequirement`
--

INSERT INTO `scholarshiprequirement` (`scholarship_requirement_id`, `scholarship_organ_id`, `skill_type_id`, `required_level`) VALUES
(338, 464, NULL, NULL),
(339, 465, NULL, NULL),
(340, 466, NULL, NULL),
(341, 467, NULL, NULL),
(342, 468, NULL, NULL),
(343, 469, NULL, NULL),
(344, 470, NULL, NULL),
(345, 471, NULL, NULL),
(346, 472, NULL, NULL),
(347, 473, NULL, NULL),
(348, 474, NULL, NULL),
(349, 475, NULL, NULL),
(350, 476, NULL, NULL),
(351, 477, NULL, NULL),
(352, 478, NULL, NULL),
(353, 463, 149, 3),
(354, 463, 150, 4);

-- --------------------------------------------------------

--
-- Table structure for table `scholarships`
--

CREATE TABLE `scholarships` (
  `scholarship_id` int(11) NOT NULL,
  `application_start_date` date DEFAULT NULL,
  `application_end_date` date DEFAULT NULL,
  `academic_year` int(11) DEFAULT NULL,
  `academic_term` int(11) DEFAULT NULL,
  `scholarship_status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scholarships`
--

INSERT INTO `scholarships` (`scholarship_id`, `application_start_date`, `application_end_date`, `academic_year`, `academic_term`, `scholarship_status`) VALUES
(91, '2024-09-19', '2024-09-27', 2567, 1, 1),
(92, '2024-09-25', '2024-09-28', 2568, 1, 1),
(95, '2024-09-20', '2024-09-26', 2989, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `skill_id` int(11) NOT NULL,
  `skill_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`skill_id`, `skill_name`) VALUES
(81, 'canva'),
(82, 'ภาษาอังกฤษ'),
(83, 'เขียนโปรแกรมได้'),
(87, 'test');

-- --------------------------------------------------------

--
-- Table structure for table `skills_skilltypes`
--

CREATE TABLE `skills_skilltypes` (
  `skill_id` int(11) NOT NULL,
  `skill_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skills_skilltypes`
--

INSERT INTO `skills_skilltypes` (`skill_id`, `skill_type_id`) VALUES
(81, 150),
(82, 149),
(83, 152),
(87, 153),
(87, 155),
(87, 157);

-- --------------------------------------------------------

--
-- Table structure for table `skilltypes`
--

CREATE TABLE `skilltypes` (
  `skill_type_id` int(11) NOT NULL,
  `skill_type_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skilltypes`
--

INSERT INTO `skilltypes` (`skill_type_id`, `skill_type_name`) VALUES
(149, 'การสื่อสาร'),
(150, 'การนำเสนอ'),
(151, 'ความรู้พื้นฐานเกี่ยวกับการบริหารโครงการ การเงิน พัสดุ'),
(152, 'มีความรู้ด้านคอมพิวเตอร์ เช่น ซ่อมบำรุงได้ เขียนโปรแกรม'),
(153, 'สามารถใช้โปรแกรม Microsoft Office ได้'),
(154, 'ความคิดสร้างสรรค์ ในการออกแบบ สามารถใช้งานโปรแกรม เช่น Canva,  Adobe lllustrator, Adobe Photoshop และโปรแกรมตัดต่อวิดิโอ'),
(155, 'ทักษะด้านภาษาอังกฤษ การพูด อ่าน เขียน ภาษาอังกฤษ'),
(156, 'ทักษะในการสื่อสาร เช่น เขียนข่าวประชาสัมพันธ์ '),
(157, 'ทักษะในการถ่ายภาพ วิดีโอ '),
(158, 'มีความรับผิดชอบ'),
(159, 'ทำงานอื่นๆ ตามที่ได้รับมอบหมาย'),
(160, 'ความรู้พื้นฐานเกี่ยวกับการบริหารโครงการ การเงิน พัสดุ'),
(161, 'มีความรู้ด้านคอมพิวเตอร์ เช่น ซ่อมบำรุงได้ เขียนโปรแกรม'),
(162, 'สามารถใช้โปรแกรม Microsoft Office ได้'),
(163, 'ความคิดสร้างสรรค์ ในการออกแบบ สามารถใช้งานโปรแกรม เช่น Canva,  Adobe lllustrator, Adobe Photoshop และโปรแกรมตัดต่อวิดิโอ'),
(164, 'ทักษะด้านภาษาอังกฤษ การพูด อ่าน เขียน ภาษาอังกฤษ'),
(165, 'ทักษะในการสื่อสาร เช่น เขียนข่าวประชาสัมพันธ์ '),
(166, 'ทักษะในการถ่ายภาพ วิดีโอ '),
(167, 'มีความรับผิดชอบ'),
(168, 'ทำงานอื่นๆ ตามที่ได้รับมอบหมาย');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `user_id` int(11) DEFAULT NULL,
  `student_id` varchar(11) NOT NULL,
  `student_firstname` varchar(255) DEFAULT NULL,
  `student_lastname` varchar(255) DEFAULT NULL,
  `student_faculty` varchar(255) DEFAULT NULL,
  `student_curriculum` varchar(255) DEFAULT NULL,
  `student_year` int(11) DEFAULT NULL,
  `student_phone` varchar(255) DEFAULT NULL,
  `student_gpa` float DEFAULT NULL,
  `join_org` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`user_id`, `student_id`, `student_firstname`, `student_lastname`, `student_faculty`, `student_curriculum`, `student_year`, `student_phone`, `student_gpa`, `join_org`) VALUES
(1, '642021150', 'พงษ์ศักดิ์', 'พิริยะยรรยง', 'วิทยาศาสตร์', 'วิทยาการคอมพิวเตอร์', 4, '0984793679', 3.97, ''),
(17, '642021200', 'test', 'test', 'test', 'tes', 4, '0311111', 4, 'ฝ่ายการคลังและบริหารสินทรัพย์'),
(16, '642021234', 'ธีรพงษ์', 'พิริยะยรรยง', 'วิศวะ', 'ไฟ', 3, '0123456789', 3.01, '');

-- --------------------------------------------------------

--
-- Table structure for table `studentskills`
--

CREATE TABLE `studentskills` (
  `student_id` varchar(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  `skill_level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `studentskills`
--

INSERT INTO `studentskills` (`student_id`, `skill_id`, `skill_level`) VALUES
('642021150', 81, 4),
('642021150', 82, 4),
('642021200', 87, 5),
('642021234', 83, 4);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`, `user_role`) VALUES
(1, 'test@gmail.com', '$2a$10$g2Nyb2uWMYhSMrZ88OizUOPEBZAvoYXjH5Yvqws7fZJkKv5cbb2i6', 'student'),
(2, 'admin@gmail.com', '$2a$10$YJdATQWYgErIuu40fvFKdusxtGOtQftRZQtyvuPU2sWgVCxUlpL6O', 'admin'),
(5, 'k@gmail.com', '$2a$10$bXsYshM8JYGpSv7RwnJwW..UHPccRcJ4mlh1uNYCRQfkq0FcEeoQS', 'student'),
(7, '1234@gmail.com', '$2a$10$635Z.z.EU/IdtqBPYCMAVuYlPH176hKAB1.bNKuTz5YZ6.Wo8X7Ry', 'student'),
(16, 'test01@gmail.com', '$2a$10$lDEgiAPeoFg9ztVstSXvHezArcjvGndFGYGGC5Xba1T3slemv0p3C', 'student'),
(17, 'test02@gmail.com', '$2a$10$.Gf14XdzrqWdgDUpbBuW4uotXyHPMChpVVKPrtoNUy7X8PCVT/fCq', 'student');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `datetimeavailable`
--
ALTER TABLE `datetimeavailable`
  ADD PRIMARY KEY (`datetime_id`),
  ADD KEY `regist_id` (`regist_id`);

--
-- Indexes for table `matching`
--
ALTER TABLE `matching`
  ADD PRIMARY KEY (`matching_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `scholarship_id` (`scholarship_id`);

--
-- Indexes for table `organization`
--
ALTER TABLE `organization`
  ADD PRIMARY KEY (`organization_id`);

--
-- Indexes for table `scholarshiporganization`
--
ALTER TABLE `scholarshiporganization`
  ADD PRIMARY KEY (`scholarship_organ_id`),
  ADD KEY `scholarship_id` (`scholarship_id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `scholarshipregistrations`
--
ALTER TABLE `scholarshipregistrations`
  ADD PRIMARY KEY (`regist_id`),
  ADD UNIQUE KEY `unique_student_scholarship` (`student_id`,`scholarship_id`),
  ADD KEY `scholarship_id` (`scholarship_id`);

--
-- Indexes for table `scholarshiprequirement`
--
ALTER TABLE `scholarshiprequirement`
  ADD PRIMARY KEY (`scholarship_requirement_id`),
  ADD KEY `scholarship_id` (`scholarship_organ_id`),
  ADD KEY `skill_id` (`skill_type_id`);

--
-- Indexes for table `scholarships`
--
ALTER TABLE `scholarships`
  ADD PRIMARY KEY (`scholarship_id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`skill_id`);

--
-- Indexes for table `skills_skilltypes`
--
ALTER TABLE `skills_skilltypes`
  ADD PRIMARY KEY (`skill_id`,`skill_type_id`),
  ADD KEY `skill_type_id` (`skill_type_id`);

--
-- Indexes for table `skilltypes`
--
ALTER TABLE `skilltypes`
  ADD PRIMARY KEY (`skill_type_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `studentskills`
--
ALTER TABLE `studentskills`
  ADD PRIMARY KEY (`student_id`,`skill_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `datetimeavailable`
--
ALTER TABLE `datetimeavailable`
  MODIFY `datetime_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;

--
-- AUTO_INCREMENT for table `matching`
--
ALTER TABLE `matching`
  MODIFY `matching_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `organization`
--
ALTER TABLE `organization`
  MODIFY `organization_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=520;

--
-- AUTO_INCREMENT for table `scholarshiporganization`
--
ALTER TABLE `scholarshiporganization`
  MODIFY `scholarship_organ_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=479;

--
-- AUTO_INCREMENT for table `scholarshipregistrations`
--
ALTER TABLE `scholarshipregistrations`
  MODIFY `regist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT for table `scholarshiprequirement`
--
ALTER TABLE `scholarshiprequirement`
  MODIFY `scholarship_requirement_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=355;

--
-- AUTO_INCREMENT for table `scholarships`
--
ALTER TABLE `scholarships`
  MODIFY `scholarship_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `skill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `skilltypes`
--
ALTER TABLE `skilltypes`
  MODIFY `skill_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `datetimeavailable`
--
ALTER TABLE `datetimeavailable`
  ADD CONSTRAINT `datetimeavailable_ibfk_1` FOREIGN KEY (`regist_id`) REFERENCES `scholarshipregistrations` (`regist_id`);

--
-- Constraints for table `matching`
--
ALTER TABLE `matching`
  ADD CONSTRAINT `matching_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `matching_ibfk_2` FOREIGN KEY (`scholarship_id`) REFERENCES `scholarships` (`scholarship_id`);

--
-- Constraints for table `scholarshiporganization`
--
ALTER TABLE `scholarshiporganization`
  ADD CONSTRAINT `scholarshiporganization_ibfk_2` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`organization_id`);

--
-- Constraints for table `scholarshipregistrations`
--
ALTER TABLE `scholarshipregistrations`
  ADD CONSTRAINT `scholarshipregistrations_ibfk_1` FOREIGN KEY (`scholarship_id`) REFERENCES `scholarships` (`scholarship_id`),
  ADD CONSTRAINT `scholarshipregistrations_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `scholarshiprequirement`
--
ALTER TABLE `scholarshiprequirement`
  ADD CONSTRAINT `scholarshiprequirement_ibfk_1` FOREIGN KEY (`scholarship_organ_id`) REFERENCES `scholarshiporganization` (`scholarship_organ_id`),
  ADD CONSTRAINT `scholarshiprequirement_ibfk_2` FOREIGN KEY (`skill_type_id`) REFERENCES `skilltypes` (`skill_type_id`);

--
-- Constraints for table `skills_skilltypes`
--
ALTER TABLE `skills_skilltypes`
  ADD CONSTRAINT `skills_skilltypes_ibfk_1` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`),
  ADD CONSTRAINT `skills_skilltypes_ibfk_2` FOREIGN KEY (`skill_type_id`) REFERENCES `skilltypes` (`skill_type_id`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `studentskills`
--
ALTER TABLE `studentskills`
  ADD CONSTRAINT `studentskills_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `studentskills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
