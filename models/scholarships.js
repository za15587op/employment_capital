import promisePool from "../lib/db";

class Scholarship {
  constructor(scholarship_id, application_start_date, application_end_date, academic_year, academic_term) {
    this.scholarship_id = scholarship_id;
    this.application_start_date = application_start_date;
    this.application_end_date = application_end_date;
    this.academic_year = academic_year;
    this.academic_term = academic_term;
  }

  static async getAll() {
    try {
      const [rows] = await promisePool.query("SELECT * FROM scholarships");
      return rows;
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      throw new Error("Could not retrieve scholarships.");
    }
  }

  // Method to create a new scholarship entry
  static async create(scholarshipData) {
    const { application_start_date, application_end_date, academic_year, academic_term } = scholarshipData;
    const [result] = await promisePool.query(
      'INSERT INTO scholarships (application_start_date, application_end_date, academic_year, academic_term) VALUES ( ?, ?, ?, ?)',
      [ application_start_date, application_end_date, academic_year, academic_term]
    );
    return result;
  }

  // Method to find a scholarship by its ID
  static async findById(scholarship_id) {
    const [rows] = await promisePool.query('SELECT * FROM scholarships WHERE scholarship_id = ?', [scholarship_id]);
    return rows[0];
  }

  // Method to update a scholarship by its ID
  static async update(scholarship_id, updatedData) {
    const { application_start_date, application_end_date, academic_year, academic_term } = updatedData;
    const [result] = await promisePool.query(
      'UPDATE scholarships SET application_start_date = ?, application_end_date = ?, academic_year = ?, academic_term = ? WHERE scholarship_id = ?',
      [ application_start_date, application_end_date, academic_year, academic_term, scholarship_id]
    );
    return result;
  }

  // Method to delete a scholarship by its ID
  static async delete(scholarship_id) {
    const [result] = await promisePool.query('DELETE FROM scholarships WHERE scholarship_id = ?', [scholarship_id]);
    return result;
  }
}

export default Scholarship;


// import knex from "../lib/knex"; // Import your Knex instance instead of promisePool

// class Scholarship {
//   constructor(scholarship_id, application_start_date, application_end_date, academic_year, academic_term) {
//     this.scholarship_id = scholarship_id;
//     this.application_start_date = application_start_date;
//     this.application_end_date = application_end_date;
//     this.academic_year = academic_year;
//     this.academic_term = academic_term;
//   }

//   // Method to get all scholarships
//   static async getAll() {
//     try {
//       const rows = await knex('scholarships').select('*');
//       return rows;
//     } catch (error) {
//       console.error("Error fetching scholarships:", error);
//       throw new Error("Could not retrieve scholarships.");
//     }
//   }

//   // Method to create a new scholarship entry
//   static async create(scholarshipData) {
//     const { scholarship_id, application_start_date, application_end_date, academic_year, academic_term } = scholarshipData;
//     try {
//       const result = await knex('scholarships').insert({
//         scholarship_id,
//         application_start_date,
//         application_end_date,
//         academic_year,
//         academic_term
//       });
//       return result;
//     } catch (error) {
//       console.error("Error creating scholarship:", error);
//       throw new Error("Could not create scholarship.");
//     }
//   }

//   // Method to find a scholarship by its ID
//   static async findById(scholarship_id) {
//     try {
//       const row = await knex('scholarships').where({ scholarship_id }).first();
//       return row;
//     } catch (error) {
//       console.error("Error finding scholarship by ID:", error);
//       throw new Error("Could not find scholarship.");
//     }
//   }

//   // Method to update a scholarship by its ID
//   static async update(scholarship_id, updatedData) {
//     const { application_start_date, application_end_date, academic_year, academic_term } = updatedData;
//     try {
//       const result = await knex('scholarships')
//         .where({ scholarship_id })
//         .update({ application_start_date, application_end_date, academic_year, academic_term });
//       return result;
//     } catch (error) {
//       console.error("Error updating scholarship:", error);
//       throw new Error("Could not update scholarship.");
//     }
//   }

//   // Method to delete a scholarship by its ID
//   static async delete(scholarship_id) {
//     try {
//       const result = await knex('scholarships').where({ scholarship_id }).del();
//       return result;
//     } catch (error) {
//       console.error("Error deleting scholarship:", error);
//       throw new Error("Could not delete scholarship.");
//     }
//   }
// }

// export default Scholarship;
