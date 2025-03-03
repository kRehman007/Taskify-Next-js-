"use client";
import { useEffect, useState } from "react";
import AxiosInstance from "@/lib/AxiosInstance";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Loader, { PageLoader } from "@/components/Loader";
import toast from "react-hot-toast";
import { FormateDate } from "@/lib/utils";
import Link from "next/link";
import { Trash } from "lucide-react";
import { motion } from "framer-motion";
import { DeleteTask } from "../actions/deleteAction";
import { useAuthStore } from "@/zustand/authStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Define types for our task data
export interface Task {
  _id: number;
  title: string;
  content: string;
  createdAt: Date;
  isCompleted: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [IsDeleting, setIsDeleting] = useState(false);
  const [taskId, setTaskId] = useState<number | null>(null);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const handleCompleteToggle = async (taskId: number) => {
    try {
      await AxiosInstance.post("/update-task", { id: taskId });
      setTasks(
        tasks?.map((task: Task) =>
          task._id === taskId
            ? { ...task, isCompleted: !task.isCompleted }
            : task
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          "Can't update status for now",
          (error as any)?.response?.data?.error
        );
        toast.error((error as any)?.response?.data?.error);
      } else {
        toast.error("Oops! Something went wrong.");
      }
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await AxiosInstance.get("/get-all-tasks", {
          headers: { "user-id": user?.id },
        });

        const formatedTasks = response?.data?.allTasks?.map((task: Task) => ({
          ...task,
          isCompleted: task.isCompleted.toString() === "true",
        }));
        setTasks(formatedTasks as Task[]);
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          router.push("/login");
          console.error(
            "Error fetching tasks:",
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
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      {tasks?.length === 0 && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 m-1 rounded-xl shadow-lg text-center"
        >
          <h1 className="text-3xl font-bold mb-3">
            Manage Your Tasks Efficiently 🚀
          </h1>
          <p className="text-lg">
            Stay organized and productive with your personalized task manager.
          </p>
        </motion.header>
      )}
      {tasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-[#673AB7] via-pink-400 to-[#E91E63] text-white p-6 rounded-xl shadow-lg text-center mb-6"
        >
          <h1 className="text-3xl font-bold">Your Task Overview 📋</h1>
          <p className="text-lg mt-2">
            Stay on track with your tasks! Check your progress, complete pending
            tasks, and keep moving forward.
          </p>
        </motion.div>
      )}

      {/* Statistics Cards */}
      {tasks?.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid sm:grid-cols-4 gap-4 m-2"
        >
          {tasks?.map((task: Task) => (
            <Card
              key={task._id}
              className="transition-all duration-200 hover:-translate-y-0.5 px-3 py-6 relative
              h-[max-content]"
            >
              <CardHeader className="flex flex-col gap-2 p-0">
                <CardTitle className="flex justify-between gap-3 items-center p-0">
                  <h3 className="text-lg font-semibold leading-tight capitalize">
                    {task.title}
                  </h3>
                  <div
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => handleCompleteToggle(task._id)}
                  >
                    <Checkbox
                      checked={task.isCompleted}
                      className="border-green-600"
                    />
                    {task.isCompleted ? (
                      <span className="text-sm text-green-600">completed</span>
                    ) : (
                      <span className="text-sm text-green-600">pending</span>
                    )}
                  </div>
                </CardTitle>
                <CardContent className="p-0 pb-6">{task.content}</CardContent>
              </CardHeader>

              <CardFooter className="p-0 absolute left-3 bottom-3 right-4 flex justify-between ">
                <time className="text-sm text-muted-foreground">
                  Created_at: {FormateDate(task.createdAt)}
                </time>
                <Link
                  href={""}
                  onClick={async () => {
                    try {
                      setIsDeleting(true);
                      setTaskId(task._id);
                      await DeleteTask(task._id);
                      setTasks((prevTask) =>
                        prevTask.filter((t) => t._id !== task._id)
                      );
                      toast.success("task deleted successfully");
                    } catch (error: unknown) {
                      if (error instanceof Error) {
                        console.log("can't delete task for now", error.message);
                        toast.error(error.message);
                      } else {
                        toast.error("Oops! Something went wrong.");
                      }
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                >
                  {IsDeleting && task._id === taskId ? (
                    <Loader />
                  ) : (
                    <Trash size={"20"} />
                  )}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className=" w-full flex flex-col items-center justify-center text-center p-6 mt-3 sm:mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-700">
            No Tasks Available
          </h2>
          <p className="text-gray-500">Start adding tasks to stay organized!</p>
          <Link href={"/create-task"}>
            <Button className="bg-green-600 mt-3 sm:mt-4 px-12 text-sm">
              Create Task{" "}
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
