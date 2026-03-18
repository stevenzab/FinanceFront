type InfoCardProps = {
    title: string;
    value: string;
    valueClassName?: string;
};

export default function InfoCard({ title, value, valueClassName = "text-gray-900" }: InfoCardProps) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`mt-2 text-2xl font-semibold ${valueClassName}`}>{value}</p>
        </div>
    );
}