// app/dashboard/students/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getProfiles, updateProfile, deleteProfile, Profile } from "../../../utils/profiles";
import { createStudentAdmin } from "../../../utils/admin";
import styles from "./students.module.css";

export default function StudentsPage() {
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Profile | null>(null);
  const [form, setForm] = useState({ name: "", email: "", username: "", department: "" });

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const data = await getProfiles();
    const studentData = data.filter((s: Profile) => s.role === "student");
    setStudents(studentData);
    setLoading(false);
  };

  const openModal = (student?: Profile) => {
    if (student) {
      setEditingStudent(student);
      setForm({
        name: student.name || "",
        email: student.email || "",
        username: student.username || "",
        department: student.department || "",
      });
    } else {
      setEditingStudent(null);
      setForm({ name: "", email: "", username: "", department: "" });
    }
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingStudent) {
      await updateProfile(editingStudent.id, form);
    } else {
      await createStudentAdmin(form);
    }
    setShowModal(false);
    fetchStudents();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await deleteProfile(id);
      fetchStudents();
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.heading}>Students</div>
      <button className={`${styles.button} ${styles["button-add"]}`} onClick={() => openModal()}>
        Add Student
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.username}</td>
              <td>{student.email}</td>
              <td>{student.department}</td>
              <td>
                <button className={`${styles.button} ${styles["button-edit"]}`} onClick={() => openModal(student)}>Edit</button>
                <button className={`${styles.button} ${styles["button-delete"]}`} onClick={() => handleDelete(student.id!)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles["modal-content"]}>
            <h3>{editingStudent ? "Edit Student" : "Add Student"}</h3>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} />

            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} disabled={!!editingStudent} />

            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />

            <label>Department</label>
            <input name="department" value={form.department} onChange={handleChange} />

            <div className={styles["modal-actions"]}>
              <button className={styles.button} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.button} onClick={handleSubmit}>{editingStudent ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
