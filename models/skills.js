import promisePool from "../lib/db";

class Skills {
  constructor(skill_id, skill_name) {
    this.skill_id = skill_id;
    this.skill_name = skill_name;
  }

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