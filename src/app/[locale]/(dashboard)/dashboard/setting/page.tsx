"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
    const t = useTranslations("settings");

    // Store Settings
    const [storeName, setStoreName] = useState("Ali Store");
    const [storeEmail, setStoreEmail] = useState("support@alistore.com");
    const [storePhone, setStorePhone] = useState("01206521571");
    const [storeAddress, setStoreAddress] = useState("Cairo, Egypt");

    // Notification Settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [orderNotifications, setOrderNotifications] = useState(true);
    const [lowStockAlerts, setLowStockAlerts] = useState(true);

    // Shipping Settings
    const [freeShippingThreshold, setFreeShippingThreshold] = useState(3);
    const [standardShippingCost, setStandardShippingCost] = useState(40);

    const handleSaveSettings = () => {
        // In a real app, this would save to database
        toast.success("Settings saved successfully!");
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your store settings and preferences
                </p>
            </div>

            <Separator className="" />

            {/* Store Information */}
            <Card className="">
                <CardHeader className="">
                    <CardTitle className="">Store Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input
                                id="storeName"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="storeEmail">Email</Label>
                            <Input
                                id="storeEmail"
                                type="email"
                                value={storeEmail}
                                onChange={(e) => setStoreEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="storePhone">Phone</Label>
                            <Input
                                id="storePhone"
                                type="tel"
                                value={storePhone}
                                onChange={(e) => setStorePhone(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="storeAddress">Address</Label>
                            <Input
                                id="storeAddress"
                                value={storeAddress}
                                onChange={(e) => setStoreAddress(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Shipping Settings */}
            <Card className="">
                <CardHeader className="">
                    <CardTitle className="">Shipping Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="freeShippingThreshold">
                                Free Shipping Threshold (items)
                            </Label>
                            <Input
                                id="freeShippingThreshold"
                                type="number"
                                min="1"
                                value={freeShippingThreshold}
                                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                Customers get free shipping when ordering this many items or more
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="standardShippingCost">
                                Standard Shipping Cost (EGP)
                            </Label>
                            <Input
                                id="standardShippingCost"
                                type="number"
                                min="0"
                                value={standardShippingCost}
                                onChange={(e) => setStandardShippingCost(Number(e.target.value))}
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                Shipping cost for orders below the free shipping threshold
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="">
                <CardHeader className="">
                    <CardTitle className="">Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="emailNotifications">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive email notifications for important updates
                            </p>
                        </div>
                        <Switch
                            id="emailNotifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>
                    <Separator className="" />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="orderNotifications">Order Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified when new orders are placed
                            </p>
                        </div>
                        <Switch
                            id="orderNotifications"
                            checked={orderNotifications}
                            onCheckedChange={setOrderNotifications}
                        />
                    </div>
                    <Separator className="" />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive alerts when products are running low on stock
                            </p>
                        </div>
                        <Switch
                            id="lowStockAlerts"
                            checked={lowStockAlerts}
                            onCheckedChange={setLowStockAlerts}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
                <CardHeader className="">
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Clear All Orders</Label>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete all order history (cannot be undone)
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (confirm("Are you sure? This action cannot be undone.")) {
                                    toast.error("This feature is disabled in demo mode");
                                }
                            }}
                        >
                            Clear Orders
                        </Button>
                    </div>
                    <Separator className="" />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Reset Store Settings</Label>
                            <p className="text-sm text-muted-foreground">
                                Reset all settings to default values
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (confirm("Reset all settings to default?")) {
                                    setStoreName("Ali Store");
                                    setStoreEmail("support@alistore.com");
                                    setStorePhone("01206521571");
                                    setStoreAddress("Cairo, Egypt");
                                    setFreeShippingThreshold(3);
                                    setStandardShippingCost(40);
                                    setEmailNotifications(true);
                                    setOrderNotifications(true);
                                    setLowStockAlerts(true);
                                    toast.success("Settings reset to default");
                                }
                            }}
                        >
                            Reset Settings
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Cancel
                </Button>
                <Button onClick={handleSaveSettings}>
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
