
import UserModel,{ User } from "@/models/user";
import { Account } from "next-auth";
import dbConnect from "@/lib/dbConnection";


export const isOAuthUser = (account: Account | null):  account is Account => {
    return account?.provider === 'google' || account?.provider === 'github';
};

export interface OAuthProfile {
    email?: string;
    username?: string;
    name?: string;
}

export const handleOAuthUser = async (user: OAuthProfile, account: Account): Promise<User> => {
    await dbConnect();
    const existingUser = await UserModel.findOne({
        $or: [
            { email: user.email },
            { username: user.username }
        ]
    });

    if (!existingUser) {
        const newUser = await UserModel.create({
            username: user.username,
            email: user.email,
            isVerified: true,
            isAcceptingMessages: true,
            provider: account.provider
        });
        return newUser;
    }

    if (existingUser.provider !== account.provider) {
        existingUser.provider = account.provider;
        await existingUser.save();
    }

    return existingUser;
};