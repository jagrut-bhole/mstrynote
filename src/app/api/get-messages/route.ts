import { dbConnect } from "@/src/lib/dbConnect"
import { UserModel } from "@/src/models/User"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import mongoose from "mongoose"


export async function GET(request : Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !session.user){
        return Response.json({
            message : "Not Authenticated!!",
            success : false
        },{
            status : 404
        });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            {$match : {_id : userId}},  // match the user with the userId
            {$unwind : '$messages'},   //messages are store in the form of array so unwind it
            {$sort : {'messages.createdAt' : -1}},  // sort the array by new messsages first
            {$group : {_id : '$_id', messages : {$push : '$messages'}}} // now group all the arrays that are unwind under same userId
        ])

        if(!user || user.length === 0) {
            return Response.json({
            message : "User not found!!",
            success : false
        },{
            status : 404
        });
        }

        return Response.json({
            success : true,
            messages : user[0].messages,
        },{
            status : 200
        });

        
    } catch (error) {
        console.log("error while showing the user messsages: ",error);
        return Response.json({
            message : "User Messages not found!!",
            success : false
        },{
            status : 404
        });
    }
}
