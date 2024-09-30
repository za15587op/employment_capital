import { NextResponse } from "next/server";

export async function POST(req) {
  if (req.method === 'POST') {
    const { features } = await req.json(); // อ่าน request body ในรูปแบบ JSON

    try {
      // เรียกใช้ Flask API
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
      });

      const data = await response.json();
      
      // ตอบกลับด้วย JSON
      return NextResponse.json(data, { status: 200 });
      
    } catch (error) {
      console.error("Error calling Flask API:", error);
      
      // ตอบกลับกรณีเกิดข้อผิดพลาด
      return NextResponse.json({ error: "Error calling Flask API" }, { status: 500 });
    }
  } else {
    // ตอบกลับถ้า method ไม่ใช่ POST
    return NextResponse.json({ message: 'Only POST requests allowed' }, { status: 405 });
  }
}
