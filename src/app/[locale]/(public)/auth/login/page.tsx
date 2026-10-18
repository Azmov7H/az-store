"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User } from "lucide-react";

export default function LoginPage() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(false);
    const t = useTranslations("LoginPage");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user, pass }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success(t("success"));
                // Hard navigation ensures middleware runs with the fresh cookie
                window.location.replace("/dashboard");
            } else {
                toast.error(t("invalid"));
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(t("error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted/50 to-background p-4 animate-in fade-in duration-500">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <Card className="w-full max-w-md shadow-2xl border-white/20 bg-card/80 backdrop-blur-xl relative z-10 transition-all hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
                <CardHeader className="space-y-1 text-center pb-8">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">{t("title")}</CardTitle>
                    <CardDescription>
                        {t("subtitle")}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">{t("username")}</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="username"
                                    placeholder="admin"
                                    type="text"
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                    className="pl-9 bg-background/50"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t("password")}</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    placeholder="••••••••"
                                    type="password"
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    className="pl-9 bg-background/50"
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full font-semibold shadow-lg shadow-primary/20"
                            disabled={loading}
                        >
                            {loading ? t("signingIn") : t("signIn")}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <div className="absolute bottom-6 text-center text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Az Store. All rights reserved.
            </div>
        </div>
    );
}
