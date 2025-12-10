import { dbConnect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { UserModel } from "@/src/models/User";
import { User } from "next-auth";

export async function POST(request : Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user:User = session?.user

    if (!session || !session.user) {
        return Response.json({
            message : "Not Authenticated!!",
            success : false
        },
    {
        status : 404
    })

    }

     const userId = user._id;

    const { acceptingMessage } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage : acceptingMessage},
            {new : true}
        );

        if (!updatedUser) {
            return Response.json({
            message : "User not FOund!!",
            success : false
            },
        {
            status : 404
        })
        }

        return Response.json({
            message : "User status change successfully!!",
            success: true,
            updatedUser
        },
    {
        status : 201
    })
    } catch (error) {
        console.log("Failed to update the user status to accept message!!", error);
        return Response.json({
            message : "Not Authenticated!!",
            success : false
        },
    {
        status : 500
    })
    }
}

export async function GET(request : Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user;

    if (!session || !session.user) {
        return Response.json({
            message : "Not Authenticated!!",
            success : false
        },{
        status : 404
        });
    }

    const userId = user._id;

    try {
        const userFound = await UserModel.findById(userId);

        if (!userId) {
            return Response.json({
            message : "Not Authenticated!!",
            success : false
        },{
            status : 404
        });
        }
        
        return Response.json({
            success : true,
            isAcceptingMessage : userFound?.isAcceptingMessage
        },{
            status : 201
        })
    } catch (error) {

        console.log("Error while getting message acceptance status!!",error)
        return Response.json({
            message : "Error in getting message acceptance status!!",
            success : false
        },{
            status : 404
        });
    }

}