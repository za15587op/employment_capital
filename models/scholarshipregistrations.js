import promisePool from '../lib/db';

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


//ใช้ตอน showStudentScholarships ดึงข้อมูลสมัครทุนทั้งหมด
static async findByIdALL(student_id) {
  try {
    // คิวรีเพื่อค้นหาข้อมูลนักเรียนตาม student_id
    const [rows] = await promisePool.query(
      "SELECT * FROM scholarshipregistrations JOIN scholarships ON scholarships.scholarship_id = scholarshipregistrations.scholarship_id JOIN student ON student.student_id = scholarshipregistrations.student_id WHERE scholarshipregistrations.student_id = ?", [student_id]);
    
    // คืนค่าข้อมูลที่พบ หรือ null หากไม่มีข้อมูล
    return rows || null;
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
}


  // ใช้ดึงข้อมูลedit ตอน student 
  static async findById(regist_id) {
    try {
      // Query เพื่อดึงข้อมูลนักศึกษา พร้อมกับทักษะและระดับทักษะ
      const [rows] = await promisePool.query(`
        SELECT 
          scholarshipregistrations.*, 
          datetimeavailable.date_available, 
          datetimeavailable.is_parttime, 
          datetimeavailable.start_time,
          datetimeavailable.end_time,
          datetimeavailable.regist_id
        FROM scholarshipregistrations
        JOIN datetimeavailable ON scholarshipregistrations.regist_id = datetimeavailable.regist_id
        WHERE datetimeavailable.regist_id = ?
      `, [regist_id]);

      if (rows.length === 0) {
        return null; // คืนค่า null หากไม่พบข้อมูลนักศึกษา
      }

      // จัดกลุ่มข้อมูลให้เป็นรูปแบบที่ใช้งานง่าย
      const registration = {
        regist_id: rows[0].regist_id,
        scholarship_id: rows[0].scholarship_id,
        student_id: rows[0].student_id,
        related_works: rows[0].related_works,
        student_status: rows[0].student_status,
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
      throw error; // ส่งต่อข้อผิดพลาด
    }
  }
}

export default ScholarshipRegistrations;
