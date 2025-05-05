'use client';

import {Bar, Line, Pie} from 'react-chartjs-2';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';

import workers from './workers.json';
import tasks from './tasks.json';
import machines from './machines.json';

ChartJS.register(
    LineElement,
    BarElement,
    PointElement,
    ArcElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
);

export default function Statistics() {
    // === 1. Столбчатая диаграмма: Задачи по сотрудникам
    const taskCounts: Record<string, number> = {};
    tasks.forEach((t) => {
        taskCounts[t.assignedTo] = (taskCounts[t.assignedTo] || 0) + 1;
    });

    const workerLabels = Object.keys(taskCounts).map((id) => {
        const w = workers.find((w) => w.workerID === id);
        return w?.name || id;
    });

    const barData = {
        labels: workerLabels,
        datasets: [
            {
                label: 'Количество задач',
                data: Object.values(taskCounts),
                backgroundColor: '#4BC0C0',
            },
        ],
    };

    // === 2. Линейный график: Активные сотрудники
    const activeCount = workers.filter((w) => w.status === 'active').length;
    const lineData = {
        labels: ['Янв', 'Фев', 'Март', 'Апр'],
        datasets: [
            {
                label: 'Активные сотрудники',
                data: [1, 2, 2, activeCount],
                fill: false,
                borderColor: '#36A2EB',
                tension: 0.3,
            },
        ],
    };

    // === 3. Круговая диаграмма: Статусы машин
    const machineStatusCount: Record<string, number> = {};
    machines.forEach((m) => {
        machineStatusCount[m.status] = (machineStatusCount[m.status] || 0) + 1;
    });

    const pieData = {
        labels: Object.keys(machineStatusCount),
        datasets: [
            {
                label: 'Статусы',
                data: Object.values(machineStatusCount),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };

    return (
        <div className="dashboard">
            <h2>Статистика</h2>

            {/* Большой график сверху */}
            <div className="card full">
                <h3>Количество задач по сотрудникам</h3>
                <Bar data={barData} />
            </div>

            {/* Два графика ниже в строку */}
            <div className="row">
                <div className="card">
                    <h3>Активные сотрудники</h3>
                    <Line data={lineData} />
                </div>
                <div className="card">
                    <h3>Статусы машин</h3>
                    <Pie data={pieData} />
                </div>
            </div>

            <style jsx>{`
                .dashboard {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    max-width: 100%;
                }

                .card {
                    flex: 1;
                    background: transparent;
                    border-radius: 10px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                    min-width: 0;
                }

                .full {
                    width: 100%;
                }

                .row {
                    display: flex;
                    gap: 2rem;
                    flex-wrap: wrap;
                }

                .row .card {
                    flex: 1 1 45%;
                }

                canvas {
                    max-height: 400px;
                    width: 100% !important;
                    height: auto !important;
                }

                h2,
                h3 {
                    margin-bottom: 1rem;
                }
            `}</style>
        </div>
    );
}
