"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import styles from "./teachers.module.css";

interface Teacher {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  teacher_id: string;
  department: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    department: "",
  });

  const fetchTeachers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "teacher");

    if (error) {
      console.error("Error fetching teachers:", error.message);
    } else {
      setTeachers(data as Teacher[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async () => {
    if (!formData.username || !formData.email) {
      alert("Username and Email are required");
      return;
    }

    // Generate password from username
    const generatedPassword = `${formData.username}12345`;

    const { data: user, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: generatedPassword,
    });

    if (signUpError) {
      alert("Error creating teacher: " + signUpError.message);
      return;
    }

    if (user?.user) {
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: user.user.id,
          username: formData.username,
          name: formData.name,
          email: formData.email,
          role: "teacher",
          teacher_id: "T-" + Math.floor(1000 + Math.random() * 9000),
          department: formData.department,
        },
      ]);

      if (insertError) {
        alert("Error saving teacher profile: " + insertError.message);
      } else {
        setFormData({ username: "", name: "", email: "", department: "" });
        fetchTeachers();
      }
    }
  };

  const handleUpdate = async (id: string, updatedName: string, updatedDepartment: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ name: updatedName, department: updatedDepartment })
      .eq("id", id);

    if (error) {
      alert("Error updating teacher: " + error.message);
    } else {
      fetchTeachers();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      alert("Error deleting teacher: " + error.message);
    } else {
      fetchTeachers();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Teachers Management</h1>

      {/* Form */}
      <div className={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className={styles.input}
        />
        <button onClick={handleCreate} className={styles.button}>
          Add Teacher
        </button>
      </div>

      {/* List */}
      {loading ? (
        <p>Loading teachers...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Teacher ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.teacher_id}</td>
                <td>{teacher.username}</td>
                <td>
                  <input
                    type="text"
                    defaultValue={teacher.name}
                    onBlur={(e) => handleUpdate(teacher.id, e.target.value, teacher.department)}
                    className={styles.inputInline}
                  />
                </td>
                <td>{teacher.email}</td>
                <td>
                  <input
                    type="text"
                    defaultValue={teacher.department}
                    onBlur={(e) => handleUpdate(teacher.id, teacher.name, e.target.value)}
                    className={styles.inputInline}
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
