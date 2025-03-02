"use client";
import AxiosInstance from "@/lib/AxiosInstance";
import { useAuthStore } from "@/zustand/authStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader, { PageLoader } from "./Loader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { setUser, user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        setLoading(true);
        const res = await AxiosInstance.get("/auth-middleware");

        setUser(res?.data?.user?.user);
        setLoading(false);
      } catch (error) {
        router.push("/login");
      }
    }

    fetchUserDetails();
  }, []);

  if (loading) return <PageLoader />;
  return <div>{children}</div>;
};

export default ProtectedRoute;
