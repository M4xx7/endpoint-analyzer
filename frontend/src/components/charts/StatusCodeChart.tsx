import { Bar } from "react-chartjs-2";
import type { Props } from "./chartOptions";
import { chartOptions } from "./chartOptions";
import { getStatusColor } from "./chartColors";


export function StatusCodeChart({ data }: Props) {
    const families = Array.from(
        new Set(data.map((req) => getStatusFamily(req.statusCode)))
    ).sort();

    const requestCounts: Record<string, Record<string, number>> = {};

    data.forEach((req) => {
        const date = new Date(req.timestamp);
        date.setSeconds(0, 0);
        const timeKey = date.toISOString();
        const family = getStatusFamily(req.statusCode);

        if (!requestCounts[timeKey]) {
            requestCounts[timeKey] = {};
        }

        requestCounts[timeKey][family] =
            (requestCounts[timeKey][family] || 0) + 1;
    });

    const labels = Object.keys(requestCounts).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const datasets = families.map((family) => {
        const representativeCode = getFamilyRepresentativeCode(family);
        const colors = getStatusColor(representativeCode);

        return {
            label: family,
            data: labels.map(
                (time) => requestCounts[time][family] || 0
            ),
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 4,
        };
    });

    const chartData = {
        labels,
        datasets,
    };

    const barOptions = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,

            tooltip: {
                ...chartOptions.plugins?.tooltip,
                callbacks: {
                    ...(chartOptions.plugins?.tooltip?.callbacks as any),
                    label: (context: any) =>
                        `Status ${context.dataset.label}: ${context.parsed.y} requests`,
                },
            },

            legend: {
                display: true,
                position: "bottom" as const,
                labels: {
                    color: "#9ca3af"
                }
            },
        },

        scales: {
            ...chartOptions.scales,

            x: {
                ...chartOptions.scales?.x,
                stacked: true,
            },

            y: {
                ...chartOptions.scales?.y,
                stacked: true,

                ticks: {
                    ...(chartOptions.scales?.y?.ticks as any),
                    callback: (value: any) => value,
                    precision: 0,
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <Bar data={chartData} options={barOptions as any} />
        </div>
    );
}

const getStatusFamily = (status: number): string => {
    if (status >= 200 && status < 300) return "2xx";
    if (status >= 300 && status < 400) return "3xx";
    if (status >= 400 && status < 500) return "4xx";
    if (status >= 500) return "5xx";
    return "Other";
};


const getFamilyRepresentativeCode = (family: string): number => {
    switch (family) {
        case "2xx": return 200;
        case "3xx": return 300;
        case "4xx": return 400;
        case "5xx": return 500;
        default: return 0;
    }
};