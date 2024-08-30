import StudentSkills from '../../../models/StudentSkills';

// Handle POST request to create a new student skill
export async function POST(request) {
  try {
    const studentSkillData = await request.json();
    const result = await StudentSkills.create(studentSkillData);
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

// Handle GET request to fetch all student skills or skills for a specific student
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const std_id = searchParams.get('std_id');

  try {
    if (std_id) {
      const skills = await StudentSkills.findByStudentId(std_id);
      return new Response(JSON.stringify(skills), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      const skills = await StudentSkills.getAll();
      return new Response(JSON.stringify(skills), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

// Handle PUT request to update a student skill by student ID and skill ID
export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const std_id = searchParams.get('std_id');
  const skill_id = searchParams.get('skill_id');

  try {
    const updatedData = await request.json();
    const result = await StudentSkills.update(std_id, skill_id, updatedData);
    if (result.affectedRows === 0) {
      return new Response('Student skill not found', { status: 404 });
    }
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

// Handle DELETE request to delete a student skill by student ID and skill ID
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const std_id = searchParams.get('std_id');
  const skill_id = searchParams.get('skill_id');

  try {
    const result = await StudentSkills.delete(std_id, skill_id);
    if (result.affectedRows === 0) {
      return new Response('Student skill not found', { status: 404 });
    }
    return new Response('Student skill deleted', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
