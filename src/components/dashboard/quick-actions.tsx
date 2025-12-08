"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function QuickActionsWidget() {
    const t = useTranslations("dashboard");

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">{t("quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5" asChild>
                    <Link href="/dashboard/products">
                        <Plus className="w-6 h-6 text-primary" />
                        <span>{t("addProduct")}</span>
                    </Link>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 hover:border-blue-500/50 hover:bg-blue-500/5" asChild>
                    <Link href="/dashboard/orders">
                        <FileText className="w-6 h-6 text-blue-500" />
                        <span>{t("manageOrders")}</span>
                    </Link>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 hover:border-emerald-500/50 hover:bg-emerald-500/5" asChild>
                    <Link href="/dashboard/customers">
                        <Users className="w-6 h-6 text-emerald-500" />
                        <span>{t("customers")}</span>
                    </Link>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 hover:border-gray-500/50 hover:bg-gray-500/5" asChild>
                    <Link href="/dashboard/settings">
                        <Settings className="w-6 h-6 text-gray-500" />
                        <span>{t("settings")}</span>
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
