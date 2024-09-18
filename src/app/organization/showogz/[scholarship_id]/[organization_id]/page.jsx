"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navber from "@/app/components/Navber";
import Foter from "@/app/components/Foter";
import { useSession } from "next-auth/react";

function ViewCombinedPage({ params }) {
  const { organization_id } = params;
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (organization_id) {
      fetchCombinedData(organization_id);
    }
  }, [organization_id]);

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
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("เกิดข้อผิดพลาดระหว่างการดึงข้อมูล");
    }
  };

  return (
    <div>
      <Navber session={session} />
      <div className="แถบสี"></div>
      <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">View Combined Data</h3>
        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

        <div>
          <h3 className="text-gray-700">ชื่อหน่วยงาน</h3>
          <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            {data.organization_name || "N/A"}
          </p>
        </div>
        <div>
          <h3 className="text-gray-700">เบอร์โทรศัพท์ติดต่อ</h3>
          <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            {data.contactPhone || "N/A"}
          </p>
        </div>
        <div>
          <h3 className="text-gray-700">จำนวนนิสิตที่รับ</h3>
          <p className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            {data.amount || "N/A"}
          </p>
        </div>
        <div>
          <h3 className="text-gray-700">ประเภทเวลาในการทำงาน</h3>
          <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            {data.workType || "N/A"}
          </p>
        </div>
        <div>
          <h3 className="text-gray-700">เวลาทำงาน</h3>
          <div className="grid grid-cols-1 gap-2">
            {data.workTime ? (
              JSON.parse(data.workTime).map((time, index) => (
                <p key={index} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  {time}
                </p>
              ))
            ) : (
              <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">N/A</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-gray-700 mt-4">ระดับทักษะที่ต้องการ</h3>
          <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            {data.required_level || "N/A"}
          </p>
        </div>
        <div>
          <h3 className="text-gray-700 mt-4">ทักษะที่เกี่ยวข้อง</h3>
          <p className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            {data.skill_type_name || "N/A"}
          </p>
        </div>
      </div>
      <Foter />
    </div>
  );
}

export default ViewCombinedPage;
