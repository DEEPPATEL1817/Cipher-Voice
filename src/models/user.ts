import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    _id: string;
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    _id: mongoose.Types.ObjectId | string;
    username: string,
    email: string,
    password?: string,
    verifyCode?: string,
    verifyCodeExp?: Date;
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[],
    provider: string,
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is req."],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is req."],
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: function () {
            return this.provider === 'credentials';
        }
    },
    verifyCode: {
        type: String,
        required: function () {
            return this.provider === 'credentials';
        }
    },
    verifyCodeExp: {
        type: Date,
        required: function () {
            return this.provider === 'credentials';
        }
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    provider: {
        type: String,
        required: true,
        enum: ['credentials', 'google', 'github'],
        default: 'credentials'
    },
    messages: [MessageSchema]

})

//export model 

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel