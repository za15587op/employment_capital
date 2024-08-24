import promisePool from '../lib/db';

class ScholarshipRegistrations {
  constructor(std_id, scholarship_id, is_parttime) {
    this.std_id = std_id;
    this.scholarship_id = scholarship_id;
    this.is_parttime = is_parttime;
  }

  // Method to create a new scholarship registration entry
  static async create(registrationData) {
    const { std_id, scholarship_id, is_parttime } = registrationData;
    const [result] = await promisePool.query(
      'INSERT INTO scholarship_registrations (std_id, scholarship_id, is_parttime) VALUES (?, ?, ?)',
      [std_id, scholarship_id, is_parttime]
    );
    return result;
  }

  // Method to find a scholarship registration by student ID and scholarship ID
  static async findByIds(std_id, scholarship_id) {
    const [rows] = await promisePool.query(
      'SELECT * FROM scholarship_registrations WHERE std_id = ? AND scholarship_id = ?',
      [std_id, scholarship_id]
    );
    return rows[0];
  }

  // Method to update a scholarship registration by student ID and scholarship ID
  static async update(std_id, scholarship_id, updatedData) {
    const { is_parttime } = updatedData;
    const [result] = await promisePool.query(
      'UPDATE scholarship_registrations SET is_parttime = ? WHERE std_id = ? AND scholarship_id = ?',
      [is_parttime, std_id, scholarship_id]
    );
    return result;
  }

  // Method to delete a scholarship registration by student ID and scholarship ID
  static async delete(std_id, scholarship_id) {
    const [result] = await promisePool.query(
      'DELETE FROM scholarship_registrations WHERE std_id = ? AND scholarship_id = ?',
      [std_id, scholarship_id]
    );
    return result;
  }
}

export default ScholarshipRegistrations;
