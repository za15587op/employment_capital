import promisePool from '../lib/db';

class Organization {
  constructor(Organization_id, Organization_name, address, contactPhone, contactEmail) {
    this.Organization_id = Organization_id;
    this.Organization_name = Organization_name;
    this.address = address;
    this.contactPhone = contactPhone;
    this.contactEmail = contactEmail;
  }

  // Method to create a new organization entry
  static async create(organizationData) {
    const { Organization_id, Organization_name, address, contactPhone, contactEmail } = organizationData;
    const [result] = await promisePool.query(
      'INSERT INTO organizations (Organization_id, Organization_name, address, contactPhone, contactEmail) VALUES (?, ?, ?, ?, ?)',
      [Organization_id, Organization_name, address, contactPhone, contactEmail]
    );
    return result;
  }

  // Method to find an organization by its ID
  static async findById(Organization_id) {
    const [rows] = await promisePool.query('SELECT * FROM organizations WHERE Organization_id = ?', [Organization_id]);
    return rows[0];
  }

  // Method to update an organization by its ID
  static async update(Organization_id, updatedData) {
    const { Organization_name, address, contactPhone, contactEmail } = updatedData;
    const [result] = await promisePool.query(
      'UPDATE organizations SET Organization_name = ?, address = ?, contactPhone = ?, contactEmail = ? WHERE Organization_id = ?',
      [Organization_name, address, contactPhone, contactEmail, Organization_id]
    );
    return result;
  }

  // Method to delete an organization by its ID
  static async delete(Organization_id) {
    const [result] = await promisePool.query('DELETE FROM organizations WHERE Organization_id = ?', [Organization_id]);
    return result;
  }
}

export default Organization;
