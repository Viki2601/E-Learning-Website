import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const GraphJobs = ({ data }) => {
    const chartData = {
        labels: data.map(d => d.month),
        datasets: [
            {
                label: 'New Courses per Month',
                data: data.map(d => d.count),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold',
                        family: 'Arial',
                    },
                    color: '#333',
                },
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#333',
                bodyColor: '#666',
                borderWidth: 1,
                borderColor: '#ddd',
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#333',
                    font: {
                        size: 12,
                        family: 'Arial',
                    },
                },
            },
            y: {
                grid: {
                    color: '#ddd',
                },
                ticks: {
                    color: '#333',
                    font: {
                        size: 12,
                        family: 'Arial',
                    },
                },
            },
        },
    };

    return (
        <div>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default GraphJobs;
