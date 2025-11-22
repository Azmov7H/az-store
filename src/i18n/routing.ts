import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar'],      // كل اللغات المدعومة
  defaultLocale: 'en'
});
