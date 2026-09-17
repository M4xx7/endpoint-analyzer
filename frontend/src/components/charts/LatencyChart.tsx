import { Line } from "react-chartjs-2";
import type { Props } from "./chartOptions";
import { options } from "./chartOptions";

export function LatencyChart({ data }: Props) {
  const chartData = {
    labels: data.map((point) => point.timestamp),
    datasets: [
      {
        label: "Latency",
        data: data.map((point) => point.duration),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "rgb(99, 102, 241)",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  return (
    <div className="chart-container" style={{ height: "300px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}