"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function ContactPage() {
    const t = useTranslations("Contact");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to send message");

            toast.success(t("success"));
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            toast.error(
                (error instanceof Error && error.message) || t("error")
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {t("title")}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Mail className="h-6 w-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {t("email")}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            support@alistore.com
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {t("respondTime")}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Phone className="h-6 w-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {t("phone")}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            01206521571
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Mon-Sat: 9 AM - 6 PM
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-6 w-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {t("address")}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Cairo, Egypt
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {t("visitShowroom")}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Clock className="h-6 w-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            {t("businessHours")}
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            {t("hours")}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            {t("sunday")}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="">
                            <CardHeader className="">
                                <CardTitle className="">{t("sendMessage")}</CardTitle>
                            </CardHeader>
                            <CardContent className="">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="" htmlFor="name">
                                                {t("fullName")}
                                            </Label>
                                            <Input
                                                className=""
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder={t("placeholderName")}
                                            />
                                        </div>
                                        <div>
                                            <Label className="" htmlFor="email">
                                                {t("emailLabel")}
                                            </Label>
                                            <Input
                                                className=""
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder={t("placeholderEmail")}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="" htmlFor="phone">
                                                {t("phoneLabel")}
                                            </Label>
                                            <Input
                                                className=""
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder={t("placeholderPhone")}
                                            />
                                        </div>
                                        <div>
                                            <Label className="" htmlFor="subject">
                                                {t("subjectLabel")}
                                            </Label>
                                            <Input
                                                className=""
                                                id="subject"
                                                name="subject"
                                                type="text"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                placeholder={t("placeholderSubject")}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="" htmlFor="message">
                                            {t("messageLabel")}
                                        </Label>
                                        <Textarea
                                            className=""
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            placeholder={t("placeholderMessage")}
                                        />
                                    </div>

                                    <Separator className="" />

                                    <div className="flex justify-end gap-4">
                                        <Button
                                            className=""
                                            type="button"
                                            variant="outline"
                                            size="default"
                                            onClick={() =>
                                                setFormData({
                                                    name: "",
                                                    email: "",
                                                    phone: "",
                                                    subject: "",
                                                    message: "",
                                                })
                                            }
                                        >
                                            {t("clear")}
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            variant="default"
                                            size="default"
                                            className=""
                                        >
                                            {loading ? t("sendSending") : t("sendIdle")}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* FAQ Section */}
                        <Card className="mt-8">
                            <CardHeader className="">
                                <CardTitle className="">{t("faqTitle")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        {t("faq1q")}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {t("faq1a")}
                                    </p>
                                </div>
                                <Separator className="" />
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        {t("faq2q")}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {t("faq2a")}
                                    </p>
                                </div>
                                <Separator className="" />
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        {t("faq3q")}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {t("faq3a")}
                                    </p>
                                </div>
                                <Separator className="" />
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        {t("faq4q")}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        {t("faq4a")}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
