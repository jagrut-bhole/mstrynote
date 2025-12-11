import { dbConnect } from "@/src/lib/dbConnect";
import { UserModel } from "@/src/models/User";

export async function POST(request : Request) {

    await dbConnect();
    try{
        const {username,verifyCode} = await request.json();

        const decodedUsername = decodeURIComponent(username);

        console.log("Username : ",decodedUsername);
        console.log("verifyCode  : ",verifyCode);

        const user = await UserModel.findOne({
            username : decodedUsername
        });

        if (!user) {
            return Response.json({
                success: false,
                message : "User does not exists!!"
            },{
                status : 400
            })
        } 

        const isCodeValid = user.verifyCode === verifyCode;
        const isCodeNotExpire = new Date(user.verifyCodeExpiry) > new Date();

            if(isCodeValid && isCodeNotExpire) {
                user.isVerified = true;
                await user.save()

                return Response.json({
                        message : "User verified successfully!!!",
                        success : true
                    },
                    {
                        status:201
                    }
                )
            } else if(!isCodeNotExpire) {
                return Response.json({
                        message : "Code is expired!!",
                        success : false
                    },
                {
                    status:500
                })
            } else {
                return Response.json({
                        message : "Invalid Code, please register again",
                        success : false
                    },
                    {
                        status:500
                    })
            }
    } catch(error) {
        console.log("Error while verifying the code", error);
        return Response.json({
            message : "Error while verifying the code",
            success : false
        },
    {
        status:500
    })
    }
}