import promisePool from "../lib/db";

class ScholarshipRegistrations {
  constructor(
    regist_id,
    student_id,
    scholarship_id,
    related_works,
    student_status = "รอดำเนินการ"
  ) {
    this.regist_id = regist_id;
    this.student_id = student_id;
    this.scholarship_id = scholarship_id;
    this.related_works = related_works;
    this.student_status = student_status;
  }

  // Create a new scholarship registration
  static async create(
    student_id,
    scholarship_id,
    related_works,
    student_status = "Pending"
  ) {
    try {
      const [result] = await promisePool.query(
        `INSERT INTO scholarshipregistrations (student_id, scholarship_id, related_works, student_status) 
         VALUES (?, ?, ?, ?)`,
        [student_id, scholarship_id, related_works, student_status = "Pending"]
      );
      return result.insertId; // Return the ID of the created registration
    } catch (error) {
      console.error("Error creating scholarship registration:", error);
      throw error;
    }
  }

  // Find a single registration by student_id and scholarship_id
  static async findOne({ student_id, scholarship_id }) {
    try {
      const [rows] = await promisePool.query(
        `SELECT * FROM scholarshipregistrations WHERE student_id = ? AND scholarship_id = ?`,
        [student_id, scholarship_id]
      );
      return rows.length > 0 ? rows[0] : null; // Return the found record or null if not found
    } catch (error) {
      console.error("Error finding scholarship registration:", error);
      throw error;
    }
  }

  // Find and update registration by regist_id
  static async findOneAndUpdate({ regist_id }, updateData) {

    const student_status = updateData.student_status || "Pending"; // ใช้ค่าเริ่มต้นเป็น Pending ถ้า student_status ไม่มีค่า
    try {
      const [result] = await promisePool.query(
        `UPDATE scholarshipregistrations 
           SET related_works = ? , student_status = ?
           WHERE regist_id = ?`,
        [updateData.related_works, student_status, regist_id]
      );

      if (result.affectedRows === 0) {
        return null; // ไม่มีการอัปเดตเนื่องจากไม่พบ regist_id ที่ระบุ
      }

      return { regist_id, ...updateData };
    } catch (error) {
      console.error("Error updating scholarship registration:", error);
      throw error;
    }
  }

  // ใช้ตอน showStudentScholarships ดึงข้อมูลสมัครทุนทั้งหมด
  static async findByIdALL(student_id) {
    try {
      const [rows] = await promisePool.query(
        "SELECT * FROM scholarshipregistrations JOIN scholarships ON scholarships.scholarship_id = scholarshipregistrations.scholarship_id JOIN student ON student.student_id = scholarshipregistrations.student_id WHERE scholarshipregistrations.student_id = ?",
        [student_id]
      );

      return rows || null;
    } catch (error) {
      console.error("Error fetching student:", error);
      return null;
    }
  }

  // ใช้ดึงข้อมูล edit ตอน student
  static async findById(regist_id) {
    try {
      const [rows] = await promisePool.query(
        `
        SELECT 
          scholarshipregistrations.*, 
          student.*,
          datetimeavailable.date_available, 
          datetimeavailable.is_parttime, 
          datetimeavailable.regist_id,
          scholarships.academic_year,
          scholarships.academic_term
        FROM scholarshipregistrations
        inner JOIN datetimeavailable ON scholarshipregistrations.regist_id = datetimeavailable.regist_id
        inner JOIN scholarships ON scholarshipregistrations.scholarship_id = scholarships.scholarship_id
        inner JOIN student ON student.student_id = scholarshipregistrations.student_id
        WHERE datetimeavailable.regist_id = ?
      `,
        [regist_id]
      );

      if (rows.length === 0) {
        return null;
      }

      const registration = {
        regist_id: rows[0].regist_id,
        scholarship_id: rows[0].scholarship_id,
        student_id: rows[0].student_id,
        related_works: rows[0].related_works,
        student_status: rows[0].student_status,
        academic_year: rows[0].academic_year,
        academic_term: rows[0].academic_term,
        student_firstname: rows[0].student_firstname,
        student_lastname: rows[0].student_lastname,
        student_faculty: rows[0].student_faculty,
        student_curriculum: rows[0].student_curriculum,
        student_year: rows[0].student_year,
        student_phone: rows[0].student_phone,
        student_gpa: rows[0].student_gpa,
        datetime_available: rows.map((row) => ({
          date_available: row.date_available,
          is_parttime: row.is_parttime,
          regist_id: row.regist_id,
        })),
      };

      return registration;
    } catch (error) {
      console.error("Error finding registration by ID:", error);
      throw error;
    }
  }

