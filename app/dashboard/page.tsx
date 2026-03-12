"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [data, setData] = useState([]);

    const fetchTransactions = async () => {
        try {
            const response = await fetch("https://localhost:7287/api/Financio");
            const fetchedData = await response.json();
            console.log("Transactions:", fetchedData);
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

    return (
        <main className="min-h-screen bg-zinc-50 p-8">
            <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome to your dashboard.</p>
            {data.map((transaction: any) => (
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