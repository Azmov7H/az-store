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

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
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
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <p className="text-muted-foreground">support@alistore.com</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            We'll respond within 24 hours
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
                                        <h3 className="font-semibold mb-1">Phone</h3>
                                        <p className="text-muted-foreground">01206521571</p>
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
                                        <h3 className="font-semibold mb-1">Address</h3>
                                        <p className="text-muted-foreground">
                                            Cairo, Egypt
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Visit our showroom
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
                                        <h3 className="font-semibold mb-1">Business Hours</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Monday - Saturday: 9:00 AM - 6:00 PM
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            Sunday: Closed
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
                                <CardTitle className="">Send us a Message</CardTitle>
                            </CardHeader>
                            <CardContent className="">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="" htmlFor="name">Full Name *</Label>
                                            <Input
                                                className=""
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <Label className="" htmlFor="email">Email *</Label>
                                            <Input
                                                className=""
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="" htmlFor="phone">Phone</Label>
                                            <Input
                                                className=""
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="01234567890"
                                            />
                                        </div>
                                        <div>
                                            <Label className="" htmlFor="subject">Subject *</Label>
                                            <Input
                                                className=""
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                placeholder="How can we help?"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="" htmlFor="message">Message *</Label>
                                        <Textarea
                                            className=""
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            placeholder="Tell us more about your inquiry..."
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
                                            Clear
                                        </Button>
                                        <Button type="submit" disabled={loading} variant="default" size="default" className="">
                                            {loading ? "Sending..." : "Send Message"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* FAQ Section */}
                        <Card className="mt-8">
                            <CardHeader className="">
                                <CardTitle className="">Frequently Asked Questions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">How long does shipping take?</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Standard shipping takes 2-5 business days within Cairo and 3-7 days for other cities.
                                    </p>
                                </div>
                                <Separator className="" />
                                <div>
                                    <h3 className="font-semibold mb-2">What is your return policy?</h3>
                                    <p className="text-muted-foreground text-sm">
                                        We offer a 15-day return policy for manufacturing defects. Items must be unused and in original packaging.
                                    </p>
                                </div>
                                <Separator className="" />
                                <div>
                                    <h3 className="font-semibold mb-2">Do you offer cash on delivery?</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Yes! We accept cash on delivery for all orders across Egypt.
                                    </p>
                                </div>
                                <Separator className="" />
                                <div>
                                    <h3 className="font-semibold mb-2">Are your products authentic?</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Absolutely! All our products are 100% authentic and sourced from authorized distributors.
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
