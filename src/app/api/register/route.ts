import { dbConnect } from "@/src/lib/dbConnect";
import { UserModel } from "@/src/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/src/services/sendVerificationEmail";

export async function POST(request : Request) {

    await dbConnect();

    try {

        const { username , email , password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified : true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success : false,
                message : "User Already taken!!"
            } , {
                status : 400
            })
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        });

            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        if (existingUserByEmail) {
            
            if(existingUserByEmail.isVerified) {
                return Response.json({
                    success : false,
                    message : "User already exists with this email"
                },
            {
                status : 400
            })
            } else {
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 360000)

                await existingUserByEmail.save();
            }

        } else {
            const hashedPassword = await bcrypt.hash(password , 10);

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password : hashedPassword,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
                isAcceptingMessage : true,
                message : []
            });

            await newUser.save();
        }

        //sending email verification

        const emailReponse = await sendVerificationEmail(
            email,
            username, 
            verifyCode
        );

        console.log("Email Response: ",emailReponse);

        if (!emailReponse.success) {
            return Response.json({
                success: false,
                message : emailReponse.message
            },
        {
            status: 400
        })
        }

        return Response.json({
            success : true,
            message : "Verification email sent successfully!!"
        },
    {
        status: 200
    })

    } catch (error) {
        console.log("Error while registering the user!!",error);
        return Response.json(
            {
                success : false,
                message : "Error whil registering the user!!"
            },
            {
                status : 500
            }
        )
    }

}