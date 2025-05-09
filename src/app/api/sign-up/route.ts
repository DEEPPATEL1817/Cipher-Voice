import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user";
import bcrypt from 'bcrypt'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

//this is a custom user authentication logic 
//registering new user 
//user can register username and password multiple times until they verify it with code after it wont allow user to register with same username or eamil

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json();

        const exitingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true })

        if (exitingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "username is already Taken"
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({ email })

        const verifyCode = Math.floor(10000 + Math.random() * 90000).toString()

        //if user is exist with email id
        if ((existingUserByEmail)) {
            //if user is there with email id and/but he is verified too        
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "user already exist with this email"
                }, { status: 400 })
            }
            //if user is there but not verified so update it..may user update his password .and now we have to send verification code 
            else {
                const hashPassword = await bcrypt.hash(password, 10);

                existingUserByEmail.password = hashPassword;

                existingUserByEmail.verifyCode = verifyCode;

                existingUserByEmail.verifyCodeExp = new Date(Date.now() + 3600000)

                await existingUserByEmail.save()

            }
            //if user is not exit with email id 
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExp: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()

        }

        //send verification email 

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        console.log("emailResponse: ", emailResponse)

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "User registered successfully.please verify your email"
        }, { status: 201 })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("error registering user:", error.message)
            return Response.json({
                success:false,
                message: "error regiestering user"
            },{status: 500})
        } else {
            console.error("error registering user:", error)
            return Response.json({
                success: false,
                message: "An unknown error occurred"
            }, { status: 500 });
        }
    }
}


