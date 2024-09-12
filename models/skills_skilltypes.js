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



// import knex from "../lib/knex";

// class Skills_SkillTypes {
//   constructor(skill_id , skill_type_id) {
//     this.skill_id  = skill_id ;
//     this.skill_type_id = skill_type_id;
//   }

//   // Method to get all skills
//   static async getAll() {
//     try {
//       const result = await knex('skills_skilltypes').select('*');
//       return result;
//     } catch (error) {
//       console.error("Error fetching all skills_skilltypes:", error);
//       throw new Error("Could not retrieve skills_skilltypes.");
//     }
//   }

//   // Method to find a skill by its ID
//   static async findById(skill_id) {
//     try {
//       const result = await knex('skills_skilltypes')
//         .where({ skill_id })
//         .first();
//       return result || null;
//     } catch (error) {
//       console.error(`Error fetching skills_skilltypes with ID ${skill_id}:`, error);
//       throw new Error("Could not retrieve skills_skilltypes.");
//     }
//   }

//   // Method to create a new skill entry
//   static async create(skills_skilltypesData) {
//     const { skill_id, skill_type_id} = skills_skilltypesData;

//     try {
//       const [result] = await knex('skills_skilltypes')
//         .insert({ skill_id, skill_type_id})
//         .returning('skill_type_id'); // Assuming skill_id is returned
//       return { id: result, ...skills_skilltypesData }; // Return the created data
//     } catch (error) {
//       console.error("Error creating skills_skilltypes:", error);
//       throw new Error("Could not create skills_skilltypes.");
//     }
//   }

// //   // Method to update a skill by its ID
// //   static async update(skill_type_id, updatedData) {
// //     const { skill_type_name} = updatedData;

// //     try {
// //       const result = await knex('skillskills_skilltypestypes')
// //         .where({ skill_type_id })
// //         .update({ skill_type_name });
// //       return { affectedRows: result, ...updatedData }; // Return the updated data
// //     } catch (error) {
// //       console.error(`Error updating skills_skilltypes with ID ${skill_type_id}:`, error);
// //       throw new Error("Could not update skills_skilltypes.");
// //     }
// //   }

//   // Method to delete a skill by its ID
//   static async delete(skill_id) {
//     try {
//       const result = await knex('skills_skilltypes')
//         .where({ skill_id })
//         .del();
//       return result;
//     } catch (error) {
//       console.error(`Error deleting skills_skilltypes with ID ${skill_id}:`, error);
//       throw new Error("Could not delete skills_skilltypes.");
//     }
//   }
// }

// export default Skills_SkillTypes;
