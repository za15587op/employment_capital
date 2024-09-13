import promisePool from '../lib/db';

class ScholarshipRegistrations {
  constructor(regist_id, student_id, scholarship_id, related_works, student_status = 'Pending') {
    this.regist_id = regist_id;
    this.student_id = student_id;
    this.scholarship_id = scholarship_id;
    this.related_works = related_works;
    this.student_status = student_status;
  }

  // Create a new scholarship registration
  static async create(student_id, scholarship_id, related_works, student_status = 'Pending') {
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
}

export default ScholarshipRegistrations;
