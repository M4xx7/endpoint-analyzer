import { Bar } from "react-chartjs-2";
import type { Props } from "./chartOptions";
import { options } from "./chartOptions";

export function StatusCodeChart({ data }: Props) {
    // Get all status codes that occur in the data
    const statusCodes = Array.from(
        new Set(data.map((req) => req.statusCode))
    ).sort((a, b) => a - b);

    const requestCounts: Record<string, Record<number, number>> = {};

    data.forEach((req) => {
        const timeKey = new Date(req.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        if (!requestCounts[timeKey]) {
            requestCounts[timeKey] = {};
        }

        requestCounts[timeKey][req.statusCode] =
            (requestCounts[timeKey][req.statusCode] || 0) + 1;
    });

    const labels = Object.keys(requestCounts);

    const datasets = statusCodes.map((status) => {

        const colors = getStatusColor(status);

        return {
            label: status.toString(),
            data: labels.map(
                (time) => requestCounts[time][status] || 0
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
        ...options,
        plugins: {
            ...options.plugins,

            tooltip: {
                ...options.plugins?.tooltip,

                callbacks: {
                    label: (context: any) =>
                        `Status ${context.dataset.label}: ${context.parsed.y} requests`,
                },
            },

            legend: {
                display: true,
                position: "bottom" as const,
            },
        },

        scales: {
            ...options.scales,

            x: {
                ...options.scales?.x,
                stacked: true,
            },

            y: {
                ...options.scales?.y,
                stacked: true,

                ticks: {
                    ...options.scales?.y?.ticks,
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





const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
        return {
            background: "rgba(34, 197, 94, 0.75)",
            border: "rgb(34, 197, 94)",
        };
    }

    if (status >= 300 && status < 400) {
        return {
            background: "rgba(234, 179, 8, 0.75)",
            border: "rgb(234, 179, 8)",
        };
    }

    if (status >= 400 && status < 500) {
        return {
            background: "rgba(249, 115, 22, 0.75)",
            border: "rgb(249, 115, 22)",
        };
    }

    if (status >= 500) {
        return {
            background: "rgba(239, 68, 68, 0.75)",
            border: "rgb(239, 68, 68)",
        };
    }

    return {
        background: "rgba(156, 163, 175, 0.75)",
        border: "rgb(156, 163, 175)",
    };
};