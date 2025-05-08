import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    await dbConnect();

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10)

    try {
        // Handle both string and ObjectId cases
        const userId = typeof user._id === 'string'
            ? new mongoose.Types.ObjectId(user._id)
            : user._id;


        const userAllMessage = await UserModel.findById(userId).select("messages");
        const totalMessages = userAllMessage?.messages?.length || 0;
        const totalPages = Math.ceil(totalMessages / limit);

        // Using aggregation pipeline for user messages
        const users = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);

        if (!users || users.length === 0) {

            return Response.json({
                success: true,
                messages: [],
                totalMessages: 0,
                totalPages,
            }, { status: 200 });
        }

        return Response.json({
            success: true,
            messages: users[0].messages,
            totalMessages: users[0].messages.length,
            totalPages,
        }, { status: 200 });

    } catch (error) {
        console.log("An unexpected error occurred:", error);


        if (error instanceof mongoose.Error.CastError) {
            return Response.json({
                success: false,
                message: "Invalid user ID format"
            }, { status: 400 });
        }

        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}