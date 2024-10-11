import { json } from "formidable";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        
        const data = await req.json();

        // console.log(data,"tail");
        

        const { organizations, students } = data

        // console.log({organizations},"orgggg");
        

        const response = await fetch('http://127.0.0.1:5000/match',
            {
                method:"POST" ,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        )

        const res = await response.json();

        console.log(res);
        
        if(response.ok) {
            
            return NextResponse.json(res , { status: 200 });
        }else{
            const errorResponse = await response.json();
            return NextResponse.json({ error: 'Fail', details: errorResponse }, { status: response.status });
        }
  
    //   return NextResponse.json(students, organizations , { status: 200 });
    } catch (error) {
      console.error("back เกิดข้อผิดพลาดระหว่างการดึงข้อมูล:", error);
      return NextResponse.json(
        { message: "back เกิดข้อผิดพลาดระหว่างการดึงข้อมูล." },
        { status: 500 }
      );
    }
  }
  