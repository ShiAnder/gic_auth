"use server";

import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";


export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);

    if(!validatedFields.success){
        return {error: "Invalid Email!"}
    }

    const {email} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if(!existingUser){
        return {error: "Email does not exist!"};
    }

    //TODO: Generate token & Send Reset Email
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
        passwordResetToken.email, 
        passwordResetToken.token,
    );

    return {success: "Reset email sent!"};
}

