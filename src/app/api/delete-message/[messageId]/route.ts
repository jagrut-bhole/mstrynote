import { dbConnect } from "@/src/lib/dbConnect";
import { UserModel } from "@/src/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request : Request, context: { params: Promise<{ messageId: string }> }
) {
    const { messageId } = await context.params;
    console.log("MessageId : ", messageId);

        await dbConnect();

        const session = await getServerSession(authOptions);
        const user = session?.user;

        const userId = user._id;

    try {

        const updatedResult = await UserModel.updateOne(
            {_id : userId},
            {$pull : {messages : {_id : messageId}}}
        )

        if(updatedResult.modifiedCount === 0) {
            return Response.json({
                success : false,
                message : "Message Not found!!"
            } ,{
                status : 404
            })
        }

        return Response.json({
            success : true,
            message : " Message Deleted SuccessFully!!"
        },
    {
        status : 200
    })

    } catch (error) {
        console.log("Error while deleteing the message: ",error);
        return Response.json({
            success : false,
            message : "Internal Server Error whi;e deleting the message!!"
        }), {
            status : 500
        }
    }
}