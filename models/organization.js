import promisePool from '../lib/db';

class Organization {
  constructor(organization_id, organization_name, contactPhone, contactEmail) {
    this.organization_id = organization_id;
    this.organization_name = organization_name;
    this.contactPhone = contactPhone;
    this.contactEmail = contactEmail;
  }

  // Method to get all organizations
  static async getAll() {
    try {
      const [rows] = await promisePool.query("SELECT * FROM organization");
      return rows;
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw new Error("Could not retrieve organizations.");
    }
  }

  // Method to create a new organization entry
  static async create(organizationData) {
    const { organization_id, organization_name, contactPhone, contactEmail } = organizationData;
    try {
      const [result] = await promisePool.query(
        'INSERT INTO organization (organization_id, organization_name, contactPhone, contactEmail) VALUES (?, ?, ?, ?)',
        [organization_id, organization_name, contactPhone, contactEmail]
      );
      return result;
    } catch (error) {
      console.error("Error creating organization:", error);
      throw new Error("Could not create organization.");
    }
  }

  // Method to find an organization by its ID
  static async findById(organization_id) {
    try {
      const [rows] = await promisePool.query('SELECT * FROM organization WHERE organization_id = ?', [organization_id]);
      if (rows.length === 0) {
        throw new Error(`Organization with ID ${organization_id} not found.`);
      }
      return rows[0];
    } catch (error) {
      console.error("Error finding organization:", error);
      throw new Error(`Could not find organization with ID ${organization_id}.`);
    }
  }

  // Method to update an organization by its ID
  static async update(organization_id, updatedData) {
    const { organization_name, contactPhone, contactEmail } = updatedData;
    try {
      const [result] = await promisePool.query(
        'UPDATE organization SET organization_name = ?, contactPhone = ?, contactEmail = ? WHERE organization_id = ?',
        [organization_name, contactPhone, contactEmail, organization_id]
      );
      if (result.affectedRows === 0) {
        throw new Error(`No organization found with ID ${organization_id} to update.`);
      }
      return result;
    } catch (error) {
      console.error("Error updating organization:", error);
      throw new Error(`Could not update organization with ID ${organization_id}.`);
    }
  }

  // Method to delete an organization by its ID
  static async delete(organization_id) {
    try {
      const [result] = await promisePool.query(
        'DELETE FROM organization WHERE organization_id = ?',
        [organization_id]
      );
      if (result.affectedRows === 0) {
        throw new Error(`No organization found with ID ${organization_id} to delete.`);
      }
      return result;
    } catch (error) {
      console.error("Error deleting organization:", error);
      throw new Error(`Could not delete organization with ID ${organization_id}.`);
    }
  }
}

export default Organization;
