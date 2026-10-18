import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "ui-avatars.com",
            },
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
            },
        ],
    },
    experimental: {
        optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    },
    compress: true,
    poweredByHeader: false,
};

export default withNextIntl(nextConfig);
