"use client";

import { useEffect, useState } from "react";
import { getAllRows, insertRow, updateRow, deleteRow } from "../../../utils/db";
import { Profile, Attendance, AttendanceStatus, Session } from "../../../utils/types";
import styles from "./attendance.module.css";

export default function AttendancePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Profile[]>([]);
  const [manualStudentId, setManualStudentId] = useState("");
  const [manualStatus, setManualStatus] = useState<AttendanceStatus>("present");
  const [loading, setLoading] = useState(true);

  // Load sessions and students
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: sessionsData } = await getAllRows<Session>("sessions");
      const { data: studentsData } = await getAllRows<Profile>("profiles");
      setSessions(sessionsData || []);
      setStudents((studentsData || []).filter(s => s.role === "student"));
      setLoading(false);
    }
    fetchData();
  }, []);

  // Load attendance for selected session
  useEffect(() => {
    async function fetchAttendance() {
      if (!selectedSession) return;
      setLoading(true);
      const { data } = await getAllRows<Attendance>("attendance");
      const filtered = (data || []).filter(a => a.session_id === selectedSession.id);
      setAttendance(filtered);
      setLoading(false);
    }
    fetchAttendance();
  }, [selectedSession]);

  const handleManualAttendance = async () => {
    if (!selectedSession || !manualStudentId) return alert("Select session and student ID");
    const newRecord: Partial<Attendance> = {
      session_id: selectedSession.id,
      student_id: manualStudentId,
      status: manualStatus,
    };
    const { error } = await insertRow("attendance", newRecord);
    if (error) return alert("Error adding attendance: " + error);
    setManualStudentId("");
    setManualStatus("present");
    // Refresh attendance table
    const { data } = await getAllRows<Attendance>("attendance");
    const filtered = (data || []).filter(a => a.session_id === selectedSession.id);
    setAttendance(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    const { error } = await deleteRow("attendance", "id", id);
    if (error) return alert("Error deleting: " + error);
    setAttendance(prev => prev.filter(a => a.id !== id));
  };

  const handleStatusChange = async (id: string, status: AttendanceStatus) => {
    const { error } = await updateRow("attendance", "id", id, { status });
    if (error) return alert("Error updating: " + error);
    setAttendance(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>Attendance Management</h1>

      <div className={styles.sessionSelector}>
        <label>Select Session:</label>
        <select
          value={selectedSession?.id || ""}
          onChange={e => {
            const session = sessions.find(s => s.id === e.target.value) || null;
            setSelectedSession(session);
          }}
        >
          <option value="">-- Select --</option>
          {sessions.map(s => (
            <option key={s.id} value={s.id}>
              {s.course_id} | {s.session_date} | {s.session_time} | {s.venue}
            </option>
          ))}
        </select>
      </div>

      {selectedSession && (
        <>
          <h2>Attendance Records for Session</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Status</th>
                <th>Time Logged</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => {
                const student = students.find(s => s.id === a.student_id);
                return (
                  <tr key={a.id}>
                    <td>{student?.name || a.student_id}</td>
                    <td>
                      <select
                        value={a.status}
                        onChange={e => handleStatusChange(a.id, e.target.value as AttendanceStatus)}
                      >
                        <option value="present">Present</option>
                        <option value="late">Late</option>
                        <option value="absent">Absent</option>
                      </select>
                    </td>
                    <td>{a.time_logged}</td>
                    <td>
                      <button className={styles.deleteButton} onClick={() => handleDelete(a.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className={styles.manualAttendance}>
            <h3>Manual Attendance</h3>
            <select
              value={manualStudentId}
              onChange={e => setManualStudentId(e.target.value)}
            >
              <option value="">-- Select Student --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.student_id})
                </option>
              ))}
            </select>
            <select
              value={manualStatus}
              onChange={e => setManualStatus(e.target.value as AttendanceStatus)}
            >
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
            </select>
            <button onClick={handleManualAttendance}>Add Attendance</button>
          </div>
        </>
      )}
    </div>
  );
}
