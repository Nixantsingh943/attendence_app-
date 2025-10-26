import { useEffect, useState } from "react";
import API from "../api/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#00f6ff", "#8a2be2", "#ff00ff", "#ff6f00"];

export default function AttendanceAnalytics() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            const res = await API.get("/attendance/stats");
            const data = Object.entries(res.data).map(([subject, obj]) => ({
                name: subject,
                Present: obj.Present,
                Absent: obj.Absent
            }));
            setStats(data);
        };
        fetchStats();
    }, []);

    return stats.length ? (
    <div className="attendance-analytics-container">
        <h3>Attendance Analytics</h3>
        <ResponsiveContainer width="100%" height={300} className="attendance-analytics-responsive">
            <PieChart>
                <Pie data={stats} dataKey="Present" nameKey="name" outerRadius={80} fill="#8884d8">
                    {stats.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
) : null;

}

