import promisePool from '../lib/db';

class ScholarshipOrganization {
  constructor(ScholarshipOrgan_id, scholarship_id, organization_id, amount, required_parttime) {
    this.ScholarshipOrgan_id = ScholarshipOrgan_id;
    this.scholarship_id = scholarship_id;
    this.organization_id = organization_id;
    this.amount = amount;
    this.required_parttime = required_parttime;
  }

  // เมธอดสำหรับสร้างข้อมูลใหม่ในตาราง scholarship_organization
  static async create(organizationData) {
    const { ScholarshipOrgan_id, scholarship_id, organization_id, amount, required_parttime } = organizationData;
    const [result] = await promisePool.query(
      'INSERT INTO scholarship_organization (ScholarshipOrgan_id, scholarship_id, organization_id, amount, required_parttime) VALUES (?, ?, ?, ?, ?)',
      [ScholarshipOrgan_id, scholarship_id, organization_id, amount, required_parttime]
    );
    return result;
  }

  // เมธอดสำหรับค้นหาข้อมูลในตาราง scholarship_organization โดยใช้ ScholarshipOrgan_id
  static async findById(ScholarshipOrgan_id) {
    const [rows] = await promisePool.query('SELECT * FROM scholarship_organization WHERE ScholarshipOrgan_id = ?', [ScholarshipOrgan_id]);
    return rows[0];
  }

  // เมธอดสำหรับอัปเดตข้อมูลในตาราง scholarship_organization โดยใช้ ScholarshipOrgan_id
  static async update(ScholarshipOrgan_id, updatedData) {
    const { scholarship_id, organization_id, amount, required_parttime } = updatedData;
    const [result] = await promisePool.query(
      'UPDATE scholarship_organization SET scholarship_id = ?, organization_id = ?, amount = ?, required_parttime = ? WHERE ScholarshipOrgan_id = ?',
      [scholarship_id, organization_id, amount, required_parttime, ScholarshipOrgan_id]
    );
    return result;
  }

  // เมธอดสำหรับลบข้อมูลในตาราง scholarship_organization โดยใช้ ScholarshipOrgan_id
  static async delete(ScholarshipOrgan_id) {
    const [result] = await promisePool.query(
      'DELETE FROM scholarship_organization WHERE ScholarshipOrgan_id = ?',
      [ScholarshipOrgan_id]
    );
    return result;
  }
}

export default ScholarshipOrganization;
