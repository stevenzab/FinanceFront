"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import InfoCard from "../components/infocard";
import SummaryPieChart from "../components/summarypiechart";
import TransactionHistory, { type TransactionHistoryItem } from "../components/transactionhistory";

const TRANSACTIONS_API_URL = "https://localhost:7287/api/Financio/GetAllTransactions";

type TransactionType = 0 | 1;

type Transaction = {
    id: number;
    amount: number;
    description: string;
    date: string;
    category: string;
    type: TransactionType;
};

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
});

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

function formatAmount(amount: number) {
    return currencyFormatter.format(amount);
}

function formatDate(dateValue: string) {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return dateFormatter.format(date);
}

function getTransactionTypeLabel(type: TransactionType) {
    return type === 0 ? "Revenu" : "Depense";
}

function parseTransactions(payload: unknown): Transaction[] {
    if (!Array.isArray(payload)) {
        return [];
    }

    return payload
        .map((item) => {
            if (!item || typeof item !== "object") {
                return null;
            }

            const record = item as Record<string, unknown>;
            const id = Number(record.id ?? 0);
            const amount = Number(record.amount ?? 0);
            const description = String(record.description ?? "Sans description");
            const date = String(record.date ?? "");
            const category = String(record.category ?? "Non classee");
            const rawType = Number(record.type);
            const type: TransactionType = rawType === 0 ? 0 : 1;

            return {
                id,
                amount,
                description,
                date,
                category,
                type,
            };
        })
        .filter((transaction): transaction is Transaction => transaction !== null);
}

export default function DashboardPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

    const fetchTransactions = useCallback(async (mode: "initial" | "refresh", signal?: AbortSignal) => {
        if (mode === "initial") {
            setIsLoading(true);
        } else {
            setIsRefreshing(true);
        }

        setHasError(false);

        try {
            const response = await fetch(TRANSACTIONS_API_URL, {
                signal,
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const payload = (await response.json()) as unknown;
            setTransactions(parseTransactions(payload));
            setLastUpdatedAt(new Date());
        } catch (error) {
            if (signal?.aborted) {
                return;
            }

            console.error("Error fetching transactions:", error);
            setTransactions([]);
            setHasError(true);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchTransactions("initial", controller.signal);
        return () => controller.abort();
    }, [fetchTransactions]);

    const { incomeTotal, expenseTotal, balanceTotal } = useMemo(() => {
        const income = transactions
            .filter((transaction) => transaction.type === 0)
            .reduce((total, transaction) => total + Math.abs(Number(transaction.amount || 0)), 0);

        const expense = transactions
            .filter((transaction) => transaction.type === 1)
            .reduce((total, transaction) => total + Math.abs(Number(transaction.amount || 0)), 0);

        return {
            incomeTotal: income,
            expenseTotal: expense,
            balanceTotal: income - expense,
        };
    }, [transactions]);

    const recentTransactions = useMemo(() => {
        return [...transactions]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);
    }, [transactions]);

    const displayTransactions = useMemo<TransactionHistoryItem[]>(() => {
        return recentTransactions.map((transaction) => {
            const isIncome = transaction.type === 0;
            const absAmount = Math.abs(Number(transaction.amount || 0));

            return {
                id: transaction.id,
                dateLabel: formatDate(transaction.date),
                description: transaction.description,
                category: transaction.category,
                typeLabel: getTransactionTypeLabel(transaction.type),
                isIncome,
                amountLabel: `${isIncome ? "+" : "-"}${formatAmount(absAmount)}`,
            };
        });
    }, [recentTransactions]);

    const infoCards = [
        {
            title: "Solde total",
            value: formatAmount(balanceTotal),
            valueClassName: balanceTotal >= 0 ? "text-emerald-600" : "text-red-600",
        },
        {
            title: "Revenu total",
            value: formatAmount(incomeTotal),
            valueClassName: "text-emerald-600",
        },
        {
            title: "Dépense totale",
            value: formatAmount(expenseTotal),
            valueClassName: "text-red-600",
        },
    ];

    const pieItems = [
        {
            label: "Revenu total",
            value: incomeTotal,
            color: "#16a34a",
            displayValue: formatAmount(incomeTotal),
        },
        {
            label: "Dépense totale",
            value: expenseTotal,
            color: "#dc2626",
            displayValue: formatAmount(expenseTotal),
        },
        {
            label: "Solde total",
            value: Math.abs(balanceTotal),
            color: "#2563eb",
            displayValue: formatAmount(balanceTotal),
        },
    ];

    const lastUpdatedLabel = lastUpdatedAt
        ? new Intl.DateTimeFormat("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
          }).format(lastUpdatedAt)
        : "-";

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Dashboard</h1>
                        <p className="mt-1 text-sm text-slate-600 sm:text-base">Vue globale de vos finances et dernieres operations.</p>
                        <p className="mt-1 text-xs text-slate-500">Derniere mise a jour: {lastUpdatedLabel}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => fetchTransactions("refresh")}
                        disabled={isRefreshing || isLoading}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isRefreshing ? "Actualisation..." : "Actualiser"}
                    </button>
                </div>

                <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {infoCards.map((card) => (
                        <InfoCard
                            key={card.title}
                            title={card.title}
                            value={card.value}
                            valueClassName={card.valueClassName}
                        />
                    ))}
                </section>

                <section className="mt-8 grid gap-6 xl:grid-cols-12">
                    <div className="xl:col-span-5">
                        <SummaryPieChart title="Repartition des indicateurs" items={pieItems} />
                    </div>
                    <TransactionHistory
                        transactions={displayTransactions}
                        isLoading={isLoading}
                        hasError={hasError}
                    />
                </section>
            </div>
        </main>
    );
}
