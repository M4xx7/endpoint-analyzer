import { Line } from "react-chartjs-2";
import type { Props } from "./chartOptions";
import { chartOptions } from "./chartOptions";
import { CHART_THEME } from "../charts/chartColors";

export function LatencyChart({ data }: Props) {
  const chartData = {
    labels: data.map((point) => point.timestamp),
    datasets: [
      {
        label: "Latency",
        data: data.map((point) => point.duration),
        borderColor: CHART_THEME.latencyLine.borderColor,
        backgroundColor: CHART_THEME.latencyLine.backgroundColor,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: CHART_THEME.latencyLine.hoverDotBg,
        pointHoverBorderColor: CHART_THEME.latencyLine.hoverDotBorder,
        pointHoverBorderWidth: 2,
      },
    ],
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}