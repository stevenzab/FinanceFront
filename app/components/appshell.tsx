"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./navbar";
import SideMenu from "./sidemenu";
import { authClient } from "@/lib/auth-client";

type AppShellProps = {
    children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const isAuthPage = useMemo(() => pathname === "/login" || pathname === "/register", [pathname]);

    useEffect(() => {
        if (isPending) {
            return;
        }

        if (!session && !isAuthPage) {
            router.replace("/login");
            return;
        }

        if (session && isAuthPage) {
            router.replace("/dashboard");
        }
    }, [isAuthPage, isPending, router, session]);

    if (isPending && !isAuthPage) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 text-slate-700">
                Verification de session...
            </div>
        );
    }

    if (!session && !isAuthPage) {
        return null;
    }

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen">
            <Navbar
                onToggleMenu={() => setOpenSideMenu((prev) => !prev)}
            />
            <div className="flex">
                <aside
                    className={`${openSideMenu ? "block" : "hidden"}
                        w-64 min-h-[calc(100vh-61px)] border-r border-gray-200/50 bg-white p-5 lg:block`}
                >
                    <SideMenu onClose={() => setOpenSideMenu(false)} />
                </aside>

                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}