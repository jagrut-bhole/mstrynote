import { dbConnect } from "@/src/lib/dbConnect"
import { UserModel } from "@/src/models/User"
import { Message } from "@/src/models/User"

export async function POST(request :Request) {
    await dbConnect();

    try {
        const {username,content} = await request.json();

        if (!username || !content) {
            return Response.json({
            message : "Please provide the username and message content.",
            success : false
        },{
            status : 400
        });
        }

        const user = await UserModel.findOne({
            username
        });

        if (!user) {
            return Response.json({
            message : "User not found!!",
            success : false
        },{
            status : 404
        });
        }

        // checking is user accepting the messages!!!

        if (!user.isAcceptingMessage) {
            return Response.json({
            message : "User is not currently accepting messages.",
            success : false
        },{
            status : 403
        });
        }

        // Validate message length according to the Message schema
        const trimmed = String(content).trim();
        if (trimmed.length < 20) {
            return Response.json({
                message: "Message must be at least 20 characters long.",
                success: false
            }, { status: 400 });
        }

        const newMessage = {
            message: trimmed,
            createdAt: new Date()
        };

        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            message : "Message sent successfully!!",
            success : true
        },{
            status : 200
        });

    } catch (error) {
        console.error("Error while sending the message:", error);
        return Response.json({
            message : "Internal server error while sending the message.",
            success : false
        },{
            status : 500
        });
    }
}