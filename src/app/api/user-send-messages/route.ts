import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user";
import { Message } from "@/models/user";

export async function POST(request: Request){
    await dbConnect()

    const {username, content} = await request.json()

    try {
        console.log("Received username:", username);

        const user = await UserModel.findOne({username})

        if (!user) {
            return Response.json({
                success: false,
                message:"User not found"
            },{status: 404})
        }

        //is user accepting the message..
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                
                message:"User is not accepting the messages"
            },{status: 400})
        }

        const newMessage = {content, createdAt: new Date()}

        // pushing this newMessage into the user when anybody anonymusly send messages

        user.messages.push(newMessage as Message)

        await user.save()

        return Response.json({
            success: true,
            message:"Message send successfully"
        },{status: 200})

    } catch (error) {
        console.log("error while adding messages",error)
        return Response.json({
            success: false,
            message:"Internal server error"
        },{status: 500})
    }
}