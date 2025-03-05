import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const ServerPage = async () => {
    const user = await currentUser();

    if (!user) {
        redirect("/");
    }
    return (
        <UserInfo user={user} label="💻 Server Component" />
    );
};  

export default ServerPage;
