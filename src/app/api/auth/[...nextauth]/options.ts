import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from 'bcrypt'
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/user";
import { isOAuthUser, handleOAuthUser, OAuthProfile } from "@/helpers/authenticationHelper"




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
            async authorize(
                credentials: Record<"identifier" | "password", string> | undefined
            ): Promise<User | null> {
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
                        user.password || ""
                    );

                    if (!isValidPassword) return null;

                    return {
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                        isVerified: user.isVerified,
                        isAcceptingMessages: user.isAcceptingMessage
                    } as User;
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
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    _id: profile.id,
                    name: profile.name || profile.login,
                    email: profile.email,
                    username: profile.login,
                    isVerified: true,
                    isAcceptingMessages: true,
                    provider: 'GitHub'

                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                    response_type: "code",
                },
            },
            profile(profile) {
                const username = profile.name
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');

                return {
                    id: profile.sub,
                    _id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    username: username,
                    image: profile.picture,
                    isVerified: true,
                    isAcceptingMessages: true,
                    provider: 'google'

                }
            }
        })
    ],

    callbacks: {
        async signIn({ user, account }) {
            console.log("info from google or github of user:", user)
            console.log("info from google or github of account:", account)
            if (account?.provider === 'credentials') {
                return true; // Credential flow already handled in authorize
            }

            if (account && isOAuthUser(account)) {
                if (!user.email || !user.username) {
                    console.error("Missing email or username from OAuth provider.");
                    return false;
                }
                try {
                    const dbUser = await handleOAuthUser(user as OAuthProfile, account);
                    // console.log("dbUser :", user)

                    user.username = dbUser.username;
                    user._id = dbUser._id.toString();
                    user.isVerified = dbUser.isVerified;
                    user.isAcceptingMessages = dbUser.isAcceptingMessage;
                    return true;
                } catch (error) {
                    console.error("OAuth sign-in error:", error);
                    return false;
                }
            }

            return false;
        },

        async jwt({ token, user }) {
            if (user) {
                token._id = user._id;
                token.email = user.email as string;
                token.username = user.username;
                token.isVerified = user.isVerified ?? true;
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