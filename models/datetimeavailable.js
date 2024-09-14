import promisePool from '../lib/db';

class DateTimeAvailable {
  constructor(datetime_id, regist_id, date_available, is_parttime, start_time, end_time) {
    this.datetime_id = datetime_id;
    this.regist_id = regist_id;
    this.date_available = date_available;
    this.is_parttime = is_parttime;
    this.start_time = start_time;
    this.end_time = end_time;
  }

   // Create a new DateTimeAvailable entry
   static async create(regist_id, date_available, is_parttime, start_time, end_time) {
    try {
      const [result] = await promisePool.query(
        `INSERT INTO datetimeavailable (regist_id, date_available, is_parttime, start_time, end_time) 
         VALUES (?, ?, ?, ?, ?)`,
        [regist_id, date_available, is_parttime, start_time || null, end_time || null]
      );
      return result.insertId; // Return the ID of the created entry
    } catch (error) {
      console.error('Error creating DateTimeAvailable entry:', error);
      throw error;
    }
  }


  // Find DateTimeAvailable by regist_id
  static async findByRegistId(regist_id) {
    try {
      const [rows] = await promisePool.query(
        `SELECT * FROM datetimeavailable WHERE regist_id = ?`,
        [regist_id]
      );
      return rows;
    } catch (error) {
      console.error('Error finding DateTimeAvailable entries:', error);
      throw error;
    }
  }

  // Update an existing DateTimeAvailable entry
  static async update(datetime_id, regist_id, date_available, is_parttime, start_time, end_time) {
    try {
      const [result] = await promisePool.query(
        `UPDATE datetimeavailable 
         SET regist_id = ?, date_available = ?, is_parttime = ?, start_time = ?, end_time = ? 
         WHERE datetime_id = ?`,
        [regist_id, date_available, is_parttime, start_time, end_time, datetime_id]
      );
      return result.affectedRows; // Return the number of affected rows
    } catch (error) {
      console.error('Error updating DateTimeAvailable entry:', error);
      throw error;
    }
  }

  // Delete a DateTimeAvailable entry by datetime_id
  static async delete(datetime_id) {
    try {
      const [result] = await promisePool.query(
        `DELETE FROM datetimeavailable WHERE datetime_id = ?`,
        [datetime_id]
      );
      return result.affectedRows; // Return the number of affected rows
    } catch (error) {
      console.error('Error deleting DateTimeAvailable entry:', error);
      throw error;
    }
  }
}

export default DateTimeAvailable;
