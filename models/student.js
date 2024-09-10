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

  // static async getStudentById(student_id) {
  //   const [result] = await promisePool.query(
  //     `SELECT * FROM student WHERE student_id = ?`,
  //     [student_id]
  //   );
  //   return result[0];
  // }

  static async findByStudentId(user_id) {
    try {
      // คิวรีเพื่อค้นหาข้อมูลนักเรียนตาม user_id
      const [rows] = await promisePool.query("SELECT student_id FROM student WHERE user_id = ?", [user_id]);
      
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
      user_id
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

//   static async update(std_id, updatedData) {
//     const {
//       student_id,
//       student_firstname,
//       student_lastname,
//       student_faculty,
//       student_field,
//       student_curriculum,
//       student_year,
//       student_gpa,
//       student_phone,
//     } = updatedData;

//     try {
//       const [result] = await promisePool.query(
//         "UPDATE student SET student_id = ?, student_firstname = ?, student_lastname = ?, student_faculty = ?, student_field = ?, student_curriculum = ?, student_year = ?, student_gpa = ?, student_phone = ? WHERE std_id = ?",
//         [
//           student_id,
//           student_firstname,
//           student_lastname,
//           student_faculty,
//           student_field,
//           student_curriculum,
//           student_year,
//           student_gpa,
//           student_phone,
//           std_id,
//         ]
//       );
//       return result;
//     } catch (error) {
//       console.error(`Error updating student with ID ${std_id}:`, error);
//       throw new Error("Could not update student.");
//     }
//   }


//   static async delete(std_id) {
//     try {
//       const [result] = await promisePool.query(
//         "DELETE FROM student WHERE std_id = ?",
//         [std_id]
//       );
//       return result;
//     } catch (error) {
//       console.error(`Error deleting student with ID ${std_id}:`, error);
//       throw new Error("Could not delete student.");
//     }
//   }
}

export default Student;