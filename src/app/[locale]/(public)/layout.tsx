import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/providers/cart-provider";

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <CartProvider>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 mt-16">{children}</main>
                <Footer />
            </div>
        </CartProvider>
    );
}
