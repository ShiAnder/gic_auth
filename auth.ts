import NextAuth from "next-auth"
import authConfig from "./auth.config";
import { PrismaAdapter} from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";


export const { auth, handlers: { GET,POST }, signIn, signOut } = NextAuth({

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
      async linkAccount({user}){
        await db.user.update({
          where: {id: user.id},
          data: {
              emailVerified: new Date(),
          }
        });
      }

  },
  callbacks: {
    async signIn({user, account}){
      console.log("signIn", user, account);
      
      
      
      if (!user.id) return true;
        //allow OAuth without email verification
        if(account?.provider !== "credentials") return true;



        const existingUser = await getUserById(user.id);

        //prevent sign in without email verification
        if(!existingUser?.emailVerified) return false;

        //TODO: ADD 2FA check
        if(existingUser.isTwoFactorEnabled){
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

          console.log({
            twoFactorConfirmation
          })

          //prevent sign in without 2FA confirmation
          if(!twoFactorConfirmation) return false;

          //delete two factor confirmation for next sign in
          await db.twoFactorConfirmation.delete({
            where: {
              id: twoFactorConfirmation.id,
            },
          });
        }

      return true;
    },

    async session({token, session}){
      if(token.sub && session.user){ 
        session.user.id = token.sub;
      }

      if(token.role && session.user){
        session.user.role = token.role as UserRole ;
      }

      if(token.isTwoFactorEnabled && session.user){
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if(session.user && token.name && token.email){
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuthAccount = token.isOAuthAccount as boolean;
      }
            
      return session;
    },
    
    async jwt({ token}){
      
      if(!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if(!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuthAccount = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token; 
    }
  },
  adapter: PrismaAdapter(db),
  session: {strategy:"jwt"},
  ...authConfig,
});