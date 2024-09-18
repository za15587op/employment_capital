import promisePool from "../lib/db";

class Skills_SkillTypes {
  constructor(skill_id, skill_type_id) {
    this.skill_id = skill_id;
    this.skill_type_id = skill_type_id;
  }


  // สร้างข้อมูลการเชื่อมโยงระหว่างทักษะและประเภทของทักษะ
  static async create(skillSkillTypeData) {
    const { skill_id, skill_type_id } = skillSkillTypeData;
    try {
      const [result] = await promisePool.query(
        "INSERT INTO skills_skilltypes (skill_id, skill_type_id) VALUES (?, ?)",
        [skill_id, skill_type_id]
      );
      return result;
    } catch (error) {
      console.error("Error creating skill-skill type relationship:", error);
      throw new Error("Could not create skill-skill type relationship.");
    }
  }

  // ค้นหาการเชื่อมโยงระหว่างทักษะและประเภทของทักษะทั้งหมด
  static async findAll() {
    try {
      const [rows] = await promisePool.query("SELECT * FROM skills_skilltypes");
      return rows;
    } catch (error) {
      console.error("Error fetching skill-skill type relationships:", error);
      throw new Error("Could not fetch skill-skill type relationships.");
    }
  }
}

export default Skills_SkillTypes;