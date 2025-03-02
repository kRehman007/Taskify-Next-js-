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
import { Textarea } from "@/components/ui/textarea";

import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AxiosInstance from "@/lib/AxiosInstance";
import { useAuthStore } from "@/zustand/authStore";

const formSchma = z.object({
  title: z.string().min(1, "Title can't be empty"),
  content: z
    .string()
    .min(1, "Content can't be empty")
    .max(200, "Only 200 charcters are allowed"),
});

const CreateTaskPage = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const form = useForm<z.infer<typeof formSchma>>({
    resolver: zodResolver(formSchma),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchma>) {
    try {
      await AxiosInstance.post("/create-task", data, {
        headers: { "user-id": user?.id },
      });
      router.push("/");
      toast.success("Task created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Oops..! Something went wrong.");
    }
  }

  return (
    <div className="flex max-w-lg flex-col p-5 mt-5  sm:mt-10 justify-center sm:mx-auto items-center bg-white m-2 rounded-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create New Task</h2>
        <p className="text-gray-500">Stay organized by adding new tasks!</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-full"
        >
          {/* Title Input */}
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter task title"
                    {...field}
                    className="border-gray-300 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content Textarea */}
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Enter task details"
                    {...field}
                    className="border-gray-300 max-h-[100px] sm:max-h-[150px] focus:ring-blue-500 resize-none overflow-y-auto"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-all"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? <Loader /> : "Create Task"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateTaskPage;
