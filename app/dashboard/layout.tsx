"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "../../utils/auth";
import "./layout.css";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { error, data } = await getCurrentUser();
      console.log("Current user data:", data);
      console.log("Current user data:", data!.user_metadata);
      if (error || !data) {
        router.push("/login"); // redirect if not authenticated
      } else {
        setUser(data);
      }
      setLoading(false);
    }
    checkUser();
  }, [router]);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">Dashboard</div>
        <nav className="sidebar-nav">
          <button onClick={() => router.push("/dashboard/students")}>Students</button>
          <button onClick={() => router.push("/dashboard/courses")}>Courses</button>
          <button onClick={() => router.push("/dashboard/sessions")}>Sessions</button>
          <button onClick={() => router.push("/dashboard/teachers")}>Teachers</button>
          <button onClick={() => router.push("/dashboard/attendance")}>Attendance</button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
