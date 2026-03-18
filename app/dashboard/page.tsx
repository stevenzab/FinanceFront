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

export default function DashboardPage() {
    const [data, setData] = useState<Transaction[]>([]);

    const fetchTransactions = async () => {
        try {
            const response = await fetch("https://localhost:7287/api/Financio/GetAllTransactions");
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            const fetchedData = await response.json();
            setData(fetchedData);
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
			<>
        <main className="bg-zinc-50 p-8">
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
        </main>
					<div className="mt-8 flex flex-row gap-8">
							<SummaryPieChart title="Répartition des indicateurs" items={pieItems} />

							<div className="mt-6 flex-row gap-4">
									{data.map((transaction: Transaction) => (
											<div key={transaction.id} className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
													<p className="text-gray-800">Amount: {transaction.amount}</p>
													<p className="text-gray-800">Description: {transaction.description}</p>
													<p className="text-gray-800">Date: {transaction.date}</p>
													<p className="text-gray-800">Category: {transaction.category}</p>
													<p className="text-gray-800">Type: {getTransactionTypeLabel(transaction.type)}</p>
											</div>
									))}
							</div>
					</div>
			
			</>
    );
}