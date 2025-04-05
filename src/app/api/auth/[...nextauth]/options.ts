import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user";


//next auth is using for authentication in which credentials is used 
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password",placeholder: "********" }
              },
              async authorize(credentials: any): Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier.email},
                            {username: credentials.identifier.username}
                        ]
                    })

                    if (!user) {
                        throw new Error('No user found with this Email')
                    }

                    if (!user.isVerified) {
                        throw new Error("please verify your account before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)

                    if (isPasswordCorrect) {
                        return user
                    }else{
                        throw new Error("Incorrect password")
                    }
                } catch (error: any) {
                    throw new Error(error)
                }
              }
        })
    ],
    pages:{
        signIn: '/sign-in',
    },
    session:{

    }
}