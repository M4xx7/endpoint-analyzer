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

export const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false, 
    interaction: {
        mode: "index",
        intersect: false,
    },
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: "#1e1e1e",
            titleColor: "#ffffff",
            bodyColor: "#b8bdc9",
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            callbacks: {
                title: (tooltipItems) => {
                    const timestamp = tooltipItems[0].label;
                    const date = new Date(timestamp);
                 
                    return date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    });
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
                color: "#b8bdc9",
                font: { size: 12 },
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
            grid: { color: "rgba(255, 255, 255, 0.04)" }, 
            ticks: {
                color: "#b8bdc9",
                font: { size: 12 },
                callback: (value) => `${value} ms`,
            },
        },
    },
};