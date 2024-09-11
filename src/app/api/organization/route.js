import { NextResponse } from "next/server";
import Organization from "../../../../models/organization"; // ตรวจสอบการ import ให้แน่ใจว่า path ถูกต้อง

// POST: Create a new organization
export async function POST(req) {
  try {
    const organizationData = await req.json(); // Get the organization data from the request

    await Organization.create(organizationData); // Use the create method from the Organization model

    return NextResponse.json(
      { message: "Organization created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { message: "An error occurred during organization creation." },
      { status: 500 }
    );
  }
}

// PUT: Update an organization
export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const organization_id = url.searchParams.get("organization_id"); // ดึง organization_id จาก URL query parameter หรือจะดึงจาก body ก็ได้ตามการตั้งค่า

    if (!organization_id) {
      return NextResponse.json(
        { message: "Organization ID is required." },
        { status: 400 }
      );
    }

    const { organization_name, contactPhone, contactEmail } = await req.json(); // Get the organization data from the request

    // Use the update method from the Organization model
    await Organization.update(organization_id, {
      organization_name,
      contactPhone,
      contactEmail,
    });

    return NextResponse.json(
      { message: "Organization updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { message: "An error occurred during organization update." },
      { status: 500 }
    );
  }
}

// DELETE: Delete an organization
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const organization_id = url.searchParams.get("organization_id"); // Get organization_id from URL query parameter

    if (!organization_id) {
      return NextResponse.json(
        { message: "Organization ID is required." },
        { status: 400 }
      );
    }

    await Organization.delete(organization_id); // Use the delete method from the Organization model

    return NextResponse.json(
      { message: "Organization deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json(
      { message: "An error occurred during organization deletion." },
      { status: 500 }
    );
  }
}

// GET: Fetch all organization
export async function GET(req) {
  try {
    const organization = await Organization.getAll(); // Use the getAll method from the Organization model

    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching organization." },
      { status: 500 }
    );
  }
}