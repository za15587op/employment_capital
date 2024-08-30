import promisePool from "../lib/db";

class Student {
  constructor(
    std_id,
    student_id,
    student_firstname,
    student_lastname,
    student_faculty,
    student_field,
    student_curriculum,
    student_year,
    student_gpa,
    student_phone
  ) {
    this.std_id = std_id;
    this.student_id = student_id;
    this.student_firstname = student_firstname;
    this.student_lastname = student_lastname;
    this.student_faculty = student_faculty;
    this.student_field = student_field;
    this.student_curriculum = student_curriculum;
    this.student_year = student_year;
    this.student_gpa = student_gpa;
    this.student_phone = student_phone;
  }

  static async getAll() {
    try {
      const [rows] = await promisePool.query("SELECT * FROM student");
      return rows;
    } catch (error) {
      console.error("Error fetching all students:", error);
      throw new Error("Could not retrieve students.");
    }
  }

  static async findById(std_id) {
    try {
      const [rows] = await promisePool.query(
        "SELECT * FROM student WHERE std_id = ?",
        [std_id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error(`Error fetching student with ID ${std_id}:`, error);
      throw new Error("Could not retrieve student.");
    }
  }

  static async create(studentData) {
    const {
      std_id,
      student_id,
      student_firstname,
      student_lastname,
      student_faculty,
      student_field,
      student_curriculum,
      student_year,
      student_gpa,
      student_phone,
    } = studentData;

    try {
      const [result] = await promisePool.query(
        "INSERT INTO student (std_id, student_id, student_firstname, student_lastname, student_faculty, student_field, student_curriculum, student_year, student_gpa, student_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          std_id,
          student_id,
          student_firstname,
          student_lastname,
          student_faculty,
          student_field,
          student_curriculum,
          student_year,
          student_gpa,
          student_phone,
        ]
      );
      return result;
    } catch (error) {
      console.error("Error creating student:", error);
      throw new Error("Could not create student.");
    }
  }

  static async update(std_id, updatedData) {
    const {
      student_id,
      student_firstname,
      student_lastname,
      student_faculty,
      student_field,
      student_curriculum,
      student_year,
      student_gpa,
      student_phone,
    } = updatedData;

    try {
      const [result] = await promisePool.query(
        "UPDATE student SET student_id = ?, student_firstname = ?, student_lastname = ?, student_faculty = ?, student_field = ?, student_curriculum = ?, student_year = ?, student_gpa = ?, student_phone = ? WHERE std_id = ?",
        [
          student_id,
          student_firstname,
          student_lastname,
          student_faculty,
          student_field,
          student_curriculum,
          student_year,
          student_gpa,
          student_phone,
          std_id,
        ]
      );
      return result;
    } catch (error) {
      console.error(`Error updating student with ID ${std_id}:`, error);
      throw new Error("Could not update student.");
    }
  }


  static async delete(std_id) {
    try {
      const [result] = await promisePool.query(
        "DELETE FROM student WHERE std_id = ?",
        [std_id]
      );
      return result;
    } catch (error) {
      console.error(`Error deleting student with ID ${std_id}:`, error);
      throw new Error("Could not delete student.");
    }
  }
}

export default Student;


// import knex from "../lib/knex";

// class Student {
//   constructor(
//     std_id,
//     student_id,
//     student_firstname,
//     student_lastname,
//     student_faculty,
//     student_field,
//     student_curriculum,
//     student_year,
//     student_gpa,
//     student_phone
//   ) {
//     this.std_id = std_id;
//     this.student_id = student_id;
//     this.student_firstname = student_firstname;
//     this.student_lastname = student_lastname;
//     this.student_faculty = student_faculty;
//     this.student_field = student_field;
//     this.student_curriculum = student_curriculum;
//     this.student_year = student_year;
//     this.student_gpa = student_gpa;
//     this.student_phone = student_phone;
//   }

//   // Method to get all students
//   static async getAll() {
//     try {
//       const result = await knex('student').select('*');
//       return result;
//     } catch (error) {
//       console.error("Error fetching all students:", error);
//       throw new Error("Could not retrieve students.");
//     }
//   }

//   // Method to find a student by their ID
//   static async findById(std_id) {
//     try {
//       const result = await knex('student')
//         .where({ std_id })
//         .first();
//       return result || null;
//     } catch (error) {
//       console.error(`Error fetching student with ID ${std_id}:`, error);
//       throw new Error("Could not retrieve student.");
//     }
//   }

//   // Method to create a new student entry
//   static async create(studentData) {
//     const {
//       std_id,
//       student_id,
//       student_firstname,
//       student_lastname,
//       student_faculty,
//       student_field,
//       student_curriculum,
//       student_year,
//       student_gpa,
//       student_phone,
//     } = studentData;

//     try {
//       const [result] = await knex('student')
//         .insert({
//           std_id,
//           student_id,
//           student_firstname,
//           student_lastname,
//           student_faculty,
//           student_field,
//           student_curriculum,
//           student_year,
//           student_gpa,
//           student_phone
//         })
//         .returning('std_id'); // Assuming `std_id` is returned after insertion
//       return { id: result, ...studentData }; // Return the created data
//     } catch (error) {
//       console.error("Error creating student:", error);
//       throw new Error("Could not create student.");
//     }
//   }

//   // Method to update a student by their ID
//   static async update(std_id, updatedData) {
//     const {
//       student_id,
//       student_firstname,
//       student_lastname,
//       student_faculty,
//       student_field,
//       student_curriculum,
//       student_year,
//       student_gpa,
//       student_phone,
//     } = updatedData;

//     try {
//       const result = await knex('student')
//         .where({ std_id })
//         .update({
//           student_id,
//           student_firstname,
//           student_lastname,
//           student_faculty,
//           student_field,
//           student_curriculum,
//           student_year,
//           student_gpa,
//           student_phone
//         });
//       return { affectedRows: result, ...updatedData }; // Return the updated data
//     } catch (error) {
//       console.error(`Error updating student with ID ${std_id}:`, error);
//       throw new Error("Could not update student.");
//     }
//   }

//   // Method to delete a student by their ID
//   static async delete(std_id) {
//     try {
//       const result = await knex('student')
//         .where({ std_id })
//         .del();
//       return result;
//     } catch (error) {
//       console.error(`Error deleting student with ID ${std_id}:`, error);
//       throw new Error("Could not delete student.");
//     }
//   }
// }

// export default Student;
