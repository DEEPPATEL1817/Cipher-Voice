import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
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
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExp: Date;
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[]
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
        required:[true,"email is req."],
        trim:true,
        unique: true,
        match:[/.+\@.+\..+/,'please use a valid email address']
    },
    password:{
        type: String,
        required:[true,"password is req."],
    },
    verifyCode: {
        type: String,
        required:[true,"verify code is req."],
    },
    verifyCodeExp: {
        type: Date,
        required:[true,"verify code Expiry is req."],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages : [MessageSchema]

})

//export model 

const UserModel = (mongoose.models.User as mongoose.Model<User>)  || mongoose.model<User>("User",UserSchema)