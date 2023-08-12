import { connectToDb } from "@/utils"
import { NextResponse } from "next/server";
import prisma from './../../../prisma/index';

export const GET = async (req: Request) => {
    try {

        // making database connection
        await connectToDb();
        // searching all the users in database
        const tweets = await prisma.tweets.findMany();
        // returning users in response
        return NextResponse.json({ tweets }, { status: 200 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
        // 500 -> Internal Server Error
    } finally {
        // disconnecting to the database
        await prisma.$disconnect();
    }
}

export const POST = async (req: Request) => {
    try {
        // getting data from frontend
        const { tweet, userId } = await req.json();
        // validating details
        if (!tweet || !userId) {
            return NextResponse.json({ error: "Invalid Data" }, { status: 422 });
            // 422 ->  Unprocessable Entity -> means the data cannot be processed.
        }
        // making database connection
        await connectToDb();
        // checking if the user exists or not
        const user = await prisma.user.findFirst({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 401 })
        }

        // creating a new tweet
        const newTweet = await prisma.tweets.create({ data: { tweet, userId } });

        return NextResponse.json({ tweet: newTweet }, { status: 201 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
        // 500 -> Internal Server Error
    } finally {
        await prisma.$disconnect();
    }
}