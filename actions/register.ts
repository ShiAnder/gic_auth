"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";


export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);


    if(!validatedFields.success){
        return { error: "Invalid Fields !"};
    }

    const {email, password, name} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password,10);

    const existingUser = await getUserByEmail(email);

    if(existingUser){
        return {  error: "Email is already in use!"}
    }

    await db.user.create ({
        data: {
            name,
            email,
            password:hashedPassword,
        }
    });

    
    const verificationToken = await generateVerificationToken(email);
    
    //Send verification Email
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
    );



    return { success: "Confirmation Email Sent!"};
}
