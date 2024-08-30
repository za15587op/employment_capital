import Student from '../../../models/student';

// Handle GET request to fetch all students
export async function GET() {
  try {
    const students = await Student.getAll();
    return new Response(JSON.stringify(students), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

// Handle POST request to create a new student
export async function POST(request) {
  try {
    const studentData = await request.json();
    const result = await Student.create(studentData);
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

// Handle PUT request to update a student by ID
export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const updatedData = await request.json();
    const result = await Student.update(id, updatedData);
    if (result.affectedRows === 0) {
      return new Response('Student not found', { status: 404 });
    }
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

// Handle DELETE request to delete a student by ID
export async function DELETE({ params }) {
  const { id } = params;
  try {
    const result = await Student.delete(id);
    if (result.affectedRows === 0) {
      return new Response('Student not found', { status: 404 });
    }
    return new Response('Student deleted', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
