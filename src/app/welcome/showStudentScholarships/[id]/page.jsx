'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navber from '@/app/components/Navber';
export default function ShowScholarship({ params }) {
  const { id: scholarship_id } = params;
  const [scholarshipData, setScholarshipData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchScholarshipData = async () => {
      try {
        const response = await fetch(`/api/showStudentScholarships/${scholarship_id}`);
        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลทุนการศึกษาได้');
        }
        const data = await response.json();
        setScholarshipData(data);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลทุนการศึกษา:', error);
      }
    };

    fetchScholarshipData();
  }, [scholarship_id]);

  const handleUpdate = (student_id) => {
    router.push(`/welcome/editstudent_scholarships/${student_id}`);
  };


  const handleDelete = async (student_id) => {
    if (!window.confirm('คุณต้องการลบทุนการศึกษานี้ใช่หรือไม่?')) {
      return;
    }

    try {
      const response = await fetch(`/api/showStudentScholarships/${student_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id }),
      });

      if (!response.ok) {
        throw new Error('ไม่สามารถลบทุนการศึกษาได้');
      }

      // setScholarshipData((prevData) => prevData.filter((item) => item.student_id !== student_id));
      alert('ลบทุนการศึกษาเรียบร้อยแล้ว');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบทุนการศึกษา:', error);
      alert('เกิดข้อผิดพลาดในการลบทุนการศึกษา');
    }
  };

  if (!scholarshipData) {
    return <div>กำลังโหลด...</div>;
  }

  // ถ้า API ส่งกลับมาเป็นวัตถุเดียว ให้นำมันใส่ในอาร์เรย์
  const dataArray = Array.isArray(scholarshipData) ? scholarshipData : [scholarshipData];

  console.log(dataArray);
  

  return (
    <div>
      <h1>สถานะการศึกษาทุน</h1>
      {dataArray.map((item) => (
        <div key={item.student_id}>
          <p><strong>ชื่อ:</strong> {item.student_firstname}</p>
          <p><strong>นามสกุล:</strong> {item.student_lastname}</p>
          <p><strong>ปีการศึกษา:</strong> {item.academic_year}</p>
          <p><strong>เทอมการศึกษา:</strong> {item.academic_term}</p>
          <p><strong>ทักษะ:</strong> {item.skill_name}</p>
          <p><strong>id:</strong> {item.student_id}</p>
          <p><strong>สาขา:</strong> {item.student_field}</p>
          <p><strong>หลักสูตร:</strong> {item.student_curriculum}</p>
          <p><strong>ชั้นปี:</strong> {item.student_year}</p>
          <p><strong>เบอร์โทร:</strong> {item.student_phone}</p>
          <p><strong>เกรด:</strong> {item.student_gpa}</p>
          <button onClick={() => handleUpdate(item.student_id)}>แก้ไข</button>
          <button onClick={() => handleDelete(item.student_id)}>ลบ</button>
        </div>
      ))}
    </div>
  );
}
