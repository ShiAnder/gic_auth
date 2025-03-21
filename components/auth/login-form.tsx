"use client";

import { useState, useTransition } from "react";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import { useSearchParams } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  
} from "@/components/ui/form"

import { CardWrapper } from "./card-wrapper";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import Link from "next/link";

export const LoginForm = () => {

  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider": "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined >("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer <typeof LoginSchema>>({
    resolver:zodResolver(LoginSchema),
    defaultValues:{
      email:"",
      password:"",
      code: "" 
    }
  })
  
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
  
    startTransition(() => {
      login(values)
      .then((data)=> {
        if(data?.error){
          setError(data.error);
        }
  
        if(data?.success){
          setSuccess(data.success);
        }
  
        if(data?.twoFactor){
          setShowTwoFactor(true);
        }
      })
    });
  };


  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6">   
          <div className="space-y-4">

            {showTwoFactor && (
                 <FormField
                      control={form.control}
                      name="code"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Two Factor Code</FormLabel>
                          <FormControl>
                            
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="123456"
                            />
                          </FormControl>

                          <FormMessage/>
                        </FormItem>
                      )}

                    />
              )}

            { !showTwoFactor && (
              <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="example.email@example.com"
                              type="email"
                            />
                          </FormControl>

                          <FormMessage/>
                        </FormItem>
                      )}

                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="********"
                              type="password"
                            />
                          </FormControl>
                            <Button
                              size="sm"
                              variant="link"
                              asChild
                              className="px-0 font-normal"
                            >
                              <Link href="/auth/reset">
                                Forgot Password?
                              </Link>
                            </Button>
                          <FormMessage/>
                        </FormItem>
                      )}

                    />
              </> 
            )}
          </div>
                <FormError message={error || urlError}/>
                <FormSuccess message={success}/>
                <Button 
                  disabled={isPending}
                  type="submit"
                  className="w-full">
                    {showTwoFactor ? "Confirm" : "Login"}
                </Button>

        </form>
      </Form>
    </CardWrapper>
  );
};