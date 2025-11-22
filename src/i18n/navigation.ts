import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// تغليف خفيف حول Next.js navigation يأخذ إعدادات routing في الاعتبار
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
