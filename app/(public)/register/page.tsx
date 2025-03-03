"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import Link from "next/link";
import { useAuthStore } from "@/zustand/authStore";
import { useRouter } from "next/navigation";
import AxiosInstance from "@/lib/AxiosInstance";
import toast from "react-hot-toast";

const formSchma = z.object({
  fullname: z
    .string({ required_error: "fullname is required" })
    .min(1, "full name can't be empty"),
  username: z
    .string({ required_error: "username is required" })
    .min(1, "full name can't be empty"),
  email: z
    .string({ required_error: "email is required" })
    .email("please enter valid email"),
  password: z
    .string({ required_error: "password is required" })
    .min(6, "password must be 6 characters long"),
});
const Signuppage = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchma>>({
    resolver: zodResolver(formSchma),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
    },
  });
  async function onSubmit(data: z.infer<typeof formSchma>) {
    try {
      const response = await AxiosInstance.post("/signup", data);

      setUser({
        ...response?.data?.user,
        token: response?.data?.user?.token,
      });
      localStorage.setItem("token", response?.data?.user?.token);
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Signup failed:", (error as any)?.response?.data);
        toast.error((error as any)?.response?.data);
      } else {
        toast.error("Ooops...! Something went wrong");
      }
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-200 px-5 sm:p-0 pt-10 sm:pt-20">
      <div className="max-w-xl sm:mx-auto     text-black p-5 shadow-sm bg-white  rounded-sm  ">
        <div className="flex flex-col items-center ">
          <span className="text-2xl font-bold">Create New Account</span>
          <small>Keep your data safe!</small>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-8"
          >
            {/* FullName... */}
            <FormField
              name="fullname"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FullName</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="john Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* UserName... */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UserName</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="john" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email... */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password... */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Loader /> : "Create"}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-3">
          Already have an account?{" "}
          <Link href={"/login"} className="text-blue-600">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signuppage;
