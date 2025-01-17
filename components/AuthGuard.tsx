"use client";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("AuthGuard", user);
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) return null;

  return <>{children}</>;
}
