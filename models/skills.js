import promisePool from "../lib/db";

class Skills {
  constructor(skill_id, skill_name) {
    this.skill_id = skill_id;
    this.skill_name = skill_name;
  }

  static async getSkillByName(name) {
    const [result] = await promisePool.query(
      `SELECT skill_id FROM skills WHERE skill_name = ?`,
      [name]
    );
    return result[0];
  }

//   static async findById(skill_id) {
//     try {
//       const [rows] = await promisePool.query(
//         "SELECT * FROM skills WHERE skill_id = ?",
//         [skill_id]
//       );
//       return rows[0] || null;
//     } catch (error) {
//       console.error(`Error fetching skill with ID ${skill_id}:`, error);
//       throw new Error("Could not retrieve skill.");
//     }
//   }

  static async createSkill(name, typeId) {
    const [result] = await promisePool.query(
      `INSERT INTO skills (skill_name, skill_id) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE skill_name = VALUES(skill_name)`,
      [name, typeId]
    );
    return result.insertId;
  }

//   static async update(skill_id, updatedData) {
//     const { skill_name, skill_type } = updatedData;

//     try {
//       const [result] = await promisePool.query(
//         "UPDATE skills SET skill_name = ? WHERE skill_id = ?",
//         [skill_name, skill_id]
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
//         "DELETE FROM skills WHERE skill_id = ?",
//         [skill_id]
//       );
//       return result;
//     } catch (error) {
//       console.error(`Error deleting skill with ID ${skill_id}:`, error);
//       throw new Error("Could not delete skill.");
//     }
//   }
}

export default Skills;


// import knex from "../lib/knex";

// class Skills {
//   constructor(skill_id, skill_name) {
//     this.skill_id = skill_id;
//     this.skill_name = skill_name;
//   }

//   // Method to get all skills
//   static async getAll() {
//     try {
//       const result = await knex('skills').select('*');
//       return result;
//     } catch (error) {
//       console.error("Error fetching all skills:", error);
//       throw new Error("Could not retrieve skills.");
//     }
//   }

//   // Method to find a skill by its ID
//   static async findById(skill_id) {
//     try {
//       const result = await knex('skills')
//         .where({ skill_id })
//         .first();
//       return result || null;
//     } catch (error) {
//       console.error(`Error fetching skill with ID ${skill_id}:`, error);
//       throw new Error("Could not retrieve skill.");
//     }
//   }

//   // Method to create a new skill entry
//   static async create(skillData) {
//     const { skill_id, skill_name, skill_type } = skillData;

//     try {
//       const [result] = await knex('skills')
//         .insert({ skill_id, skill_name, skill_type })
//         .returning('skill_id'); // Assuming skill_id is returned
//       return { id: result, ...skillData }; // Return the created data
//     } catch (error) {
//       console.error("Error creating skill:", error);
//       throw new Error("Could not create skill.");
//     }
//   }

//   // Method to update a skill by its ID
//   static async update(skill_id, updatedData) {
//     const { skill_name, skill_type } = updatedData;

//     try {
//       const result = await knex('skills')
//         .where({ skill_id })
//         .update({ skill_name, skill_type });
//       return { affectedRows: result, ...updatedData }; // Return the updated data
//     } catch (error) {
//       console.error(`Error updating skill with ID ${skill_id}:`, error);
//       throw new Error("Could not update skill.");
//     }
//   }

//   // Method to delete a skill by its ID
//   static async delete(skill_id) {
//     try {
//       const result = await knex('skills')
//         .where({ skill_id })
//         .del();
//       return result;
//     } catch (error) {
//       console.error(`Error deleting skill with ID ${skill_id}:`, error);
//       throw new Error("Could not delete skill.");
//     }
//   }
// }

// export default Skills;
