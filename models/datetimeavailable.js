import promisePool from '../lib/db';

class DateTimeAvailable {
  constructor(datetime_id, regist_id, date_available , is_parttime, start_time, end_time) {
    this.datetime_id = datetime_id;
    this.regist_id = regist_id;
    this.date_available  = date_available ;
    this.is_parttime = is_parttime;
    this.start_time = start_time;
    this.end_time = end_time;
  }
}



export default DateTimeAvailable;
