// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "../../utils/auth";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await getCurrentUser();
      setUser(data);
    }
    fetchUser();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
      {user && (
        <p className="text-gray-700">
          Hello, <span className="font-semibold">{user.email}</span>! You are logged in as{" "}
          <span className="capitalize">{user.role}</span>.
        </p>
      )}
      <div className="mt-6 p-4 bg-white shadow rounded">
        <p>Select an option from the sidebar to get started.</p>
      </div>
    </div>
  );
}
