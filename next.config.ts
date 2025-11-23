import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images:{
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol:"https",
        hostname:"ui-avatars.com"
      }
    ],
  }
};

const withNextIntl = createNextIntlPlugin({
  // يمكنك تمرير إعدادات إضافية هنا
});

export default withNextIntl(nextConfig);
