import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user";
import { User } from "next-auth";



export async function DELETE(request : Request , context: {params:{messageid: string}}) {
    const messageid = context.params.messageid
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

    try {
        const updateResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageid}}}
        )
        if (updateResult.modifiedCount == 0) {
            return Response.json({
                success:false,
                message: "Message not found or already Deleted"
            },{status: 404})
        }

        return Response.json(
            {
                success: false,
                message : " messsage deleted"
            },{status: 200}
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message : "Error deleting message",error
            },{status: 500}
        )
    }
    
}