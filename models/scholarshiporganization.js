import promisePool from "@/lib/db";  // If you're using absolute imports configured in Next.js

class ScholarshipOrganization {
  constructor(scholarship_organ_id, scholarship_id, organization_id, amount, workType, workTime) {
    this.scholarship_organ_id = scholarship_organ_id;
    this.scholarship_id = scholarship_id;
    this.organization_id = organization_id;
    this.amount = amount;
    this.workType = workType;
    this.workTime = workTime;
    
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
    const { scholarship_organ_id, scholarship_id, organization_id, amount, workType, workTime } = organizationData;
    const [result] = await promisePool.query(
      'INSERT INTO scholarshiporganization (scholarship_organ_id, scholarship_id, organization_id, amount, workType, workTime) VALUES (?, ?, ?, ?, ?, ?)',
      [scholarship_organ_id, scholarship_id, organization_id, amount, workType, workTime]
    );
    return result;
  }

  // เมธอดสำหรับค้นหาข้อมูลในตาราง scholarshiporganization โดยใช้ scholarship_organ_id
  static async findScholarshipId(scholarship_organ_id) {
    const [rows] = await promisePool.query('SELECT * FROM scholarshiporganization WHERE scholarship_organ_id = ?', [scholarship_organ_id]);
    return rows[0];
  }

  // เมธอดสำหรับอัปเดตข้อมูลในตาราง scholarshiporganization โดยใช้ scholarsship_organ_id
  static async update(scholarship_organ_id, updatedData) {
    const { scholarship_id, organization_id, amount, workType, workTime } = updatedData;
    const [result] = await promisePool.query(
      'UPDATE scholarshiporganization SET scholarship_id = ?, organization_id = ?, amount = ?, workType = ?, workTime = ? WHERE scholarship_organ_id = ?',
      [scholarship_id, organization_id, amount, workType, workTime, scholarship_organ_id]
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