import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user";
import { User } from "next-auth";

//post request to toggle the button on/off for accepting messages

export async function POST(request : Request){
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
    const userId = user._id;

    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage : acceptMessages},
            {new : true}
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message:"failed to update user status for accepting message"
            },{status: 401})
        }
        return Response.json({
            success: true,
            message:"Message acceptance status updated successfully"
        },{status: 201})

    } catch (error) {
        console.log("failed to update user status for accepting messages",error)
        return Response.json({
            success: false,
            message:"failed to update user status for accepting messages"
        },{status: 501})
    }


}


export async function GET(request: Request){
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
    const userId = user._id;

   try {
     const foundUser = await UserModel.findById(userId)
 
     if (!foundUser) {
         return Response.json({
             success: false,
             message:"User not found"
         },{status: 404})
     }
 
     return Response.json({
         success: true,
         isAcceptingMessages : foundUser.isAcceptingMessage,
         message:"User found"
     },{status: 200})
   } catch (error) {
    console.log("Error in Accepting messages",error)
    return Response.json({
        success: false,
        message:"Error in Accepting messages"
    },{status: 501})
   }
}