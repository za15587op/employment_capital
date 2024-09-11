import { NextResponse } from "next/server";
import promisePool from "../../../../../lib/db";

// GET request to fetch organization details
export async function GET(req, { params }) {
  try {
    const organization_id = params.id; // Ensure this matches the URL parameter

    if (!organization_id) {
      return NextResponse.json(
        { message: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Query to fetch the specified columns only
    const [rows] = await promisePool.query(
      "SELECT organization_id, organization_name, contactPhone, contactEmail FROM organization WHERE organization_id = ?",
      [organization_id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching organization data:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// PUT request to update organization details
export async function PUT(req, { params }) {
  const organization_id = params.id;

  try {
    const { organization_name, contactPhone, contactEmail } = await req.json();

    const [result] = await promisePool.query(
      "UPDATE organization SET organization_name = ?, contactPhone = ?, contactEmail = ? WHERE organization_id = ?",
      [organization_name, contactPhone, contactEmail, organization_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Organization updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating organization data:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

// DELETE request to delete an organization
export async function DELETE(req, { params }) {
  const organization_id = params.id;

  try {
    if (!organization_id) {
      return NextResponse.json({ message: "Organization ID is required" }, { status: 400 });
    }

    // ลบข้อมูลจากฐานข้อมูล
    const [result] = await promisePool.query(
      "DELETE FROM organization WHERE organization_id = ?",
      [organization_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Organization deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
