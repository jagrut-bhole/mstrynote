import { dbConnect } from "@/src/lib/dbConnect";
import { UserModel } from "@/src/models/User";

export async function DELETE(request : Request, {params} : {params : {messageId : string}}) {
        await dbConnect();

    const messageId = params.messageId;

    try {

        const updatedResult = await UserModel.updateOne(
            {_id : messageId},
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