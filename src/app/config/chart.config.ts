import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  PieController,
} from "chart.js";

// Register all Chart.js components that we might use
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  PieController,
);

// Default chart configurations
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
    },
  },
};

export const doughnutChartOptions = {
  ...defaultChartOptions,
  plugins: {
    ...defaultChartOptions.plugins,
    legend: {
      position: "right" as const,
    },
  },
};

export const barChartOptions = {
  ...defaultChartOptions,
  scales: {
    x: {
      display: true,
    },
    y: {
      display: true,
      beginAtZero: true,
    },
  },
};
