"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { useRouter } from "next/navigation";
import { signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      return setUser(user);
    });
    return () => unsubscribe();
  }, []);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthGuard>
      <div className='relative min-h-screen flex flex-col p-8 bg-gray-900'>
        {/* Title centered horizontally */}
        <h1 className='text-4xl font-bold mb-12 text-center text-white'>
          Welcome to the Admin Dashboard
        </h1>
        {/* Home button */}
        <button
          onClick={() => router.push("/")}
          className='w-24 px-4 py-2 bg-white text-hmsa-blue font-bold rounded hover:bg-white mb-8'>
          Home
        </button>

        {/* Links Section centered vertically */}
        <div className='flex flex-col items-center justify-center flex-grow gap-6 mb-8'>
          <button
            onClick={() => router.push("/admin/manage-events")}
            className='w-64 px-6 py-4 text-lg font-bold text-hmsa-blue bg-white rounded-lg 
                     hover:bg-blue-700 transition-colors duration-200 shadow-lg
                     hover:shadow--blue-500/25'>
            Manage Events
          </button>
          <button
            onClick={() => router.push("/admin/manage-inquiries")}
            className='w-64 px-6 py-4 text-lg font-bold text-hmsa-blue bg-white rounded-lg 
                     hover:bg-blue-700 transition-colors duration-200 shadow-lg
                     hover:shadow-blue-500/25'>
            Manage Inquiries
          </button>
        </div>

        {/* Logout Button */}
        {user && (
          <button
            onClick={handleLogout}
            className='absolute bottom-6 right-6 px-6 py-3 text-lg font-medium text-white 
                     bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200
                     shadow-lg hover:shadow-red-500/25'>
            Logout
          </button>
        )}
      </div>
    </AuthGuard>
  );
}
