import { useState } from "react";
import API from "../api/api"; // Make sure this is your axios instance
import SubjectSelect from "./SubjectSelect";
import "./MarkAttendance.css";

export default function MarkAttendance() {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [status, setStatus] = useState("");

    const handleMark = async () => {
        if (!selectedSubject) {
            return alert("Please select a subject!");
        }

        try {
            console.log("Sending subject:", selectedSubject); // debug
            const res = await API.post("/attendance/mark", {
                subjectId: selectedSubject._id,
            });
            setStatus(res.data.message || "Attendance marked successfully!");
        } catch (err) {
            console.error("Error marking attendance:", err.response || err);
            setStatus(
                err.response?.data?.message || "Failed to mark attendance"
            );
        }
    };

    return (
        <div className="mark-attendance-container">
            <h2>Mark Attendance</h2>
            <SubjectSelect onSelect={setSelectedSubject} />
            <button onClick={handleMark}>Mark Attendance</button>
            {status && <p>{status}</p>}
        </div>
    );
}

