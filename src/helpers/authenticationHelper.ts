
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
    provider?: string
}

const formatUsername = (username: string): string => {
    return username
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')       // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove special characters
        .replace(/-+/g, '-')        // Replace multiple hyphens with single
        .replace(/^-|-$/g, '');     // Remove leading/trailing hyphens
};

export const handleOAuthUser = async (profile: OAuthProfile, account: Account): Promise<User> => {
    await dbConnect();

    const formattedUsername = formatUsername(profile.username || profile.name || "user");

    const existingUser = await UserModel.findOne({
        $or: [
            { email: profile.email },
            { username: formattedUsername}
        ]
    });

    if (!existingUser) {
        const newUser = await UserModel.create({
            username: formattedUsername,
            email: profile.email,
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