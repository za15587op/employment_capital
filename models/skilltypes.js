import promisePool from "../lib/db";

class Skills_SkillTypes {
  constructor(skill_id, skill_type_id) {
    this.skill_id = skill_id;
    this.skill_type_id = skill_type_id;
  }

  // Method to get all skills
  static async getAll() {
    try {
      const [rows] = await promisePool.query('SELECT * FROM skills_skilltypes');
      return rows;
    } catch (error) {
      console.error("Error fetching all skills_skilltypes:", error);
      throw new Error("Could not retrieve skills_skilltypes.");
    }
  }

  // Method to find a skill by its ID
  static async findById(skill_id) {
    try {
      const [rows] = await promisePool.query('SELECT * FROM skills_skilltypes WHERE skill_id = ?', [skill_id]);
      return rows[0] || null; // Return null if no result
    } catch (error) {
      console.error(`Error fetching skills_skilltypes with ID ${skill_id}:`, error);
      throw new Error("Could not retrieve skills_skilltypes.");
    }
  }

  // Method to create a new skill entry
  static async create(skills_skilltypesData) {
    const { skill_id, skill_type_id } = skills_skilltypesData;

    try {
      const [result] = await promisePool.query(
        'INSERT INTO skills_skilltypes (skill_id, skill_type_id) VALUES (?, ?)',
        [skill_id, skill_type_id]
      );
      return { id: result.insertId, ...skills_skilltypesData }; // Return the created data with generated ID
    } catch (error) {
      console.error("Error creating skills_skilltypes:", error);
      throw new Error("Could not create skills_skilltypes.");
    }
  }

  // Method to update a skill by its ID
  static async update(skill_id, updatedData) {
    const { skill_type_id } = updatedData;

    try {
      const [result] = await promisePool.query(
        'UPDATE skills_skilltypes SET skill_type_id = ? WHERE skill_id = ?',
        [skill_type_id, skill_id]
      );
      return { affectedRows: result.affectedRows, ...updatedData }; // Return the updated data
    } catch (error) {
      console.error(`Error updating skills_skilltypes with ID ${skill_id}:`, error);
      throw new Error("Could not update skills_skilltypes.");
    }
  }

  // Method to delete a skill by its ID
  static async delete(skill_id) {
    try {
      const [result] = await promisePool.query('DELETE FROM skills_skilltypes WHERE skill_id = ?', [skill_id]);
      return result.affectedRows; // Return number of affected rows
    } catch (error) {
      console.error(`Error deleting skills_skilltypes with ID ${skill_id}:`, error);
      throw new Error("Could not delete skills_skilltypes.");
    }
  }
}

export default Skills_SkillTypes;


// import knex from "../lib/knex";

// class SkillTypes {
//   constructor(skill_type_id, skill_type_name ) {
//     this.skill_type_id = skill_type_id;
//     this.skill_type_name  = skill_type_name ;
//   }

//   // Method to get all skills
//   static async getAll() {
//     try {
//       const result = await knex('skilltypes').select('*');
//       return result;
//     } catch (error) {
//       console.error("Error fetching all skilltypes:", error);
//       throw new Error("Could not retrieve skilltypes.");
//     }
//   }

//   // Method to find a skill by its ID
//   static async findById(skill_type_id) {
//     try {
//       const result = await knex('skilltypes')
//         .where({ skill_type_id })
//         .first();
//       return result || null;
//     } catch (error) {
//       console.error(`Error fetching skilltypes with ID ${skill_type_id}:`, error);
//       throw new Error("Could not retrieve skilltypes.");
//     }
//   }

//   // Method to create a new skill entry
//   static async create(skilltypesData) {
//     const { skill_type_id, skill_type_name } = skilltypesData;

//     try {
//       const [result] = await knex('skilltypes')
//         .insert({ skill_type_id, skill_type_name})
//         .returning('skill_type_id'); // Assuming skill_id is returned
//       return { id: result, ...skilltypesData }; // Return the created data
//     } catch (error) {
//       console.error("Error creating skilltypes:", error);
//       throw new Error("Could not create skilltypes.");
//     }
//   }

//   // Method to update a skill by its ID
//   static async update(skill_type_id, updatedData) {
//     const { skill_type_name} = updatedData;

//     try {
//       const result = await knex('skilltypes')
//         .where({ skill_type_id })
//         .update({ skill_type_name });
//       return { affectedRows: result, ...updatedData }; // Return the updated data
//     } catch (error) {
//       console.error(`Error updating skilltypes with ID ${skill_type_id}:`, error);
//       throw new Error("Could not update skilltypes.");
//     }
//   }

//   // Method to delete a skill by its ID
//   static async delete(skill_id) {
//     try {
//       const result = await knex('skilltypes')
//         .where({ skill_type_id })
//         .del();
//       return result;
//     } catch (error) {
//       console.error(`Error deleting skilltypes with ID ${skill_type_id}:`, error);
//       throw new Error("Could not delete skilltypes.");
//     }
//   }
// }

// export default SkillTypes;
