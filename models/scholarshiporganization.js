import promisePool from '../lib/db';

class ScholarshipOrganization {
  constructor(scholarship_organ_id, scholarship_id, organization_id, amount, required_parttime) {
    this.scholarship_organ_id = scholarship_organ_id;
    this.scholarship_id = scholarship_id;
    this.organization_id = organization_id;
    this.amount = amount;
    this.required_parttime = required_parttime;
  }
  static async getAll() {
    try {
      const [rows] = await promisePool.query("SELECT * FROM scholarshiporganization");
      return rows;
    } catch (error) {
      console.error("Error fetching scholarshiporganization:", error);
      throw new Error("Could not retrieve scholarshiporganization.");
    }
  }


  // เมธอดสำหรับสร้างข้อมูลใหม่ในตาราง scholarshiporganization
  static async create(organizationData) {
    const { scholarship_organ_id, scholarship_id, organization_id, amount, required_parttime } = organizationData;
    const [result] = await promisePool.query(
      'INSERT INTO scholarshiporganization (scholarship_organ_id, scholarship_id, organization_id, amount, required_parttime) VALUES (?, ?, ?, ?, ?)',
      [scholarship_organ_id, scholarship_id, organization_id, amount, required_parttime]
    );
    return result;
  }

  // เมธอดสำหรับค้นหาข้อมูลในตาราง scholarshiporganization โดยใช้ scholarship_organ_id
  static async findById(scholarship_organ_id) {
    const [rows] = await promisePool.query('SELECT * FROM scholarshiporganization WHERE scholarship_organ_id = ?', [scholarship_organ_id]);
    return rows[0];
  }

  // เมธอดสำหรับอัปเดตข้อมูลในตาราง scholarshiporganization โดยใช้ scholarship_organ_id
  static async update(scholarship_organ_id, updatedData) {
    const { scholarship_id, organization_id, amount, required_parttime } = updatedData;
    const [result] = await promisePool.query(
      'UPDATE scholarshiporganization SET scholarship_id = ?, organization_id = ?, amount = ?, required_parttime = ? WHERE scholarship_organ_id = ?',
      [scholarship_id, organization_id, amount, required_parttime, scholarship_organ_id]
    );
    return result;
  }

  // เมธอดสำหรับลบข้อมูลในตาราง scholarshiporganization โดยใช้ scholarship_organ_id
  static async delete(scholarship_organ_id) {
    const [result] = await promisePool.query(
      'DELETE FROM scholarshiporganization WHERE scholarship_organ_id = ?',
      [scholarship_organ_id]
    );
    return result;
  }
}


export default ScholarshipOrganization;