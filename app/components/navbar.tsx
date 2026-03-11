"use client";
import { useState } from "react";
import { IoMdMenu } from "react-icons/io";

export default function Navbar() {
    const [openSideMenu, setOpenSideMenu] = useState(false);

    return (
        <div className="flex gap-5 bg-white border border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
            <IoMdMenu
                className="text-2xl text-gray-700 cursor-pointer lg:hidden"
            />
            <h2 className="text-lg font-medium text-black">Financio</h2>
        </div>
    );
}