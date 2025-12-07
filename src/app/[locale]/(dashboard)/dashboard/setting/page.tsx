"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, User, Globe, Moon, Shield, Save } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    const t = useTranslations("settings");

    const handleSave = () => {
        toast.success("Settings saved successfully");
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight">{t("title") || "Settings"}</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="profile" className="rounded-lg gap-2">
                        <User className="w-4 h-4" />
                        {t("profile") || "Profile"}
                    </TabsTrigger>
                    <TabsTrigger value="account" className="rounded-lg gap-2">
                        <Shield className="w-4 h-4" />
                        {t("account") || "Account"}
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-lg gap-2">
                        <Bell className="w-4 h-4" />
                        {t("notifications") || "Notifications"}
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="rounded-lg gap-2">
                        <Moon className="w-4 h-4" />
                        {t("appearance") || "Appearance"}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your photo and personal details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                    <AvatarImage src="/placeholder-avatar.jpg" />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <Button variant="outline" size="sm">Change Photo</Button>
                                    <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" defaultValue="Ali" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" defaultValue="Admin" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Input id="bio" defaultValue="Store Administrator" />
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end border-t bg-muted/20 p-4">
                            <Button onClick={handleSave} className="gap-2">
                                <Save className="w-4 h-4" />
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>Configure when you receive email alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">New Orders</Label>
                                    <p className="text-sm text-muted-foreground">Receive emails when new orders are placed.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Low Stock Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Get notified when products are running low.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Customer Feedback</Label>
                                    <p className="text-sm text-muted-foreground">Receive emails for new customer reviews.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
