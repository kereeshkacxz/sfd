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
import {useEffect, useState} from 'react';
import {apiRequest} from '@/utils'; 

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

interface WorkerData {
    workerID: string;
    name: string;
    status: string;
}

interface MachineData {
    machineID: string;
    status: string;
    lastMaintenance: string;
}

interface TaskData {
    taskName: string;
    duration: number;
    assignedTo: string;
}

interface StatisticResponse {
    type: 'worker' | 'machine' | 'task';
    data: {
        data: WorkerData | MachineData | TaskData;
    };
}

export default function Statistics() {
    const [workers, setWorkers] = useState<WorkerData[]>([]);
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [machines, setMachines] = useState<MachineData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await apiRequest<StatisticResponse[]>('statistics');
                
                const workersData: WorkerData[] = [];
                const tasksData: TaskData[] = [];
                const machinesData: MachineData[] = [];
                
                data.forEach(item => {
                    if (item.type === 'worker') {
                        workersData.push(item.data.data as WorkerData);
                    } else if (item.type === 'machine') {
                        machinesData.push(item.data.data as MachineData);
                    } else if (item.type === 'task') {
                        tasksData.push(item.data.data as TaskData);
                    }
                });
                
                setWorkers(workersData);
                setTasks(tasksData);
                setMachines(machinesData);
                setLoading(false);
            } catch (error: any) {
                console.error('Error fetching statistics:', error);
                setError(error.message || 'Failed to load statistics');
                setLoading(false);
            }
        }
        
        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

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
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
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

                h2, h3 {
                    margin-bottom: 1rem;
                }

                .loading, .error {
                    padding: 2rem;
                    text-align: center;
                    font-size: 1.2rem;
                }

                .error {
                    color: #ff4444;
                }
            `}</style>
        </div>
    );
}