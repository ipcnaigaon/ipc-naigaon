/**
 * Member Growth Chart Component
 * Displays member growth trends using Chart.js
 */

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MemberGrowthChart = ({ members }) => {
  // Process data for last 6 months
  const months = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push(date.toLocaleDateString('en-US', { month: 'short' }));
  }

  // Calculate cumulative member count per month
  const monthlyData = months.map((month, index) => {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - (5 - index), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - (5 - index) + 1, 0);
    const membersUpToMonth = members.filter((m) => {
      // Handle both Firestore Timestamp and string dates
      const joinDate = m.joinDate?.toDate ? m.joinDate.toDate() : new Date(m.joinDate);
      return joinDate <= endOfMonth;
    });
    return membersUpToMonth.length;
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Total Members',
        data: monthlyData,
        backgroundColor: '#48bb78',
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
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MemberGrowthChart;
