// import promisePool from "../lib/db";

// class Skills {
//   constructor(skill_id, skill_name, skill_type) {
//     this.skill_id = skill_id;
//     this.skill_name = skill_name;
//     this.skill_type = skill_type;
//   }

//   static async getAll() {
//     try {
//       const [rows] = await promisePool.query("SELECT * FROM Skills");
//       return rows;
//     } catch (error) {
//       console.error("Error fetching all skills:", error);
//       throw new Error("Could not retrieve skills.");
//     }
//   }

//   static async findById(skill_id) {
//     try {
//       const [rows] = await promisePool.query(
//         "SELECT * FROM Skills WHERE skill_id = ?",
//         [skill_id]
//       );
//       return rows[0] || null;
//     } catch (error) {
//       console.error(`Error fetching skill with ID ${skill_id}:`, error);
//       throw new Error("Could not retrieve skill.");
//     }
//   }

//   static async create(skillData) {
//     const { skill_id, skill_name, skill_type } = skillData;

//     try {
//       const [result] = await promisePool.query(
//         "INSERT INTO Skills (skill_id, skill_name, skill_type) VALUES (?, ?, ?)",
//         [skill_id, skill_name, skill_type]
//       );
//       return { id: result.insertId, ...skillData }; // คืนค่าข้อมูลที่ถูกสร้างใหม่
//     } catch (error) {
//       console.error("Error creating skill:", error);
//       throw new Error("Could not create skill.");
//     }
//   }

//   static async update(skill_id, updatedData) {
//     const { skill_name, skill_type } = updatedData;

//     try {
//       const [result] = await promisePool.query(
//         "UPDATE Skills SET skill_name = ?, skill_type = ? WHERE skill_id = ?",
//         [skill_name, skill_type, skill_id]
//       );
//       return { affectedRows: result.affectedRows, ...updatedData }; // คืนค่าข้อมูลที่ถูกอัปเดต
//     } catch (error) {
//       console.error(`Error updating skill with ID ${skill_id}:`, error);
//       throw new Error("Could not update skill.");
//     }
//   }

//   static async delete(skill_id) {
//     try {
//       const [result] = await promisePool.query(
//         "DELETE FROM Skills WHERE skill_id = ?",
//         [skill_id]
//       );
//       return result;
//     } catch (error) {
//       console.error(`Error deleting skill with ID ${skill_id}:`, error);
//       throw new Error("Could not delete skill.");
//     }
//   }
// }

// export default Skills;
