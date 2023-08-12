import { connectToDb } from "@/utils"
import { NextResponse } from "next/server";
import prisma from './../../../prisma/index';
import bcrypt from 'bcrypt'

export const POST = async (req: Request) => {
    try {
        // getting data from frontend
        const { email, password } = await req.json();
        // validating details
        if (!email || !password) {
            return NextResponse.json({ error: "Invalid Data" }, { status: 422 });
            // 422 ->  Unprocessable Entity -> means the data cannot be processed.
        }
        // making database connection
        await connectToDb();

        // fetching existing user from database
        const existingUser = await prisma.user.findFirst({where: { email }});
        // validating
        if(!existingUser){
            return NextResponse.json({error: "User not found"},{status:401});
        }
        // matching the password with the actual password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect){
            return NextResponse.json({ error: "Invalid Credentials" }, { status: 403 });
        }

        return NextResponse.json({ message: "Logged in" }, { status: 200 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
        // 500 -> Internal Server Error
    } finally {
        await prisma.$disconnect();
    }
}