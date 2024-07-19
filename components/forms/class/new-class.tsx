"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { CalendarIcon, Eye, EyeOff, Lock, Mail, User2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, genUUID } from "@/lib/utils";
import { format } from "date-fns";
import { TimePicker } from "@/components/ui/time-picker";
import { useGetSession } from "@/lib/supabase/session";

type classType = Database["public"]["Tables"]["classes"]["Row"];

const FormSchema = z.object({
  teacher_name: z.string().min(1, { message: "Is Required" }),
  teacher_id: z.string().min(1, { message: "Is Required" }),
  class_name: z.string().min(1, { message: "Is Required" }),
  class_start: z.date(),
  class_end: z.date(),
  class_location: z.string().min(1, { message: "Is Required" }),
});

export default function NewClassForm() {
  const { profile } = useGetSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      teacher_name: profile?.full_name!,
      teacher_id: profile?.user_id!,
      class_name: "",
      class_location: "",
    },
  });

  const onSubmit = (d: z.infer<typeof FormSchema>) => {
    return new Promise<classType>(async (resolve, reject) => {
      // return new Promise<z.infer<typeof FormSchema>>(async (resolve, reject) => {
      const supabase = supabaseClient();

      const time_start = format(d.class_start, "yyyy-MM-dd'T'HH:mm:ssXXX");
      const time_end = format(d.class_end, "yyyy-MM-dd'T'HH:mm:ssXXX");
      const class_id = genUUID();

      const { data, error } = await supabase
        .from("classes")
        .insert({
          teacher_name: d.teacher_name,
          teacher_id: d.teacher_id,
          class_name: d.class_name,
          class_id: class_id,
          class_start: time_start,
          class_end: time_end,
          location: d.class_location,
        })
        .select("*")
        .single();

      if (error) {
        reject(error);
      } else {
        resolve(data!);
        router.push(`/class/${data?.class_id!}`);
      }

      // resolve(d.class_start);
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          return toast.promise(onSubmit(data), {
            loading: "Creating Class...",
            // success: (data) => (
            //   <pre>
            //     <code>{JSON.stringify(data, null, 2)}</code>
            //   </pre>
            // ),
            success: (data) => `Class Created`,
            error: (err) => `Error: ${err.message}`,
          });
        })}
        className='w-full md:w-80 space-y-4 my-2'
      >
        <FormField
          control={form.control}
          name='teacher_name'
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
                    disabled
                    placeholder='Teacher Name'
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
          name='teacher_id'
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
                    disabled
                    placeholder='Teacher Id'
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
          name='class_name'
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
                    placeholder='Class Name'
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
          name='class_location'
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
                    placeholder='Class Location'
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
          name='class_start'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel className='text-left'>Class Start</FormLabel>
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {field.value ? (
                        format(field.value, "PPP p")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className='p-3 border-t border-border'>
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </div>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='class_end'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel className='text-left'>Class End</FormLabel>
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {field.value ? (
                        format(field.value, "PPP p")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className='p-3 border-t border-border'>
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </div>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <Button className='w-full rounded-3xl h-10' type='submit'>
          Create Class
        </Button>
      </form>
    </Form>
  );
}
