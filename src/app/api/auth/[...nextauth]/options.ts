import { NextAuthOptions ,RequestInternal } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user";


// //next auth is using for authentication in which credentials is used ..here just we can add github ,facebook anything in providers
// export const authOptions: NextAuthOptions = {
//     providers: [
//         CredentialsProvider({
//             id: "credentials",
//             name: "credentials",

            
//             credentials: {
//                 email: { label: "Email", type: "text", placeholder: "Email" },
//                 password: { label: "Password", type: "password", placeholder: "********" }
//             },
            
//             async authorize(credentials: any): Promise<any> {
//                 await dbConnect()
//                 try {
//                     const user = await UserModel.findOne({
//                         $or: [
//                             { email: credentials.identifier },
//                             { username: credentials.identifier }
//                         ]
//                     })

//                     if (!user) {
//                         throw new Error('No user found with this Email')
//                     }

//                     if (!user.isVerified) {
//                         throw new Error("please verify your account before login")
//                     }

//                     const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

//                     if (isPasswordCorrect) {
//                         return user
//                     } else {
//                         throw new Error("Incorrect password")
//                     }
//                 } catch (error) {
//                     if (error instanceof Error) {
//                         throw new Error(error.message);
//                     }
//                     throw new Error("Unknown error occurred during authorization");
//                 }
//             }
//         })
//     ],
//     callbacks: {
//         //here the user is came from providers 
//         //and we are shifting data from user to token
//         async jwt({ token, user }) {
            
//             if (user) {
//                 //we are send this many data along with the token other wise we have to call db again
//                 token._id = user._id?.toString();
//                 token.isVerified = user.isVerified;
//                 token.isAcceptingMessages = user.isAcceptingMessages;
//                 token.username = user.username
//             }
//             return token
//         },

//         async session({ session, token }) {
//             //we created a file name next-auth.d.ts there we can modules
//             if (token) {
//                 //here we take all the data of token to session ...token data is from above so we can extract the data from both token as well as sessions
//                 session.user._id = token._id 
//                 session.user.isVerified = token.isVerified
//                 session.user.isAcceptingMessages = token.isAcceptingMessages
//                 session.user.username = token.username
//             }
//             return session
//         },
//     },
//     pages: {
//         signIn: '/sign-in',
//     },
//     session: {
//         strategy: "jwt"
//     },
//     secret: process.env.NEXTAUTH_SECRET
// }



export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Email/Username",
            credentials: {
                identifier: {
                    label: "Email/Username",
                    type: "text",
                    placeholder: "jsmith@example.com"
                },
                password: { 
                    label: "Password", 
                    type: "password" 
                }
            },
            async authorize(credentials: Record<"identifier" | "password", string> | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">):Promise<any> {
                await dbConnect();
                
                if (!credentials?.identifier || !credentials.password) {
                    return null;
                };

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier.toLowerCase() },
                            { username: credentials.identifier.toLowerCase() }
                        ]
                    });

                    if (!user) return null;

                    if (!user.isVerified) {
                        throw new Error('AccountNotVerified');
                    }

                    const isValidPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isValidPassword) return null;

                    return {
                        _id: user._id, 
                        email: user.email,
                        username: user.username,
                        isVerified: user.isVerified,
                        isAcceptingMessages: user.isAcceptingMessage
                    };
                } catch (error) {
                    console.error('Authentication Error:', error);
                    if (error instanceof Error) {
                        if (error.message === 'AccountNotVerified') {
                            throw new Error('AccountNotVerified');
                        }
                    }
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id;
                token.email = user.email;
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.email = token.email;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
            }
            return session;
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};