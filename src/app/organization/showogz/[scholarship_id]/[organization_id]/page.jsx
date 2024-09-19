"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navber from "@/app/components/Navber";
import Foter from "@/app/components/Foter";
import { useSession } from "next-auth/react";

function ViewCombinedPage({ params }) {
  const { organization_id } = params;
  const [data, setData] = useState({});
  const [editData, setEditData] = useState({
    organization_name: '',
    contactPhone: '',
    amount: '',
    workType: '',
    workTime: '',
    required_level: '',
    skill_type_name: ''
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  // ตรวจสอบการเข้าสู่ระบบ
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [status, session, router]);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    if (organization_id) {
      fetchCombinedData(organization_id);
    }
  }, [organization_id]);

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchCombinedData = async (organization_id) => {
    try {
      const res = await fetch(`/api/scholarshiporganization/${organization_id}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch combined data");
      }

      const data = await res.json();
      setData(data);

      // ตั้งค่าให้ editData มีข้อมูลที่ได้จาก API
      setEditData({
        organization_name: data.organization_name || '',
        contactPhone: data.contactPhone || '',
        amount: data.amount || '',
        workType: data.workType || '',
        workTime: data.workTime ? JSON.parse(data.workTime).join(', ') : '',
        required_level: data.required_level || '',
        skill_type_name: data.skill_type_name || ''
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("เกิดข้อผิดพลาดระหว่างการดึงข้อมูล");
    }
  };

  // ฟังก์ชันการอัปเดตข้อมูล
  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/scholarshiporganization/${organization_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization_name: editData.organization_name,
          contactPhone: editData.contactPhone,
          amount: editData.amount,
          workType: editData.workType,
          workTime: editData.workTime.split(', '), // เปลี่ยนเป็น array
          required_level: editData.required_level,
          skill_type_name: editData.skill_type_name
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update data');
      }

      const updatedData = await res.json();
      setData(updatedData);
      alert('ข้อมูลได้รับการอัปเดตเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error updating data:', error);
      setError('เกิดข้อผิดพลาดระหว่างการอัปเดตข้อมูล');
    }
  };

  return (
    <div>
      <Navber session={session} />
      <div className="แถบสี"></div>
      <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">View and Edit Combined Data</h3>
        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

        <div>
          <h3 className="text-gray-700">ชื่อหน่วยงาน</h3>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={editData.organization_name}
            onChange={(e) => setEditData({ ...editData, organization_name: e.target.value })}
          />
        </div>
        <div>
          <h3 className="text-gray-700">เบอร์โทรศัพท์ติดต่อ</h3>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={editData.contactPhone}
            onChange={(e) => setEditData({ ...editData, contactPhone: e.target.value })}
          />
        </div>
        <div>
          <h3 className="text-gray-700">จำนวนนิสิตที่รับ</h3>
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={editData.amount}
            onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
          />
        </div>
        <div>
          <h3 className="text-gray-700">ประเภทเวลาในการทำงาน</h3>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={editData.workType}
            onChange={(e) => setEditData({ ...editData, workType: e.target.value })}
          />
        </div>
        <div>
          <h3 className="text-gray-700">เวลาทำงาน</h3>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={editData.workTime}
            onChange={(e) => setEditData({ ...editData, workTime: e.target.value })}
          />
        </div>
        <div>
          <h3 className="text-gray-700 mt-4">ระดับทักษะที่ต้องการ</h3>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={editData.required_level}
            onChange={(e) => setEditData({ ...editData, required_level: e.target.value })}
          />
        </div>
        <div>
          <h3 className="text-gray-700 mt-4">ทักษะที่เกี่ยวข้อง</h3>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={editData.skill_type_name}
            onChange={(e) => setEditData({ ...editData, skill_type_name: e.target.value })}
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          อัปเดตข้อมูล
        </button>
      </div>
      <Foter />
    </div>
  );
}

export default ViewCombinedPage;
