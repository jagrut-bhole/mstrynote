import {z} from 'zod'
import { UserModel } from '@/src/models/User'
import { dbConnect } from '@/src/lib/dbConnect'
import { usernameValidation } from '@/src/schemas/registerSchema'

const usernameQuerySchema = z.object({
    username : usernameValidation
});

export async function GET(request : Request) {
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url);
        const queryParams = {
            username : searchParams.get('username')
        }

        const result = usernameQuerySchema.safeParse(queryParams);

        console.log(result);
        if (!result.success) {
            const userNameErrors = result.error.format().username?._errors || [];

            return Response.json({
                message : userNameErrors,
                success : false
            },
        {
            status : 400
        })
        }

        const {username} = result.data

        const usercheck = await UserModel.findOne({
            username,
            isVerified : true
        })

        if (usercheck) {
            return Response.json({
                message : "Username aleady taken!!",
                success : false
            },{
                status : 400
            })
        } else {
            return Response.json({
                message : "Username is Unique",
                success : true
            },
        {
            status : 200
        })
        }
        
    } catch (error) {
        console.error("Error while validating the Username",error);
        return Response.json({
            success : false,
            message : "Internal Server Error while checking the username!!"
        },
    {
        status : 500
    })
    }
}