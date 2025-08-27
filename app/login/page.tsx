// import LoginForm from '@/components/forms/auth/login-form';
// import { cn } from '@/lib/utils';

// import Link from 'next/link';
// import { ArrowLeft, UserIcon } from 'lucide-react';
// import { buttonVariants } from '@/components/ui/button';
// import Image from 'next/image';

// export default function Page() {
//   return (
//     <main>
//       <div className='mx-auto w-full max-w-5xl flex flex-col min-h-screen h-full items-center justify-between py-10'>
//         {/* top */}
//         {/* back absolute top */}
//         <Link
//           href={'/'}
//           className={cn(
//             buttonVariants({ variant: 'ghost' }),
//             ' space-x-2 absolute top-20 left-4 group inline-flex w-max items-center justify-center text-gray-600 hover:text-black rounded-full text-sm font-medium transition-colors focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50'
//           )}
//         >
//           <span>
//             <ArrowLeft className=' w-[18px] h-[18px]' />
//           </span>
//           <span className='text-sm font-semibold'>Back</span>
//         </Link>
//         <section className='w-full flex flex-col items-center flex-1 justify-center p-6'>
//           <div className='flex flex-col items-center justify-center pb-4 pt-2 w-full'>
//             {/* icon */}
//             {/* message */}
//             <div className={cn('text-center space-y-1')}>
//               <h2 className='text-2xl font-semibold'>Login to your account</h2>
//               <p className='text-gray-400'>Enter your details to login.</p>
//             </div>
//           </div>
//           <LoginForm />
//           <div>
//             <div className='flex flex-row items-center space-x-1 text-sm'>
//               <p>Don&apos;t have an account,</p>
//               <Link
//                 href={'/create-account'}
//                 className='text-neutral-500 hover:text-black hover:underline'
//               >
//                 Create Account Here!
//               </Link>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }




"use client";

import { useState } from "react";
import { login } from "../../utils/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError, data } = await login(email, password);

    setLoading(false);

    if (loginError) {
      setError(loginError);
    } else {
      // Redirect to home/dashboard after login
      router.push("/dashboard"); // adjust as needed
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/create-account" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

