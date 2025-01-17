"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";

export default function ManageEvents() {
  const [events, setEvents] = useState([]); // Replace with actual event data
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to homepage after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthGuard>
      <div className="relative min-h-screen p-4">
        {/* Title centered horizontally */}
        <h1 className="text-4xl font-bold mb-8 text-center">
          Manage Events
        </h1>

        {/* Manage Events content */}
        <div className="text-center">
          <p>Here you can manage your events</p>
          {/* Render your events or any related content */}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute bottom-6 right-6 px-6 py-3 text-lg font-medium text-white bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </AuthGuard>
  );
}
