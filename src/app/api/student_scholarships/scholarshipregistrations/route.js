import ScholarshipRegistrations from '../../../models/ScholarshipRegistrations';

// Handle POST request to create a new scholarship registration
export async function POST(request) {
  try {
    const registrationData = await request.json();
    const result = await ScholarshipRegistrations.create(registrationData);
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

// Handle GET request to fetch a scholarship registration by student ID and scholarship ID
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const std_id = searchParams.get('std_id');
  const scholarship_id = searchParams.get('scholarship_id');

  try {
    const registration = await ScholarshipRegistrations.findByIds(std_id, scholarship_id);
    if (!registration) {
      return new Response('Scholarship registration not found', { status: 404 });
    }
    return new Response(JSON.stringify(registration), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

// Handle PUT request to update a scholarship registration by student ID and scholarship ID
export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const std_id = searchParams.get('std_id');
  const scholarship_id = searchParams.get('scholarship_id');
  try {
    const updatedData = await request.json();
    const result = await ScholarshipRegistrations.update(std_id, scholarship_id, updatedData);
    if (result.affectedRows === 0) {
      return new Response('Scholarship registration not found', { status: 404 });
    }
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

// Handle DELETE request to delete a scholarship registration by student ID and scholarship ID
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const std_id = searchParams.get('std_id');
  const scholarship_id = searchParams.get('scholarship_id');
  try {
    const result = await ScholarshipRegistrations.delete(std_id, scholarship_id);
    if (result.affectedRows === 0) {
      return new Response('Scholarship registration not found', { status: 404 });
    }
    return new Response('Scholarship registration deleted', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
