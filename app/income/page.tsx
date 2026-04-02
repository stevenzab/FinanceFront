"use client";

import { useMemo, useState } from "react";

const ADD_INCOME_API_URL = `https://localhost:7287/api/Financio/AddTransactions`;

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
});

const today = new Date().toISOString().split("T")[0];

type IncomeFormState = {
    amount: string;
    description: string;
    category: string;
    date: string;
};

const initialFormState: IncomeFormState = {
    amount: "",
    description: "",
    category: "",
    date: today,
};

const chartData = [1800, 2400, 2100, 3200, 2800, 3600, 4100];
const chartLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

async function readErrorMessage(response: Response) {
    try {
        const payload = (await response.json()) as Record<string, unknown>;
        const title = typeof payload.title === "string" ? payload.title : null;
        const detail = typeof payload.detail === "string" ? payload.detail : null;

        const errors = payload.errors;
        if (title && detail) {
            return `${title} - ${detail}`;
        }

        if (errors && typeof errors === "object") {
            const errorValues = Object.values(errors as Record<string, unknown>)
                .flatMap((entry) => (Array.isArray(entry) ? entry : []))
                .filter((entry): entry is string => typeof entry === "string");

            if (errorValues.length > 0) {
                return [title, ...errorValues].filter(Boolean).join(" - ");
            }
        }

        if (title) {
            return title;
        }

        if (detail) {
            return detail;
        }

        if (errors && typeof errors === "object") {
            const firstEntry = Object.values(errors as Record<string, unknown[]>)[0];
            if (Array.isArray(firstEntry) && typeof firstEntry[0] === "string") {
                return firstEntry[0];
            }
        }
    } catch {
        try {
            const text = await response.text();
            if (text) {
                return text;
            }
        } catch {
            return null;
        }
    }

    return null;
}

export default function IncomePage() {
    const [form, setForm] = useState<IncomeFormState>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const chartPoints = useMemo(() => {
        const maxValue = Math.max(...chartData);

        return chartData
            .map((value, index) => {
                const x = (index / (chartData.length - 1)) * 100;
                const y = 100 - (value / maxValue) * 72 - 8;
                return `${x},${y}`;
            })
            .join(" ");
    }, []);

    const totalIncome = useMemo(() => {
        return currencyFormatter.format(chartData.reduce((sum, value) => sum + value, 0));
    }, []);

    const averageIncome = useMemo(() => {
        return currencyFormatter.format(chartData.reduce((sum, value) => sum + value, 0) / chartData.length);
    }, []);

    function updateField<K extends keyof IncomeFormState>(field: K, value: IncomeFormState[K]) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function closeModal() {
        if (isSubmitting) {
            return;
        }

        setIsModalOpen(false);
        setSubmitError(null);
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setSubmitError(null);
        setSubmitSuccess(null);

        const parsedAmount = Number(form.amount);

        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            setSubmitError("Le montant doit etre superieur a 0.");
            return;
        }

        if (!form.description.trim() || !form.category.trim() || !form.date) {
            setSubmitError("Merci de remplir tous les champs.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                amount: parsedAmount,
                description: form.description.trim(),
                category: form.category.trim(),
                date: form.date,
                type: 0,
            };

            const response = await fetch(ADD_INCOME_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorMessage = await readErrorMessage(response);
                throw new Error(errorMessage ?? `API request failed with status ${response.status}`);
            }

            setSubmitSuccess("Le revenu a bien ete ajoute.");
            setForm({
                ...initialFormState,
                date: today,
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding income:", error);
            const message = error instanceof Error ? error.message : "Impossible d'ajouter le revenu pour le moment.";
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,#f4fff7_0%,#f8fafc_46%,#ffffff_100%)] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <section className="overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-[0_28px_80px_rgba(22,163,74,0.12)]">
                    <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[1.1fr_0.9fr]">
                        <div className="flex flex-col justify-between">
                            <div>
                                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                                    Income overview
                                </span>
                                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                                    Suivez vos revenus et ajoutez-en en un clic.
                                </h1>
                                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                                    La page met en avant la tendance des revenus avec un graphe, puis ouvre une modale de saisie
                                    quand l&apos;utilisateur clique sur le bouton d&apos;ajout.
                                </p>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <div className="min-w-44 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total semaine</p>
                                    <p className="mt-2 text-2xl font-semibold text-slate-900">{totalIncome}</p>
                                </div>
                                <div className="min-w-44 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Moyenne</p>
                                    <p className="mt-2 text-2xl font-semibold text-slate-900">{averageIncome}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] bg-slate-950 p-5 text-white shadow-2xl sm:p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-emerald-300">Graph</p>
                                    <h2 className="mt-1 text-2xl font-semibold">Evolution des revenus</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSubmitError(null);
                                        setSubmitSuccess(null);
                                        setIsModalOpen(true);
                                    }}
                                    className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                                >
                                    + Ajout revenu
                                </button>
                            </div>

                            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
                                <div className="h-64 w-full">
                                    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
                                        {[20, 40, 60, 80].map((line) => (
                                            <line
                                                key={line}
                                                x1="0"
                                                y1={line}
                                                x2="100"
                                                y2={line}
                                                stroke="rgba(255,255,255,0.12)"
                                                strokeWidth="0.5"
                                                vectorEffect="non-scaling-stroke"
                                            />
                                        ))}
                                        <polyline
                                            fill="none"
                                            stroke="#4ade80"
                                            strokeWidth="2"
                                            points={chartPoints}
                                            vectorEffect="non-scaling-stroke"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        {chartData.map((value, index) => {
                                            const x = (index / (chartData.length - 1)) * 100;
                                            const y = 100 - (value / Math.max(...chartData)) * 72 - 8;

                                            return (
                                                <circle
                                                    key={`${chartLabels[index]}-${value}`}
                                                    cx={x}
                                                    cy={y}
                                                    r="1.9"
                                                    fill="#bbf7d0"
                                                    stroke="#166534"
                                                    strokeWidth="0.7"
                                                    vectorEffect="non-scaling-stroke"
                                                />
                                            );
                                        })}
                                    </svg>
                                </div>

                                <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs text-slate-400">
                                    {chartLabels.map((label) => (
                                        <span key={label}>{label}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {submitSuccess && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                        {submitSuccess}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-[0_30px_120px_rgba(15,23,42,0.3)] sm:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-emerald-600">Nouveau revenu</p>
                                <h2 className="mt-1 text-2xl font-semibold text-slate-900">Ajouter un revenu</h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600 transition hover:bg-slate-200"
                            >
                                ×
                            </button>
                        </div>

                        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-700">Montant</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.amount}
                                        onChange={(event) => updateField("amount", event.target.value)}
                                        placeholder="2500"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-700">Date</span>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={(event) => updateField("date", event.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
                                    />
                                </label>
                            </div>

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
                                <input
                                    type="text"
                                    value={form.description}
                                    onChange={(event) => updateField("description", event.target.value)}
                                    placeholder="Salaire, prime, mission..."
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-slate-700">Categorie</span>
                                <input
                                    type="text"
                                    value={form.category}
                                    onChange={(event) => updateField("category", event.target.value)}
                                    placeholder="Salaire"
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
                                />
                            </label>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                                Route API: <span className="font-medium text-slate-900">{ADD_INCOME_API_URL}</span>
                            </div>

                            {submitError && (
                                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                                    {submitError}
                                </div>
                            )}

                            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? "Ajout en cours..." : "+ Ajout revenu"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
