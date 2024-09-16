import promisePool from "../lib/db";

class ScholarshipRegistrations {
  constructor(regist_id, student_id, scholarship_id, related_works, student_status = 'รอดำเนินการ') {
    this.regist_id = regist_id;
    this.student_id = student_id;
    this.scholarship_id = scholarship_id;
    this.related_works = related_works;
    this.student_status = student_status;
  }

  // Create a new scholarship registration
  static async create(student_id, scholarship_id, related_works, student_status = 'รอดำเนินการ') {
    try {
      const [result] = await promisePool.query(
        `INSERT INTO scholarshipregistrations (student_id, scholarship_id, related_works, student_status) 
         VALUES (?, ?, ?, ?)`,
        [student_id, scholarship_id, related_works, student_status]
      );
      return result.insertId; // Return the ID of the created registration
    } catch (error) {
      console.error('Error creating scholarship registration:', error);
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
      console.error('Error finding scholarship registration:', error);
      throw error;
    }
  }

    // Find and update registration by regist_id
    static async findOneAndUpdate({ regist_id }, updateData) {
      try {
        const [result] = await promisePool.query(
          `UPDATE scholarshipregistrations 
           SET related_works = ?
           WHERE regist_id = ?`,
          [updateData.related_works, regist_id]
        );
  
        if (result.affectedRows === 0) {
          return null; // ไม่มีการอัปเดตเนื่องจากไม่พบ regist_id ที่ระบุ
        }
  
        return { regist_id, ...updateData };
      } catch (error) {
        console.error('Error updating scholarship registration:', error);
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
      console.error('Error fetching student:', error);
      return null;
    }
  }

  // ใช้ดึงข้อมูล edit ตอน student
  static async findById(regist_id) {
    try {
      const [rows] = await promisePool.query(`
        SELECT 
          scholarshipregistrations.*, 
          datetimeavailable.date_available, 
          datetimeavailable.is_parttime, 
          datetimeavailable.start_time,
          datetimeavailable.end_time,
          datetimeavailable.regist_id,
          scholarships.academic_year,
          scholarships.academic_term
        FROM scholarshipregistrations
        JOIN datetimeavailable ON scholarshipregistrations.regist_id = datetimeavailable.regist_id
        JOIN scholarships ON scholarshipregistrations.scholarship_id = scholarships.scholarship_id
        WHERE datetimeavailable.regist_id = ?
      `, [regist_id]);

      if (rows.length === 0) {
        return null;
      }

      const registration = {
        regist_id: rows[0].regist_id,
        scholarship_id: rows[0].scholarship_id,
        student_id: rows[0].student_id,
        related_works: rows[0].related_works,
        student_status: rows[0].student_status,
        academic_year:rows[0].academic_year,
        academic_term:rows[0].academic_term,
        datetime_available: rows.map(row => ({
          date_available: row.date_available,
          is_parttime: row.is_parttime,
          start_time: row.start_time,
          end_time: row.end_time,
          regist_id: row.regist_id
        }))
      };

      return registration;
    } catch (error) {
      console.error('Error finding registration by ID:', error);
      throw error;
    }
  }

  // Method to delete a scholarship by its ID
  static async delete(regist_id) {
    const [result] = await promisePool.query('DELETE FROM scholarshipregistrations WHERE regist_id = ?', [regist_id]);
    return result;
  }

}

export default ScholarshipRegistrations;
