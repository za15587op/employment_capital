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
        [regist_id, date_available, is_parttime, start_time, end_time]
      );
      return result.insertId; // Return the ID of the created entry
    } catch (error) {
      console.error('Error creating DateTimeAvailable entry:', error);
      throw error;
    }
  }
}

export default DateTimeAvailable;
