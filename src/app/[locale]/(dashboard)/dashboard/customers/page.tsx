"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Mail, Calendar, MessageSquare, MoreHorizontal, User } from "lucide-react";
// Import getCommits from a client-compatible way or fetch from API route
// Since getCommits is server-side (unstable_cache), we should fetch via our API route
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Customer {
    _id: string;
    username: string;
    email: string;
    commit: string;
    createdAt: string;
    message?: string;
    name: string;
}

export default function CustomersPage() {
    const t = useTranslations("customers");
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                // Fetch from the API route which returns commits (customers)
                const res = await fetch("/api/contact", { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to fetch customers");
                const responseData = await res.json();
                console.log("Fetched customers:", responseData);
                // API route returns { data: { commits: [], ... } }
                const data = responseData.data?.contacts || [];
                setCustomers(data);
                setFilteredCustomers(data);
            } catch (error) {
                console.error("Failed to fetch customers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredCustomers(customers);
            return;
        }
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = customers.filter(c =>
            c.username.toLowerCase().includes(lowerQuery) ||
            c.email.toLowerCase().includes(lowerQuery)
        );
        setFilteredCustomers(filtered);
    }, [searchQuery, customers]);

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <User className="w-8 h-8 text-primary" />
                        {t("title") || "Customers"}
                        <span className="text-sm font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                            {customers.length}
                        </span>
                    </h1>
                    <p className="text-muted-foreground mt-2 pl-11">
                        {t("desc")}
                    </p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder={t("searchPlaceholder") || "Search customers..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20"
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                    ))}
                </div>
            ) : filteredCustomers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/10 rounded-3xl border border-dashed border-border/50">
                    <div className="bg-muted/20 p-6 rounded-full mb-6">
                        <User className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t("noCustomers")}</h3>
                    <p className="text-muted-foreground">
                        {t("adjustSearch")}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCustomers.map((customer) => (
                        <Card key={customer._id} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm group-hover:scale-105 transition-transform">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${customer.name}&background=random`} />
                                        <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-base font-bold line-clamp-1">{customer.name}</CardTitle>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(customer.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                                        <DropdownMenuItem>{t("viewProfile")}</DropdownMenuItem>
                                        <DropdownMenuItem>{t("sendEmail")}</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                                    <Mail className="w-4 h-4 shrink-0" />
                                    <span className="line-clamp-1">{customer.email}</span>
                                </div>

                                {customer.message && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-medium text-primary">
                                            <MessageSquare className="w-3 h-3" />
                                            Feedback
                                        </div>
                                        <p className="text-sm line-clamp-3 italic text-muted-foreground/80 leading-relaxed">
                                            {customer.message}
                                        </p>
                                    </div>
                                )}

                                <div className="pt-2 flex gap-2">
                                    <Badge variant="secondary" className="text-xs font-normal">
                                        {t("verified")}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs font-normal">
                                        {t("active")}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
