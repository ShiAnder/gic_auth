"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {

    const onServerActionClick = async () => {
        admin()
        .then((data) => {
            if(data.success) {
                toast.success("Allowed Server Action!");
            } else {
                toast.error("Forbidden Server Action!");
            }
        });
    }

    const onApiRouteClick = () => {

        fetch("/api/admin")
        .then((response) => {
            if(response.ok) {
                toast.success("Allowed API Route!");
            } else {
                toast.error("Forbidden API Route!");
            }
        });
    };
    
    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">🔑 Admin</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRoles={UserRole.ADMIN}>
                    <FormSuccess message="You are authorized to access this page." />
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Admin-Only API Routes
                    </p>
                    <Button onClick={onApiRouteClick}>
                        Click To Test
                    </Button>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Admin-Only Server Actions
                    </p>
                    <Button onClick={onServerActionClick}>
                        Click To Test
                    </Button>
                </div>


            </CardContent>
        </Card>

    );
}

export default AdminPage;
