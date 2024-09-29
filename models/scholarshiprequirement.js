import promisePool from '../lib/db';

class ScholarshipRequirement {
  constructor(scholarship_requirement_id, scholarship_organ_id, skill_type_id, required_level) {
    this.scholarship_requirement_id = scholarship_requirement_id;
    this.scholarship_organ_id = scholarship_organ_id;
    this.skill_type_id = skill_type_id;
    this.required_level = required_level;
  }

  // ฟังก์ชันสำหรับสร้างข้อมูลใหม่ในตาราง `scholarshiprequirement`
  static async create({ scholarship_organ_id, skill_type_id, required_level }) {
    try {
      const [result] = await promisePool.query(
        'INSERT INTO scholarshiprequirement (scholarship_organ_id, skill_type_id, required_level) VALUES (?, ?, ?)',
        [scholarship_organ_id, skill_type_id, required_level]
      );
      return new ScholarshipRequirement(result.insertId, scholarship_organ_id, skill_type_id, required_level);
    } catch (error) {
      console.error('Error creating ScholarshipRequirement:', error);
      throw error;
    }
  }
}

export default ScholarshipRequirement;


// import promisePool from '../lib/db';

// class ScholarshipRequirement {
//   constructor(scholarship_requirement_id, scholarship_organ_id, skill_type_id, required_level) {
//     this.scholarship_requirement_id = scholarship_requirement_id;
//     this.scholarship_organ_id = scholarship_organ_id;
//     this.skill_type_id = skill_type_id;
//     this.required_level = required_level;
//   }

//   // เมธอดสำหรับดึงข้อมูลทั้งหมดจากตาราง scholarshiprequirement
//   static async getAll() {
//     try {
//       const [rows] = await promisePool.query("SELECT * FROM scholarshiprequirement");
//       return rows;
//     } catch (error) {
//       console.error("Error fetching scholarshiprequirement:", error);
//       throw new Error("Could not retrieve scholarshiprequirement.");
//     }
//   }

//   static async create(requirementData) {
//     const { scholarship_organ_id, skill_type_id, required_level } = requirementData;
//     const [result] = await promisePool.query(
//       'INSERT INTO scholarshiprequirement (scholarship_organ_id, skill_type_id, required_level) VALUES (?, ?, ?)',
//       [scholarship_organ_id, skill_type_id, required_level]
//     );
//     return result;
//   }

//   // เมธอดสำหรับค้นหาข้อมูลในตาราง scholarshiprequirement โดยใช้ scholarship_requirement_id
//   static async findById(scholarship_requirement_id) {
//     const [rows] = await promisePool.query(
//       'SELECT * FROM scholarshiprequirement WHERE scholarship_requirement_id = ?',
//       [scholarship_requirement_id]
//     );
//     return rows[0];
//   }

//   // เมธอดสำหรับอัปเดตข้อมูลในตาราง scholarshiprequirement โดยใช้ scholarship_requirement_id
//   static async update(scholarship_requirement_id, updatedData) {
//     const { scholarship_organ_id, skill_type_id, required_level } = updatedData;
//     const [result] = await promisePool.query(
//       'UPDATE scholarshiprequirement SET scholarship_organ_id = ?, skill_type_id = ?, required_level = ? WHERE scholarship_requirement_id = ?',
//       [scholarship_organ_id, skill_type_id, required_level, scholarship_requirement_id]
//     );
//     return result;
//   }

//   // เมธอดสำหรับลบข้อมูลในตาราง scholarshiprequirement โดยใช้ scholarship_requirement_id
//   static async delete(scholarship_requirement_id) {
//     const [result] = await promisePool.query(
//       'DELETE FROM scholarshiprequirement WHERE scholarship_requirement_id = ?',
//       [scholarship_requirement_id]
//     );
//     return result;
//   }
// }

// export default ScholarshipRequirement;
