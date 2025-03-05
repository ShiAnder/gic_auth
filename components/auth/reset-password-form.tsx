"use client";

import { useState, useTransition } from "react";
import * as z from "zod";
import { ResetSchema } from "@/schemas";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";

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
import {reset} from "@/actions/reset";

export const ResetPasswordForm = () => {

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined >("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer <typeof ResetSchema>>({
    resolver:zodResolver(ResetSchema),
    defaultValues:{
      email:"",
    }
  })
  
  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
      setError("");
      setSuccess("");


      startTransition(() => {
        reset(values)
        .then((data)=> {
          setError(data?.error);
          setSuccess(data?.success);
        })
      });
  }


  return (
    <CardWrapper
      headerLabel="Forgot Your Password?"
      backButtonLabel="Back to Login?"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          >   
          <div className="space-y-4">
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
          </div>
                <FormError message={error}/>
                <FormSuccess message={success}/>
                <Button 
                  disabled={isPending}
                  type="submit"
                  className="w-full">
                    Send Reset Email
                </Button>

        </form>
      </Form>
    </CardWrapper>
  );
};