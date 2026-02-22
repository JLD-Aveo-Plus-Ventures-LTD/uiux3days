import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

/**
 * LeadsChart - Weekly bar chart for dashboard
 * 
 * Displays lead count by day (Mon-Sun) using Chart.js
 * 
 * @param {Object} data - Chart data object
 * @param {Array<string>} data.labels - Day labels (Mon-Sun)
 * @param {Array<Object>} data.datasets - Array with single dataset containing lead counts
 * @param {Object} options - Optional Chart.js options (defaults provided)
 * @returns {JSX.Element} Responsive bar chart component
 * 
 * @example
 * const data = {
 *   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
 *   datasets: [{
 *     label: 'Leads',
 *     data: [12, 19, 8, 15, 22, 10, 14],
 *     backgroundColor: '#0ea5e9',
 *   }]
 * };
 * <LeadsChart data={data} />
 */

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LeadsChart = ({ data, options: customOptions }) => {
  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      barThickness: 10,
      maxBarThickness: 12,
      categoryPercentage: 0.4,
      barPercentage: 0.35,
      borderRadius: 6,
    })),
  };

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: '500',
          },
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 4,
        titleFont: {
          size: 14,
          weight: '600',
        },
        bodyFont: {
          size: 13,
        },
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          font: {
            size: 12,
          },
          color: '#94a3b8',
        },
        grid: {
          color: 'rgba(203, 213, 225, 0.2)',
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
            weight: '400',
          },
          color: '#9ca3af',
          padding: 10,
        },
        grid: {
          display: false,
        },
        offset: true,
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...customOptions };

  return (
    <div className="leads-chart">
      <Bar data={chartData} options={mergedOptions} />
    </div>
  );
};

export default LeadsChart;
