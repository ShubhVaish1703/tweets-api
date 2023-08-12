import { connectToDb } from "@/utils"
import { NextResponse } from "next/server";
import prisma from './../../../../prisma/index';

// fetching a single tweet
export const GET = async (req: Request, content: { params: { id: string } }) => {
    try {
        // making database connection
        await connectToDb();
        // fetching single tweet by its id
        const tweet = await prisma.tweets.findFirst({ where: { id: content.params.id } });
        // returning tweet in response
        return NextResponse.json({ tweet }, { status: 200 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
        // 500 -> Internal Server Error
    } finally {
        // disconnecting to the database
        await prisma.$disconnect();
    }
}

// updating a tweet
export const PUT = async (req: Request, content: { params: { id: string } }) => {
    const { tweet } = await req.json();
    if (!tweet) {
        return NextResponse.json({ error: "Invalid Data" }, { status: 403 })
    }
    // { where: { id: content.params.id } }
    try {
        // making database connection
        await connectToDb();
        // fetching single tweet by its id
        const updatedTweet = await prisma.tweets.update({ data: { tweet }, where: { id: content.params.id } });
        // returning tweet in response
        return NextResponse.json({ updatedTweet }, { status: 200 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
        // 500 -> Internal Server Error
    } finally {
        // disconnecting to the database
        await prisma.$disconnect();
    }
}

// delete a tweet
export const DELETE = async (req: Request, content: { params: { id: string } }) => {
    try {
        // making database connection
        await connectToDb();
        // fetching single tweet by its id
        const tweet = await prisma.tweets.delete({ where: { id: content.params.id } });
        // returning tweet in response
        return NextResponse.json({ tweet }, { status: 200 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
        // 500 -> Internal Server Error
    } finally {
        // disconnecting to the database
        await prisma.$disconnect();
    }
}