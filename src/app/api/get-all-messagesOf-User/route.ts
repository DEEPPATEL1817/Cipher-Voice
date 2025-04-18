import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
    await dbConnect()
    const session = await getServerSession(authOptions)
    //here User is a type of user
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message:"Not authenticated"
        },{status: 401})
    }
    // const userId = user._id;
    // we can use above method also to abstract userId from session but we already convert that user ID into string in auth/option file. so now ,where we convert it into mongoose id 

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        //we are using aggregation pipeline for user messages 

        const user = await UserModel.aggregate([
            { $match: {_id: userId } },
            //unwindding array 

            {$unwind: '$messages'},
            {$sort : {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push : '$messages'}}}
        ])

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message:"User not found"
           
         },{status: 401})
        }

        return Response.json({
            success: true,
            
            //in mongodb aggregation pipeline we get as a return in array so we abstract messages from first object array
            messages: user[0].messages
        },{status: 201})

    } catch (error) {
        console.log("An unexpected error occuried",error)
        return Response.json({
            success: false,
            message:"Not authenticated"
        },{status: 500})
    }
}