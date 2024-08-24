import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import promisePool from '../../../../lib/db';

export async function POST(req) {

    console.log(req);
    
    try {
        const { username, password } = await req.json();
        const userRole = "student";

        console.log("Username: ", username);
        console.log("Password: ", password);

        // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
        const [existingUser] = await promisePool.query(
            'SELECT * FROM user WHERE username = ?',
            [username]
        );

        if (existingUser.length > 0) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // แฮชรหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);

        // เพิ่มผู้ใช้ใหม่ด้วยรหัสผ่านที่ถูกแฮช
        await promisePool.query(
            'INSERT INTO user (username, password, user_role) VALUES (?, ?, ?)',
            [username, hashedPassword, userRole]
        );

        return NextResponse.json({ message: "User registered successfully." }, { status: 201 });

    } catch (error) {
        console.error("Error during registration:", error); // ช่วยให้คุณเห็นข้อผิดพลาดที่เกิดขึ้น
        return NextResponse.json({ message: "An error occurred during registration." }, { status: 500 });
    }
}
