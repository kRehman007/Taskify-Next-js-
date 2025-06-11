"use client";
import Link from "next/link";
import React from "react";
import { useAuthStore } from "@/zustand/authStore";
import { LogoutUser } from "@/app/actions/logout";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LogOut, PlusCircle, BarChart } from "lucide-react";
 import TaskifyLogo from "@/public/Taskify.webp"
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  async function handleLogout() {
    try {
      const response = await LogoutUser();
      if (response?.error) {
        throw new Error(response.error);
      }
      router.push("/login");
      localStorage.removeItem("token");
      clearUser();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("error in logout", error.message);
      } else {
        toast.error("Oops..! Something went wrong");
      }
    }
  }

  return (
    <header className="w-full h-14 py-8 bg-gradient-to-r from-purple-600 to-pink-500 fixed top-0 left-0 right-0  text-xs sm:text-sm px-6 shadow-md z-50">
      <nav className="sm:max-w-7xl sm:mx-auto flex justify-between sm:px-10 items-center h-full">
        {/* Logo / Home */}
        <Link
          href={"/"}
          className="flex flex-col sm:flex-row items-center  text-white font-semibold text-lg hover:opacity-90 transition"
        >
          <Image
            src={TaskifyLogo}
            alt="Taskify Logo"
            width={45}
            height={45}
            className="rounded-full"
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            href={"/create-task"}
            className="flex flex-col sm:flex-row items-center sm:gap-2  text-white hover:text-gray-200 transition"
          >
            <PlusCircle size={20} />
            Create Task
          </Link>

          <Link
            href={"/analytics"}
            className="flex flex-col sm:flex-row items-center sm:gap-2  text-white hover:text-gray-200 transition"
          >
            <BarChart size={20} />
            Analytics
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex bg-transparent flex-col font-normal sm:flex-row items-center sm:gap-2 cursor-pointer  text-white hover:text-gray-200 transition"
          >
            <LogOut size={20} className="" />
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
