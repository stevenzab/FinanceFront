"use client";

import { useEffect, useState } from "react";
import InfoCard from "../components/infocard";
import SummaryPieChart from "../components/summarypiechart";

type Transaction = {
    id: number;
    amount: number;
    description: string;
    date: string;
    category: string;
    type: number;
};

type ApiTransaction = {
    id?: number;
    Id?: number;
    amount?: number | string;
    Amount?: number | string;
    description?: string;
    Description?: string;
    date?: string;
    Date?: string;
    category?: string;
    Category?: string;
    type?: number | string;
    Type?: number | string;
};

const parseTransactionType = (rawType: number | string | undefined, amount: number) => {
    if (typeof rawType === "number") {
        return rawType;
    }

    if (typeof rawType === "string") {
        const normalizedType = rawType.trim().toLowerCase();
        if (normalizedType === "income") {
            return 0;
        }
        if (normalizedType === "expense") {
            return 1;
        }

        const numericType = Number(rawType);
        if (!Number.isNaN(numericType)) {
            return numericType;
        }
    }

    return amount < 0 ? 1 : 0;
};

const normalizeTransactions = (payload: unknown): Transaction[] => {
    const items = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as { data?: unknown[] })?.data)
            ? (payload as { data: unknown[] }).data
            : Array.isArray((payload as { items?: unknown[] })?.items)
                ? (payload as { items: unknown[] }).items
                : [];

    return items.map((rawItem, index) => {
        const item = rawItem as ApiTransaction;
        const amount = Number(item.amount ?? item.Amount ?? 0);

        return {
            id: Number(item.id ?? item.Id ?? index),
            amount,
            description: String(item.description ?? item.Description ?? ""),
            date: String(item.date ?? item.Date ?? ""),
            category: String(item.category ?? item.Category ?? ""),
            type: parseTransactionType(item.type ?? item.Type, amount),
        };
    });
};

export default function DashboardPage() {
    const [data, setData] = useState<Transaction[]>([]);

    const fetchTransactions = async () => {
        try {
            const response = await fetch("https://localhost:7287/api/Financio/GetAllTransactions");
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const fetchedData = await response.json();
            const normalizedData = normalizeTransactions(fetchedData);
            console.log("Transactions:", normalizedData);
            setData(normalizedData);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setData([]);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const getTransactionTypeLabel = (type: number) => {
        switch (type) {
            case 0:
                return "Income";
            case 1:
                return "Expense";
            default:
                return "Unknown";
        }
    };

    const incomeTotal = data
        .filter((transaction) => transaction.type === 0)
        .reduce((total, transaction) => total + Math.abs(Number(transaction.amount || 0)), 0);

    const expenseTotal = data
        .filter((transaction) => transaction.type === 1)
        .reduce((total, transaction) => total + Math.abs(Number(transaction.amount || 0)), 0);

    const balanceTotal = incomeTotal - expenseTotal;

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(amount);
    };

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
            label: "Solde total",
            value: balanceTotal,
            color: "#2563eb",
            displayValue: formatAmount(balanceTotal),
        },
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
    ];

    return (
        <main className="min-h-screen bg-zinc-50 p-8">
            <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome to your dashboard.</p>

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

            <SummaryPieChart title="Répartition des indicateurs" items={pieItems} />

            {data.map((transaction: Transaction) => (
                <div key={transaction.id} className="mt-4 p-4 bg-white rounded shadow">
                    <p className="text-gray-800">Amount: {transaction.amount}</p>
                    <p className="text-gray-800">Description: {transaction.description}</p>
                    <p className="text-gray-800">Date: {transaction.date}</p>
                    <p className="text-gray-800">Category: {transaction.category}</p>
                    <p className="text-gray-800">Type: {getTransactionTypeLabel(transaction.type)}</p>
                </div>
            ))}
        </main>
    );
}