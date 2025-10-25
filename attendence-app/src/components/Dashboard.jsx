import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "./Navbar";
import "./Dashboard.css";

export default function Dashboard() {
    const [student, setStudent] = useState({});
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await API.get("/api/student/me");
                setStudent(res.data);
            } catch {
                alert("Could not fetch data. Please login again.");
                navigate("/login");
            }
        };
        fetchStudent();
    }, [navigate]);

    const markAttendance = async () => {
        try {
            const res = await API.post("/api/attendance/mark");
            setStatus(res.data.message);
            const updated = await API.get("/api/student/me");
            setStudent(updated.data);
        } catch (err) {
            setStatus(err.response?.data?.message || "Failed to mark attendance");
        }
    };

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <h2>Welcome, {student.name}</h2>
                <div className="dashboard-summary">
                    <div className="dashboard-card">
                        <h3>Email</h3>
                        <p>{student.email}</p>
                    </div>
                    <div className="dashboard-card">
                        <h3>Attendance</h3>
                        <p>{student.attendanceCount} Days Present</p>
                    </div>
                </div>
                <button className="mark-attendance-btn" onClick={markAttendance}>
                    Mark Attendance
                </button>
                {status && <p className="status-message">{status}</p>}
                <Link to="/history">
                    <button className="mark-attendance-btn">
                        View Attendance History
                    </button>
                </Link>
            </div>
        </>
    );
}