  // Method to delete a scholarship by its ID
  static async delete(regist_id) {
    const [result] = await promisePool.query(
      "DELETE FROM scholarshipregistrations WHERE regist_id = ?",
      [regist_id]
    );
    return result;
  }

  //ใช้ show หน้า showScholarshipAll\route.js
  static async findByIdShowScholarReGist(scholarship_id) {
    try {
      const [rows] = await promisePool.query(
        `
        SELECT 
          scholarshipregistrations.*, 
          student.*,
          datetimeavailable.date_available, 
          datetimeavailable.is_parttime, 
          datetimeavailable.regist_id,
          scholarships.academic_year,
          scholarships.academic_term
        FROM scholarshipregistrations
       JOIN datetimeavailable ON scholarshipregistrations.regist_id = datetimeavailable.regist_id
        JOIN scholarships ON scholarshipregistrations.scholarship_id = scholarships.scholarship_id
        JOIN student ON student.student_id = scholarshipregistrations.student_id
        WHERE scholarshipregistrations.scholarship_id = ?
      `,
        [scholarship_id]
      );

      if (rows.length === 0) {
        return null;
      }

      const registration = {
        regist_id: rows[0].regist_id,
        scholarship_id: rows[0].scholarship_id,
        student_id: rows[0].student_id,
        related_works: rows[0].related_works,
        student_status: rows[0].student_status,
        academic_year: rows[0].academic_year,
        academic_term: rows[0].academic_term,
        student_firstname: rows[0].student_firstname,
        student_lastname: rows[0].student_lastname,
        student_faculty: rows[0].student_faculty,
        student_curriculum: rows[0].student_curriculum,
        student_year: rows[0].student_year,
        student_phone: rows[0].student_phone,
        student_gpa: rows[0].student_gpa,
        datetime_available: rows.map((row) => ({
          date_available: row.date_available,
          is_parttime: row.is_parttime,
          regist_id: row.regist_id,
        })),
      };

      return rows;
    } catch (error) {
      console.error("Error finding registration by ID:", error);
      throw error;
    }
  }

  static async getGenPDF( scholarship_id,organization_id) {
    try {
      const [rows] = await promisePool.query(`
            SELECT *
            FROM scholarshipregistrations
           inner JOIN scholarships ON scholarshipregistrations.scholarship_id = scholarships.scholarship_id
           inner JOIN student ON scholarshipregistrations.student_id = student.student_id
           INNER JOIN scholarshiporganization ON scholarships.scholarship_id = scholarshiporganization.scholarship_id
           INNER JOIN organization ON scholarshiporganization.organization_id = organization.organization_id
            WHERE scholarshipregistrations.student_status = 'Pass' AND scholarships.scholarship_id = ? AND scholarshiporganization.organization_id = ?
          `,[scholarship_id,organization_id]);
      return rows;
    } catch (error) {
      console.error("Error fetching getGenPDF:", error);
      throw new Error("Could not retrieve getGenPDF.");
    }
  }

  static async findByScholarshipIDOrganID({ scholarship_id, organization_id }) {
    try {
      console.log("Params:", { scholarship_id, organization_id });

      const [rows] = await promisePool.query(
        `SELECT *
            FROM scholarshipregistrations
            INNER JOIN student ON scholarshipregistrations.student_id = student.student_id
            INNER JOIN scholarships ON scholarshipregistrations.scholarship_id = scholarships.scholarship_id
            INNER JOIN scholarshiporganization ON scholarships.scholarship_id = scholarshiporganization.scholarship_id
            INNER JOIN datetimeavailable ON datetimeavailable.regist_id = scholarshipregistrations.regist_id
            INNER JOIN organization ON organization.organization_id = scholarshiporganization.organization_id
          WHERE scholarships.scholarship_id = ? AND scholarshiporganization.organization_id = ?;`,
        [scholarship_id, organization_id]
      );

      console.log("Query result:", rows);

      return rows || null;
    } catch (error) {
      console.error("Error finding scholarship registration:", error);
      throw error;
    }
  }

