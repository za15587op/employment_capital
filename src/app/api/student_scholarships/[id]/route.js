import { NextResponse } from 'next/server';
import promisePool from '../../../../../lib/db';

export async function GET(req, { params }) {
  const { id: student_id } = params;

  try {
    // Fetch the scholarship registration details based on the scholarship_id
    const [scholarshipRegistrations] = await promisePool.query(
      'SELECT * FROM ScholarshipRegistrations WHERE student_id = ?',
      [student_id]
    );

    // Fetch the student's skills and skill types associated with the scholarship
    const [skills] = await promisePool.query(
      'SELECT s.skill_name, ss.skill_level FROM Skills s JOIN StudentSkills ss ON s.skill_id = ss.skill_id WHERE ss.student_id = ?',
      [student_id]
    );

    const [selectedSkillTypes] = await promisePool.query(
      'SELECT st.skill_type_id, st.skill_type_name FROM SkillTypes st JOIN Skills_SkillTypes sst ON st.skill_type_id = sst.skill_type_id JOIN skills s ON s.skill_id = sst.skill_id JOIN studentskills ss ON ss.skill_id = sst.skill_id WHERE ss.student_id = ?',
      [student_id]
    );

    console.log(scholarshipRegistrations, 'scholarshipRegistrations');
    console.log(skills,'skills');
    console.log(selectedSkillTypes,'selectedSkillTypes');
    
    
    

    return NextResponse.json({
      scholarshipRegistrations,
      skills,
      selectedSkillTypes,
    });
  } catch (error) {
    console.error('Error fetching scholarship registration details:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id: scholarship_id } = params;
  const { student_id, skills, scholarshipRegistrations, selectedSkillTypes, studentSkills } = await req.json();

  try {
    // Update the ScholarshipRegistrations table
    for (const registration of scholarshipRegistrations) {
      await promisePool.query(
        'UPDATE ScholarshipRegistrations SET is_parttime = ?, is_parttimedate = ?, related_works = ? WHERE scholarship_id = ? AND student_id = ?',
        [
          registration.is_parttime,
          registration.is_parttimedate,
          registration.related_works,
          scholarship_id,
          student_id,
        ]
      );
    }

    // Update the Skills and StudentSkills tables
    for (const skill of skills) {
      const [result] = await promisePool.query(
        'SELECT skill_id FROM Skills WHERE skill_name = ?',
        [skill.skill_name]
      );
      const skill_id = result[0]?.skill_id;

      if (skill_id) {
        await promisePool.query(
          'UPDATE StudentSkills SET skill_level = ? WHERE skill_id = ? AND student_id = ?',
          [studentSkills[skills.indexOf(skill)].skill_level, skill_id, student_id]
        );
      }
    }

    // Update the Skills_SkillTypes table
    for (const skillType of selectedSkillTypes) {
      await promisePool.query(
        'UPDATE Skills_SkillTypes SET skill_type_id = ? WHERE skill_id = (SELECT skill_id FROM Skills WHERE skill_name = ?) AND scholarship_id = ?',
        [
          skillType.skill_type_id,
          skills[selectedSkillTypes.indexOf(skillType)].skill_name,
          scholarship_id,
        ]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating scholarship registration details:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
