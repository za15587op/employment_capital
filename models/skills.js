
import promisePool from '../lib/db';

class Skills {
  constructor( skill_name) {
    this.skill_name = skill_name;
  }

  // เมธอดสำหรับดึงข้อมูลทักษะทั้งหมด
  static async getAll() {
    try {
      const [rows] = await promisePool.query("SELECT * FROM skills");
      return rows;
    } catch (error) {
      console.error("Error fetching skills:", error);
      throw new Error("Could not retrieve skills.");
    }
  }

  // เมธอดสำหรับสร้างข้อมูลทักษะใหม่ในตาราง skills
  static async create(skillData) {
    const { skill_id, skill_name } = skillData;
    const [result] = await promisePool.query(
      'INSERT INTO skills (skill_id, skill_name) VALUES (?, ?)',
      [skill_id, skill_name]
    );
    return result;
  }

  // เมธอดสำหรับค้นหาข้อมูลทักษะในตาราง skills โดยใช้ skill_id
  static async findById(skill_id) {
    const [rows] = await promisePool.query('SELECT * FROM skills WHERE skill_id = ?', [skill_id]);
    return rows[0];
  }

  // เมธอดสำหรับอัปเดตข้อมูลในตาราง skills โดยใช้ skill_id
  static async update(skill_id, updatedData) {
    const { skill_name } = updatedData;
    const [result] = await promisePool.query(
      'UPDATE skills SET skill_name = ? WHERE skill_id = ?',
      [skill_name, skill_id]
    );
    return result;
  }

  // เมธอดสำหรับลบข้อมูลในตาราง skills โดยใช้ skill_id
  static async delete(skill_id) {
    const [result] = await promisePool.query(
      'DELETE FROM skills WHERE skill_id = ?',
      [skill_id]
    );
    return result;
  }
}

export default Skills;
