import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
    BarElement
} from "chart.js";

import type { ChartOptions } from "chart.js";
import type { Request } from "../../../../types";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
    Filler
);

export type Props = {
    data: Request[];
};

export const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: "index",
        intersect: false,
    },
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: "rgba(17, 24, 39, 0.9)",
            titleColor: "#fff",
            bodyColor: "#e5e7eb",
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
                title: (tooltipItems) => {
                    const timestamp = tooltipItems[0].label;
                    const date = new Date(timestamp);
                 
                    const time = date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    });

                    return `${time}`;
                },
                label: (context) => `${context.parsed.y} ms`,
            },
        },
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: {
                maxTicksLimit: 8,
                color: "#6b7280",
                maxRotation: 0,

                callback: function (val) {
                    const timestamp = this.getLabelForValue(val as number);
                    const date = new Date(timestamp);

                    const day = date.getDate().toString().padStart(2, "0");
                    const month = (date.getMonth() + 1).toString().padStart(2, "0");

                    return `${day}.${month}`;
                },
            },
        },
        y: {
            beginAtZero: true,
            border: { display: false },
            grid: { color: "rgba(0, 0, 0, 0.05)" },
            ticks: {
                color: "#6b7280",
                callback: (value) => `${value} ms`,
            },
        },
    },
};