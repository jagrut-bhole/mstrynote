import { transporter } from "../lib/mailer";
import { render } from "@react-email/render";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        // Render the React email component to HTML
        const emailHtml = await render(
            VerificationEmail({
                username,
                verifyCode
            })
        );

        // Send email using nodemailer
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'MstryNote'}" <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: "MstryNote | Verification Mail",
            html: emailHtml,
        });

        console.log("Email sent successfully. Message ID:", info?.messageId || 'N/A');

        return {
            success: true,
            message: "Verification mail sent successfully!!"
        };

    } catch (EmailError) {
        console.error("Sending verification email Error:", EmailError);

        return {
            success: false,
            message: "Failed to send Verification Email"
        };
    }
}