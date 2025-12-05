"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

const handleLogin = async (e) => {
  e.preventDefault();

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, pass }),
  });

  const data = await res.json();
  if (data.success) {
    router.push("/dashboard");
  } else {
    toast.error("اسم المستخدم أو الباسورد غلط 😅");
  }
};


  return (
    <div className="flex items-center justify-center h-screen ">
      <form
        onSubmit={handleLogin}
        className="p-6  shadow rounded w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-4 text-center">Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="mb-2 border p-2 w-full rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="mb-4 border p-2 w-full rounded"
        />
        <button
          type="submit"
          className="bg-black text-white p-2 w-full rounded hover:bg-gray-800 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
