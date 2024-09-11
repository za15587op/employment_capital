import promisePool from '../lib/db';

class ScholarshipRegistrations {
  constructor(std_id, scholarship_id, is_parttime, is_parttimedate, related_works, student_status = 'Pending') {
    this.std_id = std_id;
    this.scholarship_id = scholarship_id;
    this.is_parttime = is_parttime;
    this.is_parttimedate = is_parttimedate;
    this.related_works = related_works;
    this.student_status = student_status;
  }

  // static async registerScholarship(studentId, parttime, parttimeDates, relatedWorks) {
  //   await promisePool.query(
  //     `INSERT INTO ScholarshipRegistrations (std_id, is_parttime, is_parttimedate, related_works) 
  //      VALUES (?, ?, ?, ?)`,
  //     [studentId, parttime.join(','), parttimeDates.join(','), relatedWorks.join(',')]
  //   );
  // }

  // // Method to create a new scholarship registration entry
  // static async create(registrationData) {
  //   const { std_id, scholarship_id, is_parttime } = registrationData;
  //   const [result] = await promisePool.query(
  //     'INSERT INTO scholarship_registrations (std_id, scholarship_id, is_parttime, is_parttimedate, related_works) VALUES (?, ?, ?, ?, ?)',
  //     [std_id, scholarship_id, is_parttime, is_parttimedate, related_works]
  //   );
  //   return result;
  // }

  // // Method to find a scholarship registration by student ID and scholarship ID
  // static async findByIds(std_id, scholarship_id) {
  //   const [rows] = await promisePool.query(
  //     'SELECT * FROM scholarship_registrations WHERE std_id = ? AND scholarship_id = ?',
  //     [std_id, scholarship_id]
  //   );
  //   return rows[0];
  // }

  // // Method to update a scholarship registration by student ID and scholarship ID
  // static async update(std_id, scholarship_id, updatedData) {
  //   const { is_parttime } = updatedData;
  //   const [result] = await promisePool.query(
  //     'UPDATE scholarship_registrations SET is_parttime = ? WHERE std_id = ? AND scholarship_id = ?',
  //     [is_parttime, std_id, scholarship_id]
  //   );
  //   return result;
  // }

  // // Method to delete a scholarship registration by student ID and scholarship ID
  // static async delete(std_id, scholarship_id) {
  //   const [result] = await promisePool.query(
  //     'DELETE FROM scholarship_registrations WHERE std_id = ? AND scholarship_id = ?',
  //     [std_id, scholarship_id]
  //   );
  //   return result;
  // }
}

export default ScholarshipRegistrations;


// import knex from "../lib/knex";

// class ScholarshipRegistrations {
//   constructor(std_id, scholarship_id, is_parttime, is_parttimedate, related_works) {
//     this.std_id = std_id;
//     this.scholarship_id = scholarship_id;
//     this.is_parttime = is_parttime;
//     this.is_parttimedate = is_parttimedate;
//     this.related_works = related_works;
//   }

//   // Method to create a new scholarship registration entry
//   static async create(registrationData) {
//     const { std_id, scholarship_id, is_parttime, is_parttimedate, related_works } = registrationData;
//     try {
//       const result = await knex('scholarshipregistrations').insert({
//         std_id,
//         scholarship_id,
//         is_parttime,
//         is_parttimedate,
//         related_works
//       });
//       return result;
//     } catch (error) {
//       console.error("Error creating scholarship registration:", error);
//       throw new Error("Could not create scholarship registration.");
//     }
//   }

//   // Method to find a scholarship registration by student ID and scholarship ID
//   static async findByIds(std_id, scholarship_id) {
//     try {
//       const result = await knex('scholarshipregistrations')
//         .where({ std_id, scholarship_id })
//         .first();
//       return result;
//     } catch (error) {
//       console.error("Error finding scholarship registration:", error);
//       throw new Error("Could not find scholarship registration.");
//     }
//   }

//   // Method to update a scholarship registration by student ID and scholarship ID
//   static async update(std_id, scholarship_id, updatedData) {
//     const { is_parttime, is_parttimedate, related_works } = updatedData;
//     try {
//       const result = await knex('scholarshipregistrations')
//         .where({ std_id, scholarship_id })
//         .update({
//           is_parttime,
//           is_parttimedate,
//           related_works
//         });
//       return result;
//     } catch (error) {
//       console.error("Error updating scholarship registration:", error);
//       throw new Error("Could not update scholarship registration.");
//     }
//   }

//   // Method to delete a scholarship registration by student ID and scholarship ID
//   static async delete(std_id, scholarship_id) {
//     try {
//       const result = await knex('scholarshipregistrations')
//         .where({ std_id, scholarship_id })
//         .del();
//       return result;
//     } catch (error) {
//       console.error("Error deleting scholarship registration:", error);
//       throw new Error("Could not delete scholarship registration.");
//     }
//   }
// }

// export default ScholarshipRegistrations;
