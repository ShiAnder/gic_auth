"use client";
import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image"; // Import the next/image component

export const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 bg-secondary flex justify-between items-center p-4 rounded-xl shadow-sm">
            {/* Logo */}
            <Link href="/">
                <Image
                    src="/gic-logo.png" // Path to the logo in the public folder
                    alt="Logo"
                    width={200} // Adjust width as needed
                    height={80} // Adjust height as needed
                    className="rounded-full" // Optional: Add styling to the logo
                />
            </Link>

            {/* Navigation Links and User Button */}
            <div className="flex items-center gap-x-4">
                {/* Navigation Buttons */}
                <div className="flex gap-x-2">
                    <Button
                        asChild
                        variant={pathname === "/admin" ? "default" : "outline"}
                    >
                        <Link href="/admin">
                            Admin
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant={pathname === "/client" ? "default" : "outline"}
                    >
                        <Link href="/client">
                            Client
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant={pathname === "/server" ? "default" : "outline"}
                    >
                        <Link href="/server">
                            Server
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant={pathname === "/settings" ? "default" : "outline"}
                    >
                        <Link href="/settings">
                            Settings
                        </Link>
                    </Button>
                </div>

                {/* User Button */}
                <UserButton />
            </div>
        </nav>
    );
};