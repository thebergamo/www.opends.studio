'use server';

import type Stripe from 'stripe';

import { createOrRetrieveCustomer } from '@/utils/database/server';
import { getErrorRedirect, getURL } from '@/utils/Helpers';
import { stripe } from '@/utils/stripe/config';

type CheckoutResponse = {
  errorCode?: string;
  sessionId?: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function initAction() {} // literally empty

export async function upgradeSubscription(
  subscriptionId: string,
  priceId: string,
) {
  try {
    let subscription;
    try {
      subscription = await stripe.subscriptions.retrieve(subscriptionId);
    } catch (err) {
      console.error(err);
      throw new Error('Unable to retrieve subscription.');
    }

    if (!subscription) {
      throw new Error('Could not get subscription.');
    }

    try {
      await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: subscription.items.data[0]?.id,
            price: priceId,
          },
        ],
      });
    } catch (err) {
      console.error(err);
      throw new Error('Unable to update subscription.');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }
}

export async function checkoutWithStripe(
  priceId: string,
  type: 'recurring' | 'one_time',
  redirectPath: string = '/dashboard/subscription',
): Promise<CheckoutResponse> {
  try {
    // Retrieve or create the customer in Stripe
    let customer;
    try {
      customer = await createOrRetrieveCustomer();
    } catch (err) {
      console.error(err);
      throw new Error('Unable to access customer record.');
    }

    if (!customer) {
      throw new Error('Could not get customer.');
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer,
      customer_update: {
        address: 'auto',
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      cancel_url: getURL(),
      success_url: getURL(redirectPath),
    };

    if (type === 'recurring') {
      params = {
        ...params,
        mode: 'subscription',
      };
    } else if (type === 'one_time') {
      params = {
        ...params,
        mode: 'payment',
      };
    }

    // Create a checkout session in Stripe
    let session;
    try {
      console.log('stripee');
      session = await stripe.checkout.sessions.create(params);
    } catch (err) {
      console.error(err);
      throw new Error('Unable to create checkout session.');
    }

    // Instead of returning a Response, just return the data or error.
    if (session) {
      return { sessionId: session.id };
    }
    throw new Error('Unable to create checkout session.');
  } catch (error) {
    return {
      errorCode: 'UNKNOWN_RETRY',
    };
  }
}

export async function createStripePortal(currentPath: string) {
  try {
    let customer;
    try {
      customer = await createOrRetrieveCustomer();
    } catch (err) {
      console.error(err);
      throw new Error('Unable to access customer record.');
    }

    if (!customer) {
      throw new Error('Could not get customer.');
    }

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL('/dashboard/subscriptions'),
      });
      if (!url) {
        throw new Error('Could not create billing portal');
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error('Could not create billing portal');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return getErrorRedirect(
        currentPath,
        error.message,
        'Please try again later or contact a system administrator.',
      );
    }
    return getErrorRedirect(
      currentPath,
      'An unknown error occurred.',
      'Please try again later or contact a system administrator.',
    );
  }
}
