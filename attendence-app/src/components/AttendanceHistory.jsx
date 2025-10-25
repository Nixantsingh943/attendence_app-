import { useState, useEffect } from "react";
import API from "../api/api";
import Navbar from "./Navbar";
import "./AttendanceHistory.css";

export default function AttendanceHistory() {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await API.get("/api/attendance/history");
                setRecords(res.data);
            } catch {
                alert("Session expired. Please login again.");
            }
        };
        fetchHistory();
    }, []);

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <h2>Attendance History</h2>
                <ul className="attendance-list">
                    {records.map((record) => (
                        <li key={record._id}>
                            {record.date} — {record.status}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
