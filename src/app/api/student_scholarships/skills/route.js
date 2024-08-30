import Skills from '../../../models/skills';

// Handle GET request to fetch all skills
export async function GET() {
  try {
    const skills = await Skills.getAll();
    return new Response(JSON.stringify(skills), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

// Handle POST request to create a new skill
export async function POST(request) {
  try {
    const skillData = await request.json();
    const result = await Skills.create(skillData);
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

// Handle PUT request to update a skill by ID
export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const updatedData = await request.json();
    const result = await Skills.update(id, updatedData);
    if (result.affectedRows === 0) {
      return new Response('Skill not found', { status: 404 });
    }
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

// Handle DELETE request to delete a skill by ID
export async function DELETE({ params }) {
  const { id } = params;
  try {
    const result = await Skills.delete(id);
    if (result.affectedRows === 0) {
      return new Response('Skill not found', { status: 404 });
    }
    return new Response('Skill deleted', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