   // ฟังก์ชัน findOneAndUpdate ที่จะอัปเดตข้อมูลตาม regist_id
   static async findOneAndUpdateStatus({ regist_id }, updateData) {
    try {
      const { student_status } = updateData; // รับข้อมูล student_status ที่จะอัปเดต
      const [result] = await promisePool.query(
        `UPDATE scholarshipregistrations 
         SET student_status = ? 
         WHERE regist_id = ?`,
        [student_status, regist_id]
      );

      if (result.affectedRows === 0) {
        return null; // ไม่พบการอัปเดตหรือไม่พบ regist_id
      }

      // คืนค่าข้อมูลที่อัปเดตกลับมา
      return { regist_id, student_status };
    } catch (error) {
      console.error("Error updating scholarship registration:", error);
      throw error;
    }
  }

  // ใช้ดึงข้อมูล Matching
  static async findByIdEvaluate({scholarship_id, organization_id}) {
    try {
      // Query เพื่อดึงข้อมูลนักศึกษา พร้อมกับทักษะและระดับทักษะ
      const [rows] = await promisePool.query(`
        SELECT 
          student.student_id,
          student.student_firstname,
          student.student_lastname,
          student.student_faculty,
          student.student_curriculum,
          student.student_year,
          student.student_gpa,
          student.student_phone,
          scholarshipregistrations.student_status,
          student.join_org,
          scholarshipregistrations.regist_id,
          GROUP_CONCAT(DISTINCT skills.skill_name ORDER BY skills.skill_name ASC) AS skill_names,
          GROUP_CONCAT(DISTINCT studentskills.skill_level ORDER BY studentskills.skill_level ASC) AS skill_levels,
          datetimeavailable.date_available,
          organization.organization_name,
          scholarships.academic_year,
          scholarships.academic_term  
        FROM scholarshipregistrations
        INNER JOIN student ON scholarshipregistrations.student_id = student.student_id
        LEFT JOIN studentskills ON student.student_id = studentskills.student_id
        LEFT JOIN skills ON studentskills.skill_id = skills.skill_id
        INNER JOIN scholarships ON scholarshipregistrations.scholarship_id = scholarships.scholarship_id
        INNER JOIN scholarshiporganization ON scholarships.scholarship_id = scholarshiporganization.scholarship_id
        INNER JOIN datetimeavailable ON datetimeavailable.regist_id = scholarshipregistrations.regist_id
        INNER JOIN organization ON organization.organization_id = scholarshiporganization.organization_id
        WHERE scholarships.scholarship_id =? AND scholarshiporganization.organization_id =? AND scholarshipregistrations.student_status = 'Pending'
        GROUP BY 
          student.student_id, 
          student.join_org, 
          datetimeavailable.date_available, 
          organization.organization_name, 
          scholarshipregistrations.regist_id;`,
        [scholarship_id, organization_id]
      );
      

      if (rows.length === 0) {
        return null; // คืนค่า null หากไม่พบข้อมูลนักศึกษา
      }

      // จัดกลุ่มข้อมูลให้เป็นรูปแบบที่ใช้งานง่าย
      const student = {
        student_id: rows[0].student_id,
        student_firstname: rows[0].student_firstname,
        student_lastname: rows[0].student_lastname,
        student_faculty: rows[0].student_faculty,
        student_curriculum: rows[0].student_curriculum,
        student_year: rows[0].student_year,
        student_gpa: rows[0].student_gpa,
        student_phone: rows[0].student_phone,
        student_status: rows[0].student_status, // Use the correct field
        join_org: rows[0].join_org,
        skills: rows[0].skill_names ? rows[0].skill_names.split(",") : [], // Split skill names into an array
        skill_levels: rows[0].skill_levels
          ? rows[0].skill_levels.split(",")
          : [], // Split skill levels into an array
        date_available: rows[0].date_available,
        organization_name: rows[0].organization_name,
      };

      console.log(rows, "rows");

      return rows;
    } catch (error) {
      console.error("Error finding student by ID:", error);
      throw error; // ส่งต่อข้อผิดพลาด
    }
  }

