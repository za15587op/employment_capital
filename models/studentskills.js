import promisePool from "../lib/db";

class StudentSkills {
  constructor(std_id, skill_id, skill_level) {
    this.std_id = std_id;
    this.skill_id = skill_id;
    this.skill_level = skill_level;
  }

  static async getAll() {
    try {
      const [rows] = await promisePool.query("SELECT * FROM StudentSkills");
      return rows;
    } catch (error) {
      console.error("Error fetching all student skills:", error);
      throw new Error("Could not retrieve student skills.");
    }
  }

  static async findByStudentId(std_id) {
    try {
      const [rows] = await promisePool.query(
        "SELECT * FROM StudentSkills WHERE std_id = ?",
        [std_id]
      );
      return rows;
    } catch (error) {
      console.error(`Error fetching skills for student ID ${std_id}:`, error);
      throw new Error("Could not retrieve student skills.");
    }
  }

  static async create(studentSkillData) {
    const { std_id, skill_id, skill_level } = studentSkillData;

    try {
      const [result] = await promisePool.query(
        "INSERT INTO StudentSkills (std_id, skill_id, skill_level) VALUES (?, ?, ?)",
        [std_id, skill_id, skill_level]
      );
      return { id: result.insertId, ...studentSkillData }; // คืนค่าข้อมูลที่ถูกสร้างใหม่
    } catch (error) {
      console.error("Error creating student skill:", error);
      throw new Error("Could not create student skill.");
    }
  }

  static async update(std_id, skill_id, updatedData) {
    const { skill_level } = updatedData;

    try {
      const [result] = await promisePool.query(
        "UPDATE StudentSkills SET skill_level = ? WHERE std_id = ? AND skill_id = ?",
        [skill_level, std_id, skill_id]
      );
      return { affectedRows: result.affectedRows, ...updatedData }; // คืนค่าข้อมูลที่ถูกอัปเดต
    } catch (error) {
      console.error(`Error updating skill for student ID ${std_id} and skill ID ${skill_id}:`, error);
      throw new Error("Could not update student skill.");
    }
  }

  static async delete(std_id, skill_id) {
    try {
      const [result] = await promisePool.query(
        "DELETE FROM StudentSkills WHERE std_id = ? AND skill_id = ?",
        [std_id, skill_id]
      );
      return result;
    } catch (error) {
      console.error(`Error deleting skill for student ID ${std_id} and skill ID ${skill_id}:`, error);
      throw new Error("Could not delete student skill.");
    }
  }
}

export default StudentSkills;
