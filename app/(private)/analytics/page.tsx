"use client";

import AxiosInstance from "@/lib/AxiosInstance";
import React, { useEffect, useState } from "react";
import { Task } from "../page";
import { useAuthStore } from "@/zustand/authStore";
import { PageLoader } from "@/components/Loader";
import CirculareProgressBar from "@/components/CirculareProgressBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const page = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await AxiosInstance.get("/get-all-tasks", {
          headers: { "user-id": user?.id },
        });

        const formattedTasks = response?.data?.allTasks?.map((task: any) => ({
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
  }, []);

  if (loading) {
    return <PageLoader />;
  }
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-2 mx-1">
          Task Analytics Dashboard 📊
        </h1>
        <p className="text-lg">
          Gain insights into your productivity with real-time task statistics.
          Track your completed, pending, and total tasks efficiently.
        </p>
      </div>

      {tasks?.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 my-6 mx-2">
          <div className="flex flex-col items-center bg-yellow-200 p-6 rounded-xl shadow-md gap-3">
            <span className="text-xl font-semibold text-gray-700">
              Total Tasks 📋
            </span>
            <CirculareProgressBar value={tasks.length} />
          </div>
          <div className="flex flex-col items-center bg-green-300 p-6 rounded-xl shadow-md gap-3">
            <span className="text-xl font-semibold text-gray-700">
              Completed Tasks ✅
            </span>
            <CirculareProgressBar
              value={tasks.filter((task) => task.isCompleted).length}
            />
          </div>
          <div className="flex flex-col items-center bg-blue-300 p-6 rounded-xl shadow-md gap-3">
            <span className="text-xl font-semibold text-gray-700">
              Pending Tasks ⏳
            </span>
            <CirculareProgressBar
              value={tasks.filter((task) => !task.isCompleted).length}
            />
          </div>
        </div>
      ) : (
        <div className=" w-full flex flex-col items-center justify-center text-center p-6 mt-3 sm:mt-8">
          <h2 className="text-xl font-semibold text-gray-700">
            No Tasks Available
          </h2>
          <p className="text-gray-500">Start adding tasks to stay organized!</p>
          <Link href={"/create-task"}>
            <Button className="bg-green-600 mt-3 sm:mt-4 px-12 text-sm">
              Create Task{" "}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default page;
