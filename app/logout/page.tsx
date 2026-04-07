"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function signOutUser() {
      await authClient.signOut();
      router.replace("/login");
      router.refresh();
    }

    signOutUser();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl">
        <h1 className="text-2xl font-semibold text-slate-900">Deconnexion</h1>
        <p className="mt-2 text-sm text-slate-600">Deconnexion en cours...</p>
        <Link href="/login" className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline">
          Aller a la connexion
        </Link>
      </div>
    </main>
  );
}
