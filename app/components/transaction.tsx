import { useState } from "react";

export default function Transaction() {
    const [transactions, setTransactions] = useState([
        { id: 1, description: 'Groceries', amount: -50.00, date: '2024-01-15' },
        { id: 2, description: 'Salary', amount: 3000.00, date: '2024-01-10' },
    ]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Transactions</h1>

                <div className="bg-white rounded-lg shadow">
                    <table className="w-full">
                        <thead className="border-b bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm">{tx.date}</td>
                                    <td className="px-6 py-4 text-sm">{tx.description}</td>
                                    <td className={`px-6 py-4 text-sm text-right font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}