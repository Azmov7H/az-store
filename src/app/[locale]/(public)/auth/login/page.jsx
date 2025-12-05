"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    // تحقق بسيط من env
    if (
      user === process.env.NEXT_PUBLIC_DASHBOARD_USER &&
      pass === process.env.NEXT_PUBLIC_DASHBOARD_PASS
    ) {
      // إنشاء كوكيز بسيط للوصول للـ Dashboard
      document.cookie = `dashboard-auth=${process.env.NEXT_PUBLIC_DASHBOARD_SECRET}; path=/dashboard; max-age=3600; Secure; SameSite=Lax`;

      router.push("/dashboard");
    } else {
      alert("اسم المستخدم أو الباسورد غلط 😅");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="p-6 bg-white shadow rounded w-full max-w-sm"
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
