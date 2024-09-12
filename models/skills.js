import promisePool from "../lib/db";

class Skills {
  constructor(skill_id, skill_name) {
    this.skill_id = skill_id;
    this.skill_name = skill_name;
  }

  // static async getSkillByName(name) {
  //   const [result] = await promisePool.query(
  //     `SELECT skill_id FROM skills WHERE skill_name = ?`,
  //     [name]
  //   );
  //   return result[0];
  // }

  // static async createSkills(name, typeId) {
  //   const [result] = await promisePool.query(
  //     `INSERT INTO skills (skill_name, skill_id) 
  //      VALUES (?, ?) 
  //      ON DUPLICATE KEY UPDATE skill_name = VALUES(skill_name)`,
  //     [name, typeId]
  //   );
  //   return result.insertId;
  // }

  // static async createSkill(skill_name) {
  //   // วนลูปเพื่อแทรกข้อมูลทักษะ (skills) เข้าในตาราง skills
  //   for (const skill of skills) {
  //     const [skillResult] = await connection.query(
  //       `INSERT INTO skills (skill_name) VALUES (?)`,
  //       [skill_name]
  //     );

  //       const skill_id = skillResult.insertId; // ใช้ insertId เพื่อรับ skill_id ที่เพิ่งเพิ่มเข้าไป
  //       skillIdMap[skill.skill_id] = skill_id; // สร้างแผนที่จาก skill_id เก่าไปยัง skill_id ใหม่
  //       console.log(skill_id, "skill_id");

  //       return skillIdMap;
  //   }
  // }
  // สร้างทักษะใหม่
  static async create(skillData) {
    const { skill_name } = skillData;
    try {
      const [result] = await promisePool.query(
        "INSERT INTO skills (skill_name) VALUES (?)",
        [skill_name]
      );
      return result;
    } catch (error) {
      console.error("Error creating skill:", error);
      throw new Error("Could not create skill.");
    }
  }

  // ค้นหาทักษะทั้งหมด
  static async findAll() {
    try {
      const [rows] = await promisePool.query("SELECT * FROM skills");
      return rows;
    } catch (error) {
      console.error("Error fetching skills:", error);
      throw new Error("Could not fetch skills.");
    }
  }

  // ค้นหาทักษะตาม ID
  static async findById(skill_id) {
    try {
      const [rows] = await promisePool.query(
        "SELECT * FROM skills WHERE skill_id = ?",
        [skill_id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Error fetching skill by ID:", error);
      throw new Error("Could not fetch skill.");
    }
  }
}


export default Skills;