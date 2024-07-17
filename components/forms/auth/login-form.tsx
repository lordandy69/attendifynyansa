"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/user";
import { supabaseClient } from "@/lib/supabase/client";

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6),
});

export default function LoginForm() {
  const { updateUser, updateProfile } = useUserStore((state) => state);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { user } = useUserStore((state) => state);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [router, user]);

  const [submit, setSubmit] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (d: z.infer<typeof FormSchema>) => {
    return new Promise(async (resolve, reject) => {
      const supabase = supabaseClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: d.email,
        password: d.password,
      });

      if (error) {
        reject(error);
      } else {
        updateUser(data.user);
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .single();
        updateProfile(profile);
        resolve(data);
        router.refresh();
        router.push("/");
      }

      router.refresh();
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          return toast.promise(onSubmit(data), {
            loading: "Logging in...",
            success: (data: any) => `Logged in as ${data.user?.email}`,
            error: (err: any) => `Error: ${err.message}`,
          });
        })}
        className='w-full md:w-80 space-y-4 my-4'
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className='pl-2'>Email</FormLabel> */}
              <FormControl>
                <div className='relative flex w-full'>
                  <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <Mail className='h-[18px] w-[18px] text-gray-400' />
                  </span>
                  <Input
                    className='w-full'
                    withIcon
                    placeholder='Email'
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className='pl-2' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className='pl-2'>Password</FormLabel> */}
              <FormControl>
                <div className='relative flex h-10 w-full'>
                  <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <Lock className='h-[18px] w-[18px] text-gray-400' />
                  </span>
                  <Input
                    type={showPassword ? "text" : "password"}
                    className='w-full'
                    password
                    withIcon
                    placeholder='Password'
                    {...field}
                  />
                  <span
                    className='p-2 cursor-pointer absolute right-0 top-0'
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className='h-6 w-6 text-gray-400' />
                    ) : (
                      <Eye className='h-6 w-6 text-gray-400' />
                    )}
                  </span>
                </div>
              </FormControl>
              <FormMessage className='pl-2' />
            </FormItem>
          )}
        />
        <Button className='w-full rounded-3xl h-10' type='submit'>
          {submit}
        </Button>
      </form>
    </Form>
  );
}
