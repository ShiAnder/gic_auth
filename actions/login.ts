"use server";

import { signIn } from "@/auth";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";


export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success){
        return { error: "Invalid Fields !"};
    }

    const { email, password, code } = validatedFields.data;

    const existingUser = await getUserByEmail(email)

    if(!existingUser || !existingUser.email || !existingUser.password){
        return {error: "Email does not exist!"}
    }

    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );
        
        return {success: "Confirmation Email Sent!"};
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email){
        if(code){
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            
            if(!twoFactorToken){
                return {error: "Invalid Two Factor Code!"}
            }

            if(twoFactorToken.token !== code){
                return {error: "Invalid Two Factor Code!"}
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if(hasExpired){
                return {error: "Two Factor Code Expired!"}
            }   

            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id
                }
            });

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            if(existingConfirmation){
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmation.id
                    }
                });
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                }
            });
            
            
        }
        else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorEmail(
                twoFactorToken.email,
                twoFactorToken.token
            );

            return {twoFactor:true};

        }
    }

    try{
        await signIn("credentials", { 
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })

    }catch(error){
        if(error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin" : 
                    return {error: "Invalid Credentials!"}
                default: 
                    return {error: "Something Went Wrong!"}
            }
        } 

        throw error;

    }


}
