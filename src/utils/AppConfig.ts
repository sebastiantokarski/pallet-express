import type { LocalizationResource } from '@clerk/types';
import type { LocalePrefixMode } from 'next-intl/routing';
import { enUS, plPL } from '@clerk/localizations';

const localePrefix: LocalePrefixMode = 'as-needed';

export const AppConfig = {
  name: 'Pallet Express',
  locales: ['en', 'pl'],
  defaultLocale: 'en',
  localePrefix,
};

const supportedLocales: Record<string, LocalizationResource> = {
  en: enUS,
  pl: plPL,
};

export const ClerkLocalizations = {
  defaultLocale: enUS,
  supportedLocales,
};
