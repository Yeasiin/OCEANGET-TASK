"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export default function LogoutButton() {
  const router = useRouter();
  const logout = useMutation({
    mutationFn: async () => {
      await axios.post("/api/logout");
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
    },
    onError: (err) => {
      console.error("Logout failed:", err);
      toast.error("Logout failed");
    },
    onSettled: () => {
      router.push("/login");
    },
  });

  return (
    <Button
      onClick={() => logout.mutate()}
      className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-medium"
    >
      {logout.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
