"use client";

import AxiosInstance from "@/lib/AxiosInstance";
import React, { useEffect, useState } from "react";
import { Task } from "../page";
import { useAuthStore } from "@/zustand/authStore";
import { PageLoader } from "@/components/Loader";
import CircularProgressBar from "@/components/CirculareProgressBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TaskAnalyticsDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

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
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user?.id]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="container mx-auto py-8 px-6">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Task Analytics Dashboard 📊
          </h1>
          <p className="text-gray-200 max-w-2xl">
            Gain insights into your productivity with real-time task statistics.
            Track your completed, pending, and total tasks efficiently.
          </p>
        </div>
      </header>

      {/* Statistics Cards */}
      {tasks?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Tasks Card */}
          <div className="bg-yellow-100 dark:bg-yellow-900 transition-colors duration-300 hover:-translate-y-1 transform rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <span className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                Total Tasks 📋
                <span className="text-2xl font-bold">{tasks.length}</span>
              </span>
              <CircularProgressBar value={tasks.length} />
            </div>
          </div>

          {/* Completed Tasks Card */}
          <div className="bg-green-100 dark:bg-green-900 transition-colors duration-300 hover:-translate-y-1 transform rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <span className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                Completed Tasks ✅
                <span className="text-2xl font-bold">
                  {tasks.filter((task) => task.isCompleted).length}
                </span>
              </span>
              <CircularProgressBar
                value={tasks.filter((task) => task.isCompleted).length}
              />
            </div>
          </div>

          {/* Pending Tasks Card */}
          <div className="bg-blue-100 dark:bg-blue-900 transition-colors duration-300 hover:-translate-y-1 transform rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <span className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                Pending Tasks ⏳
                <span className="text-2xl font-bold">
                  {tasks.filter((task) => !task.isCompleted).length}
                </span>
              </span>
              <CircularProgressBar
                value={tasks.filter((task) => !task.isCompleted).length}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Tasks Available 📝
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start adding tasks to stay organized!
          </p>
          <Link href="/create-task">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-8 py-6 shadow-lg"
            >
              Create Task
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TaskAnalyticsDashboard;
