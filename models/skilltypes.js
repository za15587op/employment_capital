import promisePool from "@/lib/db";  // If you're using absolute imports configured in Next.js

class SkillTypes {
  constructor(skill_type_id,skill_type_name ) {
    this.skill_type_id = skill_type_id;
    this.skill_type_name = skill_type_name;
  }

  static async getAll() {
    try {
      const [rows] = await promisePool.query("SELECT * FROM skilltypes");
      return rows;
    } catch (error) {
      console.error("Error fetching skilltypes:", error);
      throw new Error("Could not retrieve skilltypes.");
    }
  }


  // Method to get all skills
  static async getSkillTypeByName(name) {
    const [result] = await promisePool.query(
      `SELECT skill_type_id FROM skilltypes WHERE skill_type_name = ?`,
      [name]
    );
    return result[0];
  }

  static async create(skillTypesData) {
    const {
      skill_type_name
    } = skillTypesData;

    try {
      const [result] = await promisePool.query(
        "INSERT INTO skilltypes ( skill_type_name) VALUES (?)",
        [
          skill_type_name
        ]
      );
      return result;
    } catch (error) {
      console.error("Error creating student:", error);
      throw new Error("Could not create student.");
    }
  }

    // Method to delete a skill by its ID
    static async delete(skill_type_id) {
      try {
        const [result] = await promisePool.query('DELETE FROM skilltypes WHERE skill_type_id = ?', [skill_type_id]);
        return result.affectedRows; // Return number of affected rows
      } catch (error) {
        console.error(`Error deleting skilltypes with ID ${skill_type_id}:`, error);
        throw new Error("Could not delete skilltypes.");
      }
    }

//   // Method to find a skill by its ID
//   static async findById(skill_id) {
//     try {
//       const [rows] = await promisePool.query('SELECT * FROM skills_skilltypes WHERE skill_id = ?', [skill_id]);
//       return rows[0] || null; // Return null if no result
//     } catch (error) {
//       console.error(`Error fetching skills_skilltypes with ID ${skill_id}:`, error);
//       throw new Error("Could not retrieve skills_skilltypes.");
//     }
//   }

  // Method to create a new skill entry
  static async createSkillType(name) {
    const [result] = await promisePool.query(
      `INSERT INTO skilltypes (skill_type_name) 
       VALUES (?) 
       ON DUPLICATE KEY UPDATE skill_type_name = VALUES(skill_type_name)`,
      [name]
    );
    return result.insertId;
  }

//   // Method to update a skill by its ID
//   static async update(skill_id, updatedData) {
//     const { skill_type_id } = updatedData;

//     try {
//       const [result] = await promisePool.query(
//         'UPDATE skills_skilltypes SET skill_type_id = ? WHERE skill_id = ?',
//         [skill_type_id, skill_id]
//       );
//       return { affectedRows: result.affectedRows, ...updatedData }; // Return the updated data
//     } catch (error) {
//       console.error(`Error updating skills_skilltypes with ID ${skill_id}:`, error);
//       throw new Error("Could not update skills_skilltypes.");
//     }
//   }


}

export default SkillTypes;