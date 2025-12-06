import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Award, Users, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - Ali Store",
    description: "Learn about Ali Store, your trusted destination for quality footwear. Discover our story, mission, and commitment to excellence.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About Ali Store</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Your trusted destination for quality footwear since 2020
                    </p>
                </div>

                {/* Our Story */}
                <Card className="mb-12">
                    <CardContent className="p-8">
                        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-muted-foreground mb-4">
                                Ali Store was founded with a simple mission: to provide high-quality footwear
                                at affordable prices to customers across Egypt. What started as a small shop
                                in Cairo has grown into a trusted online destination for thousands of satisfied
                                customers.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                We believe that everyone deserves access to comfortable, stylish, and durable
                                shoes without breaking the bank. That's why we carefully curate our collection
                                from the world's leading brands including Nike, Adidas, Puma, and more.
                            </p>
                            <p className="text-muted-foreground">
                                Our commitment to customer satisfaction drives everything we do. From our
                                easy-to-use website to our fast shipping and hassle-free returns, we're
                                constantly working to improve your shopping experience.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <Card className="">
                        <CardContent className="p-6 text-center">
                            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h3 className="text-3xl font-bold mb-2">10,000+</h3>
                            <p className="text-muted-foreground">Products Sold</p>
                        </CardContent>
                    </Card>
                    <Card className="">
                        <CardContent className="p-6 text-center">
                            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h3 className="text-3xl font-bold mb-2">5,000+</h3>
                            <p className="text-muted-foreground">Happy Customers</p>
                        </CardContent>
                    </Card>
                    <Card className="">
                        <CardContent className="p-6 text-center">
                            <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h3 className="text-3xl font-bold mb-2">4.8/5</h3>
                            <p className="text-muted-foreground">Average Rating</p>
                        </CardContent>
                    </Card>
                    <Card className="">
                        <CardContent className="p-6 text-center">
                            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h3 className="text-3xl font-bold mb-2">4 Years</h3>
                            <p className="text-muted-foreground">In Business</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Our Values */}
                <Card className="mb-12">
                    <CardContent className="p-8">
                        <h2 className="text-3xl font-bold mb-6">Our Values</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <Badge variant="default" className="mb-3">Quality First</Badge>
                                <h3 className="text-xl font-semibold mb-2">Authentic Products</h3>
                                <p className="text-muted-foreground">
                                    We only sell 100% authentic products from authorized distributors.
                                    Every item is carefully inspected before shipping.
                                </p>
                            </div>
                            <div>
                                <Badge variant="default" className="mb-3">Customer Focus</Badge>
                                <h3 className="text-xl font-semibold mb-2">Your Satisfaction</h3>
                                <p className="text-muted-foreground">
                                    Our dedicated support team is always ready to help. We offer
                                    easy returns and exchanges within 15 days.
                                </p>
                            </div>
                            <div>
                                <Badge variant="default" className="mb-3">Fair Pricing</Badge>
                                <h3 className="text-xl font-semibold mb-2">Best Value</h3>
                                <p className="text-muted-foreground">
                                    We work directly with brands to offer competitive prices without
                                    compromising on quality.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator className="my-12" />

                {/* Why Choose Us */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-6">Why Choose Ali Store?</h2>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <Card className="">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">✓ Free Shipping</h3>
                                <p className="text-muted-foreground">
                                    On orders of 3 items or more across Egypt
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">✓ Cash on Delivery</h3>
                                <p className="text-muted-foreground">
                                    Pay when you receive your order
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">✓ 15-Day Returns</h3>
                                <p className="text-muted-foreground">
                                    Easy returns for manufacturing defects
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">✓ Secure Shopping</h3>
                                <p className="text-muted-foreground">
                                    Your data is protected and secure
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
