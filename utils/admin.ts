// utils/admin.ts
import { signUp } from "./auth";

export async function createStudentAdmin({
  username,
  name,
  email,
  department,
}: {
  username: string;
  name: string;
  email: string;
  department?: string;
}) {
  // Generate a default password using username + "1234"
  const password = `${username}1234`;

  // Use signUp function from auth.ts
  const { error, data } = await signUp({ email, password, username, name, role: "student" });

  if (error) return { error, data: null };

  // Update the department if provided
  if (department) {
    const { updateProfile } = await import("./profiles");
    await updateProfile(data.id, { department });
  }

  return { error: null, data };
}
