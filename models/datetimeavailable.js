import promisePool from '../lib/db';

class DateTimeAvailable {
  constructor(datetime_id, regist_id, date_available, is_parttime) {
    this.datetime_id = datetime_id;
    this.regist_id = regist_id;
    this.date_available = date_available;
    this.is_parttime = is_parttime;
  }

   // Create a new DateTimeAvailable entry
   static async create(regist_id, date_available, is_parttime) {
    try {
      const [result] = await promisePool.query(
        `INSERT INTO datetimeavailable (regist_id, date_available, is_parttime) 
         VALUES (?, ?, ?)`,
        [regist_id, JSON.stringify(date_available), is_parttime]
      );
      return result.insertId; // Return the ID of the created entry
    } catch (error) {
      console.error('Error creating DateTimeAvailable entry:', error);
      throw error;
    }
  }

   // Find a single DateTimeAvailable entry by regist_id and date_available
static async findOne(regist_id, date_available) {
  try {
    const [rows] = await promisePool.query(
      `SELECT * FROM datetimeavailable WHERE regist_id = ? AND date_available = ? LIMIT 1;`,
      [regist_id, date_available]
    );
    return rows.length > 0 ? rows[0] : null; // Return the found record or null if not found
  } catch (error) {
    console.error('Error finding DateTimeAvailable entry:', error);
    throw error;
  }
}




static async findByRegistId(regist_id) {
  try {
    const [rows] = await promisePool.query(
      `SELECT * FROM datetimeavailable WHERE regist_id = ?`,
      [regist_id]
    );
    
    // แปลงข้อมูล date_available จาก JSON string กลับมาเป็น array
    return rows.map(row => ({
      ...row,
      date_available: JSON.parse(row.date_available)
    }));
  } catch (error) {
    console.error('Error finding DateTimeAvailable entries:', error);
    throw error;
  }
}


  // Update an existing DateTimeAvailable entry
  static async update(datetime_id, regist_id, date_available, is_parttime) {
    try {
      const [result] = await promisePool.query(
        `UPDATE datetimeavailable 
         SET regist_id = ?, date_available = ?, is_parttime = ? 
         WHERE datetime_id = ?`,
        [regist_id, JSON.stringify(date_available), is_parttime, datetime_id]
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

  static async deleteMany(regist_id) {
    try {
      const [result] = await promisePool.query(
        `DELETE FROM datetimeavailable WHERE regist_id = ?`,
        [regist_id]
      );
      return result.affectedRows;
    } catch (error) {
      console.error('Error deleting DateTimeAvailable entries:', error);
      throw error;
    }
  }


   // Method to delete a scholarship by its ID
   static async delete(regist_id) {
    const [result] = await promisePool.query('DELETE FROM datetimeavailable WHERE regist_id = ?', [regist_id]);
    return result;
  }

}

export default DateTimeAvailable;
