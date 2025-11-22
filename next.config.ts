import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin({
  // يمكنك تمرير إعدادات إضافية هنا
});

export default withNextIntl(nextConfig);
