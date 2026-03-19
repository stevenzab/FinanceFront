type PieItem = {
    label: string;
    value: number;
    color: string;
    displayValue?: string;
};

type SummaryPieChartProps = {
    title: string;
    items: PieItem[];
};

export default function SummaryPieChart({ title, items }: SummaryPieChartProps) {
    const normalizedValues = items.map((item) => Math.abs(item.value));
    const total = normalizedValues.reduce((sum, value) => sum + value, 0);
    const hasData = total > 0;
    const formattedTotal = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(total);

    let runningDegrees = 0;
    const gradientStops = hasData
        ? normalizedValues
              .map((value, index) => {
                  const start = runningDegrees;
                  runningDegrees += (value / total) * 360;
                  const end = runningDegrees;
                  return `${items[index].color} ${start}deg ${end}deg`;
              })
              .join(", ")
        : "#e5e7eb 0deg 360deg";

    const chartStyle = {
        background: `conic-gradient(${gradientStops})`,
    };

    return (
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Vue rapide</span>
            </div>

            <div className="mt-6 flex flex-col items-center gap-8 lg:flex-row lg:items-start">
                <div className="relative h-56 w-56 rounded-full shadow-inner" style={chartStyle}>
                    <div className="absolute inset-9 flex flex-col items-center justify-center rounded-full border border-slate-200 bg-white text-center">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total suivi</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{formattedTotal}</p>
                        {!hasData && <p className="mt-1 text-[11px] text-slate-500">Ajoutez des transactions</p>}
                    </div>
                </div>

                <div className="w-full max-w-sm space-y-3">
                    {items.map((item, index) => {
                        const value = normalizedValues[index];
                        const percentage = total ? (value / total) * 100 : 0;

                        return (
                            <div
                                key={item.label}
                                className="rounded-xl border border-slate-100 px-3 py-2.5"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="inline-block h-3 w-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                    </div>

                                    <p className="text-xs font-semibold text-slate-500">{percentage.toFixed(1)}%</p>
                                </div>

                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            backgroundColor: item.color,
                                            width: `${Math.max(Number(percentage.toFixed(1)), hasData ? 4 : 0)}%`,
                                        }}
                                    />
                                </div>

                                <div className="mt-2 text-right">
                                    <p className="text-sm font-semibold text-slate-900">{item.displayValue ?? value.toFixed(2)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}