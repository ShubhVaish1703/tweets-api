import { connectToDb } from "@/utils"
import { NextResponse } from "next/server";
import prisma from './../../../prisma/index';

export const GET = async (req: Request) => {
    try {

        // making database connection
        await connectToDb();
        // searching all the users in database
        const users = await prisma.user.findMany({ include: { tweets: true, _count: true } });
        // returning users in response
        return NextResponse.json({ users }, { status: 200 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
        // 500 -> Internal Server Error
    } finally {
        // disconnecting to the database
        await prisma.$disconnect();
    }
}