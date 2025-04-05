import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Cipher | Verification Code',
            react: VerificationEmail({username, otp:verifyCode})
          });
        return {success:true ,message:' verication code send successfully on email'}
    } catch (emailError) {
        console.log("Error sending verification email",emailError)
        return {success:false ,message:'failed to send verication code on email'}
    }
}