import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaWallet } from "react-icons/fa";

type SideMenuProps = {
    onClose: () => void;
};

const menuItems = [
    { label: "Dashboard", href: "/dashboard", id: 0, img: <FaWallet /> },
    { label: "Income", href: "/income", id: 1, img: <FaWallet /> },
    { label: "Expense", href: "/expense", id: 2, img: <FaWallet /> },
    { label: "Logout", href: "/logout", id: 3, img: <FaWallet /> }
];

export default function SideMenu({ onClose }: SideMenuProps) {
    const pathname = usePathname();

    return (
        <div className="w-full">
            <ul className="py-2">
                {menuItems.map((item) => (
                    <Link href={item.href} key={item.id} onClick={onClose}>
                    <li key={item.id} className={`flex items-center block w-full px-4 py-2 text-left text-sm ${pathname === item.href ? "bg-blue-200 text-black rounded" : "text-black hover:bg-gray-100"}`}>
                        <span className="mr-2">{item.img}</span>
                        {item.label}
                    </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}