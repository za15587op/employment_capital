import promisePool from "../lib/db";

class Student {
  constructor(
    user_id, // Save the user_id as FK
    student_id,
    student_firstname,
    student_lastname,
    student_faculty,
    student_field,
    student_curriculum,
    student_year,
    student_gpa,
    student_phone
  ) {
    this.user_id = user_id;
    this.student_id = student_id;
    this.student_firstname = student_firstname;
    this.student_lastname = student_lastname;
    this.student_faculty = student_faculty;
    this.student_field = student_field;
    this.student_curriculum = student_curriculum;
    this.student_year = student_year;
    this.student_gpa = student_gpa;
    this.student_phone = student_phone;
    this.user_id = user_id;
  }


  //ตอน เช็ค login
  static async findByStudentId(user_id) {
    try {
      // คิวรีเพื่อค้นหาข้อมูลนักเรียนตาม user_id
      const [rows] = await promisePool.query
      ("SELECT student_id FROM student WHERE user_id = ?", [user_id]);
      
      // คืนค่าข้อมูลที่พบ หรือ null หากไม่มีข้อมูล
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching student:', error);
      return null;
    }
  }

  static async create(studentData) {
    const {
      student_id,
      student_firstname,
      student_lastname,
      student_faculty,
      student_field,
      student_curriculum,
      student_year,
      student_gpa,
      student_phone,
      user_id,
    } = studentData;

    try {
      const [result] = await promisePool.query(
        "INSERT INTO student ( student_id, student_firstname, student_lastname, student_faculty, student_field, student_curriculum, student_year, student_gpa, student_phone, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          student_id,
          student_firstname,
          student_lastname,
          student_faculty,
          student_field,
          student_curriculum,
          student_year,
          student_gpa,
          student_phone,
          user_id
        ]
      );
      return result;
      
    } catch (error) {
      console.error("Error creating student:", error);
      throw new Error("Could not create student.");
    }
  }


  // ใช้ดึงข้อมูลedit ตอน student 
  static async findById(student_id) {
    try {
      // Query เพื่อดึงข้อมูลนักศึกษา พร้อมกับทักษะและระดับทักษะ
      const [rows] = await promisePool.query(`
        SELECT 
          student.*, 
          skills.skill_name, 
          studentskills.skill_level, 
          skilltypes.skill_type_name 
        FROM student
        LEFT JOIN studentskills ON student.student_id = studentskills.student_id
        LEFT JOIN skills ON studentskills.skill_id = skills.skill_id
        LEFT JOIN skills_skilltypes ON skills.skill_id = skills_skilltypes.skill_id
        LEFT JOIN skilltypes ON skilltypes.skill_type_id = skills_skilltypes.skill_type_id
        WHERE student.student_id = ?
      `, [student_id]);

      if (rows.length === 0) {
        return null; // คืนค่า null หากไม่พบข้อมูลนักศึกษา
      }

      // จัดกลุ่มข้อมูลให้เป็นรูปแบบที่ใช้งานง่าย
      const student = {
        student_id: rows[0].student_id,
        student_firstname: rows[0].student_firstname,
        student_lastname: rows[0].student_lastname,
        student_faculty: rows[0].student_faculty,
        student_field: rows[0].student_field,
        student_curriculum: rows[0].student_curriculum,
        student_year: rows[0].student_year,
        student_gpa: rows[0].student_gpa,
        student_phone: rows[0].student_phone,
        skills: rows.map(row => ({
          skill_name: row.skill_name
        })),
        studentSkills: rows.map(row =>({
          skill_level: row.skill_level,
        })),
        selectedSkillTypes: rows.map(row =>({
          skill_type_name: row.skill_type_name
        }))
      
      };

      return student;
    } catch (error) {
      console.error('Error finding student by ID:', error);
      throw error; // ส่งต่อข้อผิดพลาด
    }
  }


  static async update(student_id, studentData, skills, studentSkills, selectedSkillTypes) {
    const connection = await promisePool.getConnection();

    try {
      await connection.beginTransaction(); // เริ่ม Transaction

      // อัปเดตข้อมูลนักศึกษาในตาราง student
      await connection.query(
        `
        UPDATE student 
        SET student_firstname = ?, student_lastname = ?, student_faculty = ?, 
            student_field = ?, student_curriculum = ?, student_year = ?, 
            student_gpa = ?, student_phone = ?
        WHERE student_id = ?
        `,
        [
          studentData.student_firstname,
          studentData.student_lastname,
          studentData.student_faculty,
          studentData.student_field,
          studentData.student_curriculum,
          studentData.student_year,
          studentData.student_gpa,
          studentData.student_phone,
          student_id
        ]
      );

      // ลบข้อมูลทักษะเดิมที่เกี่ยวข้องกับ student_id
      await connection.query(
        "DELETE FROM studentskills WHERE student_id = ?", [student_id]
      );

      // เพิ่มทักษะใหม่ใน student_skills
      for (let i = 0; i < skills.length; i++) {
        const { skill_name } = skills[i];
        const { skill_level } = studentSkills[i];
        const { skill_type_id } = selectedSkillTypes[i];

        // อัปเดตทักษะและเชื่อมโยงกับ student_skills
        const [skillResult] = await connection.query(
          "SELECT skill_id FROM skills WHERE skill_name = ?", [skill_name]
        );

        let skill_id;
        if (skillResult.length > 0) {
          skill_id = skillResult[0].skill_id;
        } else {
          const [insertSkillResult] = await connection.query(
            "INSERT INTO skills (skill_name) VALUES (?)", [skill_name]
          );
          skill_id = insertSkillResult.insertId;
        }

        // เพิ่มข้อมูลลงใน student_skills
        await connection.query(
          "INSERT INTO studentskills (student_id, skill_id, skill_level) VALUES (?, ?, ?)",
          [student_id, skill_id, skill_level]
        );

        // ตรวจสอบว่า skill_type_id ไม่เป็น NULL ก่อนทำการ INSERT
      if (skill_type_id) {
        await connection.query(
          "INSERT INTO skills_skilltypes (skill_id, skill_type_id) VALUES (?, ?)",
          [skill_id, skill_type_id]
        );
      }
      
      }

      await connection.commit(); // ยืนยันการทำงาน (Commit)
      return { success: true };
    } catch (error) {
      await connection.rollback(); // ย้อนกลับการทำงานหากเกิดข้อผิดพลาด
      console.error('Error updating student:', error);
      throw error;
    } finally {
      connection.release(); // ปิดการเชื่อมต่อ
    }
  }

  // //ใช้ตอน showStudentScholarships
  // static async findByIdALL(student_id) {
  //   try {
  //     // คิวรีเพื่อค้นหาข้อมูลนักเรียนตาม student_id
  //     const [rows] = await promisePool.query("SELECT * FROM student WHERE student_id = ?", [student_id]);
      
  //     // คืนค่าข้อมูลที่พบ หรือ null หากไม่มีข้อมูล
  //     return rows || null;
  //   } catch (error) {
  //     console.error('Error fetching student:', error);
  //     return null;
  //   }
  // }



}

export default Student;