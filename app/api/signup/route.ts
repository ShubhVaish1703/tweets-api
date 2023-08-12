import { connectToDb } from "@/utils"
import { NextResponse } from "next/server";
import prisma from './../../../prisma/index';
import bcrypt from 'bcrypt'

export const POST = async (req: Request) => {
    try {
        // getting data from frontend
        const { name, email, password } = await req.json();
        // validating details
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Invalid Data" }, { status: 422 });
            // 422 ->  Unprocessable Entity -> means the data cannot be processed.
        }
        // making database connection
        await connectToDb();
        // checking for existing user
        const existingUser = await prisma.user.findFirst({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 403 });
            // 403 -> forbidden, server understands the request but refuses to authorize
        }
        // hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // creating a new user record
        const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });

        return NextResponse.json({ user }, { status: 201 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
        // 500 -> Internal Server Error
    } finally {
        await prisma.$disconnect();
    }
}