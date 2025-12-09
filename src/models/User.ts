import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
    message : string,
    createdAt : Date
}

const MessageSchema : Schema<Message> = new Schema({
    message : {
        type : String,
        required : true,
        minLength : [20 ,"Message must of minimum 20 characters"],
        maxLength : [300, "Message cannot more than 300 characters"]
    },
    createdAt : {
        type : Date,
        required : true
    }
})

export interface User {
    username : string;
    email : string;
    password: string;
    verifyCode : string,
    verifyCodeExpiry : Date;
    isVerified : boolean;
    isAcceptingMessage : boolean;
    message : Message[];
}

const UserSchema : Schema<User> = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        minLength : [3, "Username must be at least 3 characters"],
        maxLength : [20, "Username must be at most 20 characters"],
        trim : true,
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        trim : true,
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    password : {
        type : String,
        required : true,
        minLength : [8,"Password must be of 8 charactor"],
    },
    verifyCode : {
        type : String,
        required : [true , "Verify Code is required"],
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true , "Verify Code Expiry is required!!"]
    },
    isVerified : {
        type : Boolean,
        default : false,
    },
    isAcceptingMessage : {
        type : Boolean,
        default : true
    },
    message : [MessageSchema]
})

export const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model("User",UserSchema);