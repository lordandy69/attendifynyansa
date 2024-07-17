"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// export const registerUserSchema = z
//   .object({
//     firstName: z.string(),
//     lastName: z.string(),
//     userName: z.string(),
//     email: z.string().email(),
//     phone: z.string().transform((data) => Number(data)),
//     password: z.string().min(6),
//     confirmPassword: z.string().min(6),
//     avatar: z.string().optional(),
//     isVerified: z.boolean().optional(),
//   })
//   .superRefine(({ confirmPassword, password }, ctx) => {
//     if (confirmPassword !== password) {
//       ctx.addIssue({
//         code: "custom",
//         message: "The passwords did not match",
//       });
//     }
//   });

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, User2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

const FormSchema = z
  .object({
    first_name: z.string().min(1, { message: "First Name Is Required" }),
    last_name: z.string().min(1, { message: "Last Name Is Required" }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function CreateAccountForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (d: z.infer<typeof FormSchema>) => {
    return new Promise(async (resolve, reject) => {
      const supabase = supabaseClient();

      const { data, error } = await supabase.auth.signUp({
        email: d.email,
        password: d.password,
        options: {
          data: {
            full_name: `${d.first_name} ${d.last_name}`,
          },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        reject(error);
      }

      resolve(data);
      router.push("/login");
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          return toast.promise(onSubmit(data), {
            loading: "Creating Account...",
            success: (data: any) => `Verify Email At : ${data.user?.email}`,
            error: (err) => `Error: ${err.message}`,
          });
        })}
        className='w-full md:w-80 space-y-4 my-2'
      >
        <FormField
          control={form.control}
          name='first_name'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative flex w-full'>
                  <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <User2 className='h-[18px] w-[18px] text-gray-400' />
                  </span>
                  <Input
                    className='w-full'
                    withIcon
                    placeholder='First Name'
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
          name='last_name'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative flex w-full'>
                  <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <User2 className='h-[18px] w-[18px] text-gray-400' />
                  </span>
                  <Input
                    className='w-full'
                    withIcon
                    placeholder='Last Name'
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
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className='pl-2'>Confirm Password</FormLabel> */}
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
                    placeholder='Confirm Password'
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
          Create Account
        </Button>
        <div className='text-center  text-sm flex-flex-col items-center'>
          <div className='flex flex-row items-center space-x-1 text-sm text-center justify-center mb-3'>
            <span>Already have an account,</span>
            <Link
              href={"/login"}
              className='text-neutral-500 hover:text-black hover:underline'
            >
              Log In!
            </Link>
          </div>
          <span className=''>
            By clicking Register, you agree to accept our
          </span>
          <br />
          <Link
            href={"/terms-and-conditions"}
            className='text-neutral-500 hover:text-black hover:underline'
          >
            Terms and Conditions
          </Link>
        </div>
      </form>
    </Form>
  );
}
