import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
    const session = await getServerSession(authOptions);
    await dbConnect();
    
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }

    try {
        // Handle both string and ObjectId cases
        const userId = typeof user._id === 'string' 
            ? new mongoose.Types.ObjectId(user._id) 
            : user._id;

        // Using aggregation pipeline for user messages
        const users = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);

        if (!users || users.length === 0) {
            
            return Response.json({
                success: true,
                messages: []
            }, { status: 200 });
        }

        return Response.json({
            success: true,
            messages: users[0].messages
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