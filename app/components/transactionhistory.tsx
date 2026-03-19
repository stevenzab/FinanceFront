type TransactionHistoryItem = {
    id: number;
    dateLabel: string;
    description: string;
    category: string;
    typeLabel: string;
    isIncome: boolean;
    amountLabel: string;
};

type TransactionHistoryProps = {
    transactions: TransactionHistoryItem[];
    isLoading: boolean;
    hasError: boolean;
};

export type { TransactionHistoryItem };

export default function TransactionHistory({ transactions, isLoading, hasError }: TransactionHistoryProps) {
    return (
        <article className="xl:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Historique des transactions</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {transactions.length} affichees
                </span>
            </div>

            {isLoading && (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="h-14 animate-pulse rounded-xl bg-slate-100" />
                    ))}
                </div>
            )}

            {!isLoading && hasError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    Impossible de charger les transactions pour le moment.
                </div>
            )}

            {!isLoading && !hasError && transactions.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                    Aucune transaction disponible.
                </div>
            )}

            {!isLoading && !hasError && transactions.length > 0 && (
                <div className="space-y-3">
                    <div className="space-y-2 sm:hidden">
                        {transactions.map((transaction) => (
                            <article
                                key={transaction.id}
                                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{transaction.description}</p>
                                        <p className="mt-1 text-xs text-slate-500">{transaction.dateLabel}</p>
                                    </div>
                                    <p className={`text-sm font-semibold ${transaction.isIncome ? "text-emerald-600" : "text-rose-600"}`}>
                                        {transaction.amountLabel}
                                    </p>
                                </div>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                        {transaction.category}
                                    </span>
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            transaction.isIncome ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                                        }`}
                                    >
                                        {transaction.typeLabel}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="hidden overflow-hidden rounded-xl border border-slate-200 sm:block">
                        <div className="grid grid-cols-[120px_1fr_140px_120px_110px] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <span>Date</span>
                            <span>Description</span>
                            <span>Categorie</span>
                            <span>Type</span>
                            <span className="text-right">Montant</span>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="grid items-center gap-2 px-4 py-3 sm:grid-cols-[120px_1fr_140px_120px_110px]"
                                >
                                    <p className="text-sm text-slate-600">{transaction.dateLabel}</p>
                                    <p className="text-sm font-medium text-slate-800">{transaction.description}</p>
                                    <p className="inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                        {transaction.category}
                                    </p>
                                    <p
                                        className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            transaction.isIncome ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                                        }`}
                                    >
                                        {transaction.typeLabel}
                                    </p>
                                    <p className={`text-sm font-semibold text-right ${transaction.isIncome ? "text-emerald-600" : "text-rose-600"}`}>
                                        {transaction.amountLabel}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}
