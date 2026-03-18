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

    let runningDegrees = 0;
    const gradientStops = total
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
        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm w-full">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

            <div className="mt-6 flex flex-col items-center justify-between gap-8 lg:flex-row">
                <div className="relative h-52 w-52 rounded-full" style={chartStyle}>
                    <div className="absolute inset-8 rounded-full bg-white" />
                </div>

                <div className="w-full max-w-sm space-y-3">
                    {items.map((item, index) => {
                        const value = normalizedValues[index];
                        const percentage = total ? (value / total) * 100 : 0;

                        return (
                            <div
                                key={item.label}
                                className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="inline-block h-3 w-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {item.displayValue ?? value.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}