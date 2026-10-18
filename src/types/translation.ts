// A next-intl translator function accepted across Server/Client Components
import { getTranslations } from "next-intl/server";

export type TranslationFn = Awaited<ReturnType<typeof getTranslations>>;
