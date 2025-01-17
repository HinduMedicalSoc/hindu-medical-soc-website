"use client";
import { AuthGuard } from "@/components/AuthGuard";

export default function AdminPage() {
  return (
    <AuthGuard>
      <div>
        <h1>Welcome to the Admin Page</h1>
      </div>
    </AuthGuard>
  );
}
