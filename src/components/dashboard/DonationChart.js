/**
 * Donation Chart Component
 * Displays donation trends using Chart.js
 */

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DonationChart = ({ donations }) => {
  // Process data for last 6 months
  const months = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push(date.toLocaleDateString('en-US', { month: 'short' }));
  }

  // Calculate monthly totals
  const monthlyData = months.map((month, index) => {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - (5 - index), 1);
    const monthDonations = donations.filter((d) => {
      // Handle both Firestore Timestamp and string dates
      const donationDate = d.date?.toDate ? d.date.toDate() : new Date(d.date);
      return (
        donationDate.getMonth() === monthDate.getMonth() &&
        donationDate.getFullYear() === monthDate.getFullYear()
      );
    });
    return monthDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Donations',
        data: monthlyData,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default DonationChart;
