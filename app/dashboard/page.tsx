"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to history by default
    router.push("/dashboard/history");
  }, [router]);

  return (
    <div>
        
    </div>
  );
}
