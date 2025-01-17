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
  if (user) {
    return (
      <AuthGuard>
        <div className='p-4'>
          <h1 className='text-2xl font-bold'>Welcome to the Admin Page</h1>
          {/* Add your admin content here */}
          <button
            onClick={handleLogout}
            className='px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600'>
            Logout
          </button>
        </div>
      </AuthGuard>
    );
  }
  return (
    <AuthGuard>
      <div className='p-4'>
        <h1 className='text-2xl font-bold'>Welcome to the Admin Page</h1>
        {/* Add your admin content here */}
      </div>
    </AuthGuard>
  );
}
