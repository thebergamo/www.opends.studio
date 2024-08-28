import Stripe from 'stripe';

import { AppConfig } from '@/utils/AppConfig';

import { getBaseUrl } from '../Helpers';

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
  {
    // https://github.com/stripe/stripe-node#configuration
    // https://stripe.com/docs/api/versioning
    // @ts-ignore
    apiVersion: null,
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: AppConfig.name,
      version: AppConfig.version,
      url: getBaseUrl(),
    },
  },
);
