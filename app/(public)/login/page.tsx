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
import AxiosInstance from "@/lib/AxiosInstance";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password can't be empty"),
});

const LoginPage = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await AxiosInstance.post("/login", data);
      setUser({
        ...response?.data?.user,
        token: response?.data?.user?.token,
      });

      localStorage.setItem("token", response?.data?.user?.token);
      router.push("/");
      toast.success("Successfully logged in");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Login failed:", (error as any)?.response?.data?.error);
        toast.error((error as any)?.response?.data?.error);
      } else {
        toast.error("Oops! Something went wrong.");
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen  bg-gray-200  px-4">
      <div className="max-w-md w-full bg-white text-black shadow-xl rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600">Login to your account</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            {/* Email */}
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

            {/* Password */}
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

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Loader /> : "Login"}
            </Button>
          </form>
        </Form>

        {/* Sign Up Link */}
        <div className="text-center mt-4 text-gray-700">
          Don't have an account?{" "}
          <Link href={"/register"} className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
