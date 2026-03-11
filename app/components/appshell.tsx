"use client";

import { useState } from "react";
import Navbar from "./navbar";
import SideMenu from "./sidemenu";

type AppShellProps = {
    children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
    const [openSideMenu, setOpenSideMenu] = useState(false);

    return (
        <div className="min-h-screen">
            <Navbar
                openSideMenu={openSideMenu}
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