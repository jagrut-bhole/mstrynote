import { resend } from "../lib/resend";

import VerificationEmail from "@/emails/VerificationEmail";

import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
    email : string,
    username : string,
    verifyCode : string
) : Promise<ApiResponse> {
    try {

        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "MstryNote | Verification Mail",
            react: VerificationEmail({
                username,
                verifyCode
            }),
        });

        if (error) {
            console.error("Resend API Error:", error);
            return {
                success : false,
                message : `Failed to send email: ${error.message}`
            }
        }

        console.log("Email sent successfully:", data);

        return {
            success : true,
            message : "Verification mail send SuccessFully!!"
        }

    } catch (EmailError) {

        console.error("Sending verification email Error:", EmailError);

        return {
            success : false,
            message : "Failed to send Verification Email"
        }

    }
}