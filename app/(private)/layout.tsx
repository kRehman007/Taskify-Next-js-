"use client";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ProtectedRoute>
        <Navbar />
        <div className="mt-20 p-3">{children}</div>
      </ProtectedRoute>
    </>
  );
}
