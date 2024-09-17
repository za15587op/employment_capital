import { NextResponse } from "next/server";
import Scholarship from "../../../../models/scholarships"; // Import the Scholarship model

// POST: Create a new scholarship
export async function POST(req) {
  try {
    const scholarshipData = await req.json(); // Get the scholarship data from the request

    await Scholarship.create(scholarshipData); // Use the create method from the Scholarship model

    return NextResponse.json(
      { message: "Scholarship created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating scholarship:", error);
    return NextResponse.json(
      { message: "An error occurred during scholarship creation." },
      { status: 500 }
    );
  }
}

// // // PUT: Update a scholarship
// export async function PUT(req) {
//   try {
//     const {
//       application_start_date,
//       application_end_date,
//       academic_year,
//       academic_term,
//     } = await req.json(); // Get the scholarship data from the request

//     // Use the update method from the Scholarship model
//     await Scholarship.update(scholarship_id, {
//       scholarship_name,
//       application_start_date,
//       application_end_date,
//       academic_year,
//       academic_term,
//     });

//     return NextResponse.json(
//       { message: "Scholarship updated successfully." },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating scholarship:", error);
//     return NextResponse.json(
//       { message: "An error occurred during scholarship update." },
//       { status: 500 }
//     );
//   }
// }

// DELETE: Delete a scholarship
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const scholarship_id = url.searchParams.get('scholarship_id'); // Get scholarship_id from URL query parameter

    if (!scholarship_id) {
      return NextResponse.json(
        { message: "Scholarship ID is required." },
        { status: 400 }
      );
    }

    await Scholarship.delete(scholarship_id); // Use the delete method from the Scholarship model

    return NextResponse.json(
      { message: "Scholarship deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting scholarship:", error);
    return NextResponse.json(
      { message: "An error occurred during scholarship deletion." },
      { status: 500 }
    );
  }
}

// GET: Fetch all scholarships
export async function GET(req) {
  try {
    const scholarships = await Scholarship.getAll(); // Use the getAll method from the Scholarship model

    return NextResponse.json(scholarships, { status: 200 });
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching scholarships." },
      { status: 500 }
    );
  }
}
