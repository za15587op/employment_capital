import promisePool from "@/lib/db";  // If you're using absolute imports configured in Next.js

class User {
  constructor(user_id, username, password, user_role = 'user') {
    this.user_id = user_id;
    this.username = username;
    this.password = password;
    this.user_role = user_role;
  }

  // เมธอดสำหรับสร้างผู้ใช้ใหม่
  static async create(userData) {
    const { username, password, use_role } = userData;
    const [result] = await promisePool.query(
      'INSERT INTO user (username, password, user_role) VALUES (?, ?, ?, "student")',
      [username, password, use_role]
    );
    return result;
  }

  // เมธอดเพื่อค้นหาผู้ใช้โดย username
  static async findByUsername(username) {
    const [rows] = await promisePool.query('SELECT * FROM user WHERE username = ?', [username]);
    return rows[0];
  }

  // เมธอดเพื่อค้นหาผู้ใช้โดย id
  static async findByStudentId(user_id) {
    const [rows] = await promisePool.query('SELECT * FROM user WHERE user_id = ?', [user_id]);
    return rows[0];
  }

  // เมธอดเพื่ออัปเดตข้อมูลผู้ใช้
  static async update(user_id, updatedData) {
    const { username, password, user_role } = updatedData;
    const [result] = await promisePool.query(
      'UPDATE user SET username = ?, password = ?, user_role = ? WHERE user_id = ?',
      [username, password, user_role, user_id]
    );
    return result;
  }

  // เมธอดเพื่อลบผู้ใช้
  static async delete(user_id) {
    const [result] = await promisePool.query('DELETE FROM user WHERE user_id = ?', [user_id]);
    return result;
  }
}

export default User;