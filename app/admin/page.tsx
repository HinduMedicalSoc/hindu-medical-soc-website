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
      <div className="relative min-h-screen flex flex-col p-4">
        {/* Title centered horizontally */}
        <h1 className="text-4xl font-bold mb-8 text-center">
          Welcome to the Admin Page
        </h1>
        
        {/* Links Section centered vertically */}
        <div className="flex flex-col items-center justify-center flex-grow mb-8">
          <a
            href="/admin/manage-events"
            className="text-white text-lg underline hover:text-gray-300 mb-4"
          >
            Manage Events
          </a>
          <a
            href="/manage-articles"
            className="text-white text-lg underline hover:text-gray-300"
          >
            Manage Articles
          </a>
        </div>

        {/* Logout Button */}
        {user && (
          <button
            onClick={handleLogout}
            className="absolute bottom-6 right-6 px-6 py-3 text-lg font-medium text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </AuthGuard>
  );
}
