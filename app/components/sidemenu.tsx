import Link from "next/link";
import { usePathname } from "next/navigation";

type SideMenuProps = {
    onClose: () => void;
};

const menuItems = [
    { label: "Dashboard", href: "/dashboard", id: 0 },
    { label: "Income", href: "/income", id: 1 },
    { label: "Expense", href: "/expense", id: 2 },
];

export default function SideMenu({ onClose }: SideMenuProps) {
    const pathname = usePathname();

    return (
        <div className="w-full">
            <ul className="py-2">
                {menuItems.map((item) => (
                    <li key={item.id}>
                        <Link
                            href={item.href}
                            className={`block w-full px-4 py-2 text-left text-sm ${pathname === item.href ? "bg-blue-200 text-black rounded" : "text-black hover:bg-gray-100"}`}
                            onClick={onClose}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
                <li>
                    <button
                        type="button"
                        className="w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
}