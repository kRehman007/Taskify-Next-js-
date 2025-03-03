"use client";
import AxiosInstance from "@/lib/AxiosInstance";
import { useAuthStore } from "@/zustand/authStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PageLoader } from "./Loader";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        setLoading(true);
        const res = await AxiosInstance.get("/auth-middleware");

        setUser(res?.data?.user?.user);
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(
            "error in auth-middleware",
            (error as any)?.response?.data?.error
          );
          toast.error((error as any)?.response?.data?.error);
          router.push("/login");
        } else {
          toast.error("Oops! Something went wrong.");
          router.push("/login");
        }
      }
    }

    fetchUserDetails();
  }, [router, setUser]);

  if (loading) return <PageLoader />;
  return <div>{children}</div>;
};

export default ProtectedRoute;
