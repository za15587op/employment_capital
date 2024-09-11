import { NextResponse } from "next/server";
import scholarshiporganization from "../../../../models/scholarshiporganization"; // ตรวจสอบการ import ให้แน่ใจว่า path ถูกต้อง

// POST: Create a new scholarship organization
export async function POST(req) {
  try {
    const scholarshiporganizationData = await req.json(); // Get the scholarship organization data from the request

    await scholarshiporganization.create(scholarshiporganizationData); // Use the create method from the scholarshiporganization model

    return NextResponse.json(
      { message: "Scholarshiporganization created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating scholarshiporganization:", error);
    return NextResponse.json(
      { message: "An error occurred during scholarshiporganization creation." },
      { status: 501 }
    );
  }
}

// PUT: Update a scholarship organization
export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const scholarship_organ_id = url.searchParams.get("scholarship_organ_id"); // ดึง scholarship_organ_id จาก URL query parameter

    if (!scholarship_organ_id) {
      return NextResponse.json(
        { message: "ScholarshipOrganization ID is required." },
        { status: 400 }
      );
    }

    const { scholarship_id, organization_id, amount, required_parttime } = await req.json(); // Get the scholarship organization data from the request

    // Use the update method from the scholarshiporganization model
    await scholarshiporganization.update(scholarship_organ_id, {
      scholarship_id,
      organization_id,
      amount,
      required_parttime,
    });

    return NextResponse.json(
      { message: "Scholarshiporganization updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating scholarshiporganization:", error);
    return NextResponse.json(
      { message: "An error occurred during scholarshiporganization update." },
      { status: 500 }
    );
  }
}

// DELETE: Delete a scholarship organization
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const scholarship_organ_id = url.searchParams.get("scholarship_organ_id"); // Get scholarship_organ_id from URL query parameter

    if (!scholarship_organ_id) {
      return NextResponse.json(
        { message: "ScholarshipOrganization ID is required." },
        { status: 400 }
      );
    }

    await scholarshiporganization.delete(scholarship_organ_id); // Use the delete method from the scholarshiporganization model

    return NextResponse.json(
      { message: "Scholarshiporganization deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting scholarshiporganization:", error);
    return NextResponse.json(
      { message: "An error occurred during scholarshiporganization deletion." },
      { status: 500 }
    );
  }
}

// GET: Fetch all scholarship organizations
// export async function GET(req) {
//   try {
//     const scholarshiporganizations = await scholarshiporganization.getAll(); // Use the getAll method from the scholarshiporganization model

//     return NextResponse.json(scholarshiporganizations, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching scholarshiporganizations:", error);
//     return NextResponse.json(
//       { message: "An error occurred while fetching scholarshiporganizations." },
//       { status: 500 }
//     );
//   }
// }

// GET: Fetch all scholarship organizations
export async function GET(req) {
  try {
    const scholarshiporganizations = await scholarshiporganization.getAll();
    console.log("Fetched Scholarship Organizations:", scholarshiporganizations); // ตรวจสอบข้อมูลที่ดึงมา
    return NextResponse.json(scholarshiporganizations, { status: 200 });
  } catch (error) {
    console.error("Error fetching scholarshiporganizations:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching scholarshiporganizations." },
      { status: 500 }
    );
  }
}