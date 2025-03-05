"use client";

import * as z from "zod";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition , useState} from "react";
import { SettingsSchema } from "@/schemas";


import  {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { settings } from "@/actions/settings";
import { useSession } from "next-auth/react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";

const SettingsPage = () => {

    const user = useCurrentUser(); 


    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver : zodResolver(SettingsSchema),
        defaultValues : {
            name : user?.name || undefined, 
        },
    });

    const [error, setError] = useState< string | undefined >();
    const [success, setSuccess] = useState< string | undefined >();
    const updateSession = useSession();
    const [isPending, startTransition] = useTransition();

    const onSubmit = (values : z.infer<typeof SettingsSchema>) => {
        startTransition( () => {
            settings(values).then((data) => {
                    if(data.error){
                        setError(data.error);
                    }

                    if(data.success){
                        updateSession.update();
                        setSuccess(data.success);
                    }
        }).catch(()=>setError("Something Went Wrong !"));
    });

    }

    return (
        <Card className="w-[600px] max-w-lg">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    ⚙️Settings
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-6" onClick={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter updated name!"
                                             
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button type="submit">
                            Save
                        </Button>
                    </form>
                
                </Form>
            </CardContent>

        </Card>
    )
}

export default SettingsPage;
