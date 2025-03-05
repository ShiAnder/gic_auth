import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";


interface UserInfoProps {
    user?: ExtendedUser;
    label: string;
}

export const UserInfo = ({ 
    user,
    label,

}: UserInfoProps) => {
    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader className="flex flex-row items-center gap-3">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">ID</p>
                    <p className="text-xs truncate max-w-[180px] font-mono p-1 bg-slate-100 rounded-md ">{user?.id}</p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-xs truncate max-w-[180px] font-mono p-1 bg-slate-100 rounded-md ">{user?.email}</p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-xs truncate max-w-[180px] font-mono p-1 bg-slate-100 rounded-md ">{user?.name}</p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">User Role</p>
                    <p className="text-xs truncate max-w-[180px] font-mono p-1 bg-slate-100 rounded-md ">{user?.role}</p>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">Two Factor Authentication</p>
                    <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
                        {user?.isTwoFactorEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                </div>
            </CardContent>

        </Card>
    );
};