  // ใช้ดึงข้อมูล Matching
  static async findByIdEditEvaluate({scholarship_id, organization_id}) {
    try {
      // Query เพื่อดึงข้อมูลนักศึกษา พร้อมกับทักษะและระดับทักษะ
      const [rows] = await promisePool.query(`
        SELECT 
          student.student_id,
          student.student_firstname,
          student.student_lastname,
          student.student_faculty,
          student.student_curriculum,
          student.student_year,
          student.student_gpa,
          student.student_phone,
          scholarshipregistrations.student_status,
          student.join_org,
          scholarshipregistrations.regist_id,
          GROUP_CONCAT(DISTINCT skills.skill_name ORDER BY skills.skill_name ASC) AS skill_names,
          GROUP_CONCAT(DISTINCT studentskills.skill_level ORDER BY studentskills.skill_level ASC) AS skill_levels,
          datetimeavailable.date_available,
          organization.organization_name,
           scholarships.academic_year,
          scholarships.academic_term  
        FROM scholarshipregistrations
        INNER JOIN student ON scholarshipregistrations.student_id = student.student_id
        LEFT JOIN studentskills ON student.student_id = studentskills.student_id
        LEFT JOIN skills ON studentskills.skill_id = skills.skill_id
        INNER JOIN scholarships ON scholarshipregistrations.scholarship_id = scholarships.scholarship_id
        INNER JOIN scholarshiporganization ON scholarships.scholarship_id = scholarshiporganization.scholarship_id
        INNER JOIN datetimeavailable ON datetimeavailable.regist_id = scholarshipregistrations.regist_id
        INNER JOIN organization ON organization.organization_id = scholarshiporganization.organization_id
        WHERE scholarships.scholarship_id =? AND scholarshiporganization.organization_id =? AND scholarshipregistrations.student_status != 'Pending'
        GROUP BY 
          student.student_id, 
          student.join_org, 
          datetimeavailable.date_available, 
          organization.organization_name, 
          scholarshipregistrations.regist_id;`,
        [scholarship_id, organization_id]
      );
      

      if (rows.length === 0) {
        return null; // คืนค่า null หากไม่พบข้อมูลนักศึกษา
      }

      // จัดกลุ่มข้อมูลให้เป็นรูปแบบที่ใช้งานง่าย
      const student = {
        student_id: rows[0].student_id,
        student_firstname: rows[0].student_firstname,
        student_lastname: rows[0].student_lastname,
        student_faculty: rows[0].student_faculty,
        student_curriculum: rows[0].student_curriculum,
        student_year: rows[0].student_year,
        student_gpa: rows[0].student_gpa,
        student_phone: rows[0].student_phone,
        student_status: rows[0].student_status, // Use the correct field
        join_org: rows[0].join_org,
        skills: rows[0].skill_names ? rows[0].skill_names.split(",") : [], // Split skill names into an array
        skill_levels: rows[0].skill_levels
          ? rows[0].skill_levels.split(",")
          : [], // Split skill levels into an array
        date_available: rows[0].date_available,
        organization_name: rows[0].organization_name,
      };

      console.log(rows, "rows");

      return rows;
    } catch (error) {
      console.error("Error finding student by ID:", error);
      throw error; // ส่งต่อข้อผิดพลาด
    }
  }

  //ใช้ดึงข้อมูลนิสิตก่อนแปลงเป็นตัวเลข
  static async findByStudentMatching({scholarship_id, organization_id}) {
    try {
      // Query เพื่อดึงข้อมูลนักศึกษา พร้อมกับทักษะและระดับทักษะ
      const [rows] = await promisePool.query(`
          SELECT student.student_id, student.join_org,student.student_gpa,
       GROUP_CONCAT(DISTINCT CONCAT(skilltypes.skill_type_name)) AS skilltypes,
       GROUP_CONCAT(DISTINCT CONCAT(studentskills.skill_level)) AS skill_level,
       datetimeavailable.is_parttime, datetimeavailable.date_available
FROM scholarshipregistrations
INNER JOIN studentskills ON studentskills.student_id = scholarshipregistrations.student_id
INNER JOIN student ON scholarshipregistrations.student_id = student.student_id
INNER JOIN skills ON studentskills.skill_id = skills.skill_id
INNER JOIN skills_skilltypes ON skills.skill_id = skills_skilltypes.skill_id
INNER JOIN skilltypes ON skilltypes.skill_type_id = skills_skilltypes.skill_type_id
INNER JOIN datetimeavailable ON scholarshipregistrations.regist_id = datetimeavailable.regist_id
INNER JOIN scholarships ON scholarships.scholarship_id = scholarshipregistrations.scholarship_id
INNER JOIN scholarshiporganization ON scholarshiporganization.scholarship_id = scholarships.scholarship_id
WHERE scholarships.scholarship_id = ? AND scholarshiporganization.organization_id = ?
GROUP BY student.student_id
`,
        [scholarship_id, organization_id]
      );
      
      if (rows.length === 0) {
        return null; // คืนค่า null หากไม่พบข้อมูลนักศึกษา
      }

      return rows;
    } catch (error) {
      console.error("Error finding student by ID:", error);
      throw error; // ส่งต่อข้อผิดพลาด
    }
  }

}

export default ScholarshipRegistrations;
