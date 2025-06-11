"use client";

import AxiosInstance from "@/lib/AxiosInstance";
import React, { useEffect, useState } from "react";
import { Task } from "../page";
import { useAuthStore } from "@/zustand/authStore";
import { PageLoader } from "@/components/Loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const TaskAnalyticsDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await AxiosInstance.get("/get-all-tasks", {
          headers: { "user-id": user?.id },
        });

        const formattedTasks = response?.data?.allTasks?.map((task: Task) => ({
          ...task,
          _id: Number(task._id),
          isCompleted: task.isCompleted.toString() === "true",
        }));

        setTasks(formattedTasks as Task[]);
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          router.push("/login");
          console.error(
            "Error in fetching tasks:",
            (error as any)?.response?.data?.error
          );
          toast.error((error as any)?.response?.data?.error);
        } else {
          toast.error("Oops! Something went wrong.");
        }
      }
    };

    fetchTasks();
  }, [user?.id]);

  if (loading) {
    return <PageLoader />;
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#6A5ACD] to-[#483D8B] rounded-xl shadow-md overflow-hidden mb-8 m-1 text-center  p-8"
      >
        <h1 className="text-3xl  font-bold text-white">
          Task Analytics Dashboard{" "}
          <span className="text-2xl sm:text-3xl">📊</span>
        </h1>
        <p className="text-gray-200 mt-2 text-lg">
          Gain insights into your task progress with detailed analytics.
        </p>
      </motion.header>

      {/* Statistics Cards */}
      {totalTasks > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  px-6 sm:px-8 lg:px-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Total Tasks */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Total Tasks 📋
            </h3>
            <span className="text-2xl font-bold text-blue-500">
              {totalTasks}
            </span>
            <Progress value={100} className="mt-3" />
          </div>

          {/* Completed Tasks */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Completed Tasks ✅
            </h3>
            <span className="text-2xl font-bold text-green-500">
              {completedTasks}
            </span>
            <Progress
              value={(completedTasks / totalTasks) * 100}
              className="mt-3"
            />
          </div>

          {/* Pending Tasks */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Pending Tasks ⏳
            </h3>
            <span className="text-2xl font-bold text-yellow-500">
              {pendingTasks}
            </span>
            <Progress
              value={(pendingTasks / totalTasks) * 100}
              className="mt-3"
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center  text-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Task Available 📝
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start adding tasks to stay organized!
          </p>
          <Link href="/create-task">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-6 py-3 shadow-lg transition-all"
            >
              Create Task
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default TaskAnalyticsDashboard;
