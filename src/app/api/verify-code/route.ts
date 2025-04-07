import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, code} = await request.json()

        //inbuilt method decodeURIComponent
        const decodeUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({username: decodeUsername})

        if (!user) {
            return Response.json({
                success: false,
                message:"User not found"
            },{status: 500})
        }

        const isCodeValid = user.verifyCode === code

        const isCodeNotExp = new Date(user.verifyCodeExp) >  new Date() 

        if (isCodeValid && isCodeNotExp) {
            user.isVerified = true,
            await user.save()

            return Response.json({
                success: true,
                message:"Account verified successfully"
            },{status: 200})
        }else if(!isCodeNotExp){
            return Response.json({
                success: false,
                message:"otp or verification code is expired. Sign-in again "
            },{status: 400})

        }else{
            return Response.json({
                success: false,
                message:"Incorrect otp or code"
            },{status: 400})
        }
    } catch (error) {
        console.error("error verifying user through otp or verify code", error)
        return Response.json({
            success: false,
            message:"Error verifying user"
        },{status: 500})
    }
}