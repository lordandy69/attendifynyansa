// import CreateAccountForm from "@/components/forms/auth/create-account-form";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { ArrowLeft, UserPlusIcon } from "lucide-react";
// import { buttonVariants } from "@/components/ui/button";

// export default function Page() {
//   return (
//     <main>
//       <div className='mx-auto w-full max-w-5xl flex flex-col min-h-screen h-full items-center justify-center py-10'>
//         {/* back absolute top */}
//         <Link
//           href={"/"}
//           className={cn(
//             buttonVariants({ variant: "ghost" }),
//             " space-x-2 absolute top-20 left-4 group inline-flex w-max items-center justify-center text-gray-600 hover:text-black rounded-full text-sm font-medium transition-colors focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
//           )}
//         >
//           <span>
//             <ArrowLeft className=' w-[18px] h-[18px]' />
//           </span>
//           <span className='text-sm font-semibold'>Back</span>
//         </Link>
//         <section className='w-full flex flex-col items-center flex-1 justify-center p-6'>
//           <div className='flex flex-col items-center justify-center pb-4 pt-2 w-full'>
//             {/* message */}
//             <div className={cn("text-center space-y-1")}>
//               <h2 className='text-2xl font-semibold'>Create a new account</h2>
//               <p className='text-gray-400'>Enter your details to register.</p>
//             </div>
//           </div>
//           <CreateAccountForm />
//         </section>
//       </div>
//     </main>
//   );
// }



"use client";

import { useState } from "react";
import { signUp } from "../../utils/auth";
import { useRouter } from "next/navigation";
import { UserRole } from "../../utils/types";

export default function CreateAccountPage() {
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<UserRole>("student"); // default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError, data } = await signUp({
      email,
      password,
      name,
      username,
      role,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError);
    } else {
      // Redirect to login page or dashboard after successful signup
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />

          <input
            // type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full p-2 border rounded"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
