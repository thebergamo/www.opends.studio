import type { LocalePrefix } from 'node_modules/next-intl/dist/types/src/routing/types';

import {
  BILLING_INTERVAL,
  type PlanId,
  type PricingPlan,
} from '@/types/Subscription';

import packageJson from '../../package.json';

const localePrefix: LocalePrefix = 'as-needed';

export const AppConfig = {
  name: 'OpenDS Studio',
  description:
    'Single Source of Truth for your Open Design System with batteries included',
  version: packageJson.version,
  locales: [
    {
      id: 'en',
      name: 'English',
    },
    { id: 'pt-BR', name: 'Português (Brasil)' },
  ],
  defaultLocale: 'en',
  localePrefix,
};

export const SocialLinks = {
  github:
    'https://github.com/open-design-systems/open-design-systems.github.io',
  twitter: 'https://x.com/OpenDS_studio',
  linkedin: 'https://www.linkedin.com/company/open-design-systems',
  // FIXME: Update this link with your YouTube channel
  youtube: 'https://www.youtube.com/channel/UCJ1X6XQJ6Z6ZJZ9JWZyvJ7A',
  contact: 'mailto:hello@opends.studio',
};

export const AllLocales = AppConfig.locales.map((locale) => locale.id);

export const PLAN_ID = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;

export const PricingPlanMap: Record<PlanId, PricingPlan> = {
  [PLAN_ID.FREE]: {
    id: PLAN_ID.FREE,
    price: 0,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: '',
    devPriceId: '',
    prodPriceId: '',
    features: {
      teamMember: 2,
      schema: 1,
    },
  },
  [PLAN_ID.PREMIUM]: {
    id: PLAN_ID.PREMIUM,
    price: 5,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: '',
    devPriceId: '',
    prodPriceId: '',
    features: {
      teamMember: 5,
      schema: 5,
    },
  },
  [PLAN_ID.ENTERPRISE]: {
    id: PLAN_ID.ENTERPRISE,
    price: 99,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: '',
    devPriceId: '',
    prodPriceId: '',
    features: {
      teamMember: 100,
      schema: 100,
    },
  },
};

export const PricingPlanList: Array<PricingPlan> = [
  {
    id: PLAN_ID.FREE,
    price: 0,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: '',
    devPriceId: '',
    prodPriceId: '',
    features: {
      teamMember: 2,
      schema: 1,
    },
  },
  {
    id: PLAN_ID.PREMIUM,
    price: 5,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: '',
    devPriceId: '',
    prodPriceId: '',
    features: {
      teamMember: 5,
      schema: 5,
    },
  },
  {
    id: PLAN_ID.ENTERPRISE,
    price: 99,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: '',
    devPriceId: '',
    prodPriceId: '',
    features: {
      teamMember: 100,
      schema: 100,
    },
  },
];
