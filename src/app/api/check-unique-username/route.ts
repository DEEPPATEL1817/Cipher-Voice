import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user";
import {z} from 'zod'
import {usernameValidation} from '@/schemas/signUpSchema'

//here we are checking when user enter his username at that time we validate that the particular username is available or not without sending request to the db...while in sign-in route we call the db to check username is available or not .while in this we check while user enter the username ..
const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){

    await dbConnect()

    try {
     const {searchParams} = new URL(request.url)

     const queryParam = {username: searchParams.get('username')}

     //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam)

    console.log("result:",result)

    if(!result.success){
        const usernameErrors = result.error.format().username?._errors || []

        return Response.json({
            success:false,
            message: usernameErrors
        },{status:400})
    }

    const {username} = result.data

    const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

    if (existingVerifiedUser) {
        return Response.json({
            success: false,
            message:"Already Username Taken"
        },{status: 400})
    }

    return Response.json({
        success: true,
        message:"available username"
    },{status: 200})


    } catch (error) {
        console.log("error checking username",error)
        return Response.json({
            success: false,
            message:"Error checking username"
        },{status: 500})
    }
}