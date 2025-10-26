import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "./Navbar";
import MarkAttendance from "./MarkAttendance";
import AttendanceAnalytics from "./AttendanceAnalytics";
import "./Dashboard.css";

export default function Dashboard() {
    const [student, setStudent] = useState({});
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resStudent = await API.get("/students/me"); // ✅ fixed
                setStudent(resStudent.data);

                const resSubjects = await API.get("/subjects");   // ✅ correct if backend route is /api/subjects
                setSubjects(resSubjects.data);
            } catch (err) {
                console.error(err);
                alert("Session expired. Please login again.");
                localStorage.removeItem("token"); // ✅ remove token
                window.location.href = "/login";
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <h2>🎉 Welcome, {student?.name}!</h2>
                <MarkAttendance subjects={subjects} />
                <AttendanceAnalytics />
            </div>
        </>
    );
}
