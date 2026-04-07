"use client";
import Link from "next/link";
import { IoMdMenu } from "react-icons/io";

type NavbarProps = {
    onToggleMenu: () => void;
};

export default function Navbar({ onToggleMenu }: NavbarProps) {
    return (
        <div className="relative flex items-center justify-between gap-5 bg-white border border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
            <div className="flex items-center gap-5">
                <IoMdMenu
                    className="text-2xl text-gray-700 cursor-pointer lg:hidden"
                    onClick={onToggleMenu}
                />
                <Link
                    href="/dashboard"
                    className="text-lg font-medium text-black"
                >
                    Financio
                </Link>
            </div>
        </div>

    );
}