import prisma from './../prisma/index';

// connection to database
export const connectToDb = async () => {
    try {
        await prisma.$connect();
    } catch (error: any) {
        return new Error(error.message)
    }
}