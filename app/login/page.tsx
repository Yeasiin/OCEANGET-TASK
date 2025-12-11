"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Page() {
  const router = useRouter();

  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginFormData) =>
      axios
        .post(`/api/login`, data)
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response?.data?.error || "Login failed");
        }),
    onSuccess: (res) => {
      document.cookie = `token=${res.token}; path=/; max-age=3600; HttpOnly`;
      toast.success("Login successful!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      router.refresh();
      router.push("/dashboard");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    login.mutate(data);
  };

  return (
    <div className="mt-16">
      <div className=" max-w-[400px]  mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border px-6 py-6 rounded"
        >
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="mt-5 grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" size={"sm"} className="px-7 mt-4">
            {login.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
          {login.isError && (
            <p className="text-xs text-red-500">{login.error?.message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
