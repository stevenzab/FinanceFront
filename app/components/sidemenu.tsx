import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaWallet } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { LuLogOut } from "react-icons/lu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type SideMenuProps = {
    onClose: () => void;
};

const menuItems = [
    { label: "Dashboard", href: "/dashboard", id: 0, img: <MdDashboard /> },
    { label: "Income", href: "/income", id: 1, img: <FaWallet /> },
    { label: "Expense", href: "/expense", id: 2, img: <GiExpense /> },
];

export default function SideMenu({ onClose }: SideMenuProps) {

		const { data: session, isPending } = authClient.useSession();

		const router = useRouter();

		async function handleLogout() {
				await authClient.signOut();
				router.replace("/login");
				router.refresh();
		}

    const pathname = usePathname();

    return (
        <div className="flex h-full w-full flex-col">
            <ul className="flex-1 py-2">
                {menuItems.map((item) => (
                    <Link href={item.href} key={item.id} onClick={onClose}>
                    <li key={item.id} className={`flex items-center block w-full px-4 py-2 text-left text-md ${pathname === item.href ? "bg-blue-200 text-black rounded" : "text-black hover:bg-gray-100"}`}>
                        <span className="mr-2">{item.img}</span>
                        {item.label}
                    </li>
                    </Link>
                ))}
            </ul>
            <div className="mt-auto border-t border-gray-200/70 pt-3 fixed bottom-0 px-4">
                {!isPending && session?.user?.email ? (
                    <p className="mb-2 px-3 text-sm text-slate-600 break-all">{session.user.email}</p>
                ) : null}
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}