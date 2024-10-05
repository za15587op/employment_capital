import promisePool from '../lib/db';

class ScholarshipOrganization {
  constructor(scholarship_organ_id, scholarship_id, organization_id, amount, workType, workTime) {
    this.scholarship_organ_id = scholarship_organ_id;
    this.scholarship_id = scholarship_id;
    this.organization_id = organization_id;
    this.amount = amount;
    this.workType = workType;
    this.workTime = workTime;
  }

 // ฟังก์ชันสร้างข้อมูลใหม่ในตาราง scholarshiporganization
 static async create({ scholarship_id, organization_id, amount, workType, workTime }) {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO scholarshiporganization (scholarship_id, organization_id, amount, workType, workTime) VALUES (?, ?, ?, ?, ?)',
      [scholarship_id, organization_id, amount, workType, workTime]
    );
    // คืนค่า insertId เพื่อใช้เป็น scholarship_organ_id
    return { insertId: result.insertId };
  } catch (error) {
    console.error('Error creating ScholarshipOrganization:', error);
    throw error;
  }
}

  // ฟังก์ชันค้นหาข้อมูล ScholarshipOrganization โดยใช้เงื่อนไข
  static async findOne({ scholarship_id, organization_id }) {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM scholarshiporganization WHERE scholarship_id = ? AND organization_id = ?',
        [scholarship_id, organization_id]
      );
      if (rows.length > 0) {
        const { scholarship_organ_id, scholarship_id, organization_id, amount, workType, workTime } = rows[0];
        return new ScholarshipOrganization(scholarship_organ_id, scholarship_id, organization_id, amount, workType, workTime);
      }
      return null;
    } catch (error) {
      console.error('Error finding ScholarshipOrganization:', error);
      throw error;
    }
  }

   //ใช้ดึงข้อมูลนิสิตก่อนแปลงเป็นตัวเลข
   static async findByOrgMatching({scholarship_id, organization_id}) {
    try {
      // Query เพื่อดึงข้อมูลนักศึกษา พร้อมกับทักษะและระดับทักษะ
      const [rows] = await promisePool.query(`
          SELECT organization.organization_name, scholarshiporganization.amount, 
               skilltypes.skill_type_name, scholarshiporganization.workType, 
               scholarshiporganization.workTime, scholarshiprequirement.required_level
        FROM organization
        INNER JOIN scholarshiporganization ON scholarshiporganization.organization_id = organization.organization_id
        INNER JOIN scholarshiprequirement ON scholarshiporganization.scholarship_organ_id = scholarshiprequirement.scholarship_organ_id
        INNER JOIN skilltypes ON scholarshiprequirement.skill_type_id = skilltypes.skill_type_id
        WHERE scholarshiporganization.scholarship_id =? AND scholarshiporganization.organization_id =?`,
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

export default ScholarshipOrganization;
