import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import type Stripe from 'stripe';

import { db } from '@/libs/DB';
import {
  customersSchema,
  pricesSchema,
  productsSchema,
  subscriptionsSchema,
} from '@/models/Schema';
import { toDateTime } from '@/utils/Helpers';
import { stripe } from '@/utils/stripe/config';

type Product = typeof productsSchema.$inferInsert;
type Price = typeof pricesSchema.$inferInsert;
type Subscription = typeof subscriptionsSchema.$inferInsert;

const getOrgId = () => {
  const { sessionClaims } = auth();
  console.log({ sessionClaims });

  if (!sessionClaims?.org_id) {
    console.error('Could not get user session.');
    throw new Error('Could not get user session.');
  }

  return sessionClaims.org_id;
};

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    // @ts-ignore
    metadata: product.metadata,
  };

  try {
    await db.insert(productsSchema).values(productData).onConflictDoUpdate({
      target: productsSchema.id,
      set: productData,
    });
  } catch (error) {
    throw new Error(
      `Product insert/update failed: ${(error as Error).message}`,
    );
  }
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3,
) => {
  const priceData: Price = {
    id: price.id,
    productId: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    type: price.type,
    unitAmount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    intervalCount: price.recurring?.interval_count ?? null,
    trialPeriodDays: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
  };

  try {
    await db.insert(pricesSchema).values(priceData).onConflictDoUpdate({
      target: pricesSchema.id,
      set: priceData,
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      console.error(error);
      throw new Error('Price insert/update failed.');
    }

    console.warn(error.message);

    if (error?.message.includes('foreign key constraint')) {
      if (retryCount < maxRetries) {
        console.log(
          `Retry attempt ${retryCount + 1} for price ID: ${price.id}`,
        );
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
        await upsertPriceRecord(price, retryCount + 1, maxRetries);
      } else {
        throw new Error(
          `Price insert/update failed after ${maxRetries} retries: ${error.message}`,
        );
      }
    }
    throw new Error(`Price insert/update failed: ${error.message}`);
  }

  console.log(`Price inserted/updated: ${price.id}`);
};

const deleteProductRecord = async (product: Stripe.Product) => {
  try {
    await db.delete(productsSchema).where(eq(productsSchema.id, product.id));
  } catch (error) {
    throw new Error(`Product deletion failed: ${(error as Error).message}`);
  }

  console.log(`Product deleted: ${product.id}`);
};

const deletePriceRecord = async (price: Stripe.Price) => {
  try {
    await db.delete(pricesSchema).where(eq(pricesSchema.id, price.id));
  } catch (error) {
    throw new Error(`Price deletion failed: ${(error as Error).message}`);
  }

  console.log(`Price deleted: ${price.id}`);
};

const createCustomerInStripe = async (orgId: string): Promise<string> => {
  const customerData = { metadata: { orgId } };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error('Stripe customer creation failed.');

  return newCustomer.id;
};

const createOrRetrieveCustomer = async ({ orgId }: { orgId: string }) => {
  let existingCustomer;
  try {
    existingCustomer = await db.query.customersSchema.findFirst({
      where: eq(customersSchema.id, orgId),
    });
  } catch (error) {
    console.error(error);
    throw new Error('Unable to access customer record.');
  }

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined;
  if (existingCustomer?.stripeCustomerId) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingCustomer.stripeCustomerId,
    );
    stripeCustomerId = existingStripeCustomer.id;
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert =
    stripeCustomerId || (await createCustomerInStripe(getOrgId()));
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

  if (existingCustomer && stripeCustomerId) {
    // If Database has a record but doesn't match Stripe, update Database record
    if (existingCustomer.stripeCustomerId !== stripeCustomerId) {
      await db
        .update(customersSchema)
        .set({ stripeCustomerId })
        .where(eq(customersSchema.id, existingCustomer.id));

      console.warn(
        `Database customer record mismatched Stripe ID. Supabase record updated.`,
      );
    }
    // If Database has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  }
  console.warn(
    `Database customer record was missing. A new record was created.`,
  );

  // If Database has no record, create a new record and return Stripe customer ID
  const upsertedStripeCustomer = await db
    .insert(customersSchema)
    .values({
      id: getOrgId(),
      stripeCustomerId: stripeIdToInsert,
    })
    .returning();

  if (!upsertedStripeCustomer)
    throw new Error('Database customer record creation failed.');

  return upsertedStripeCustomer[0]?.stripeCustomerId;
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  paymentMethod: Stripe.PaymentMethod,
) => {
  // Todo: check this assertion
  const customer = paymentMethod.customer as string;
  const { name, phone, address } = paymentMethod.billing_details;
  if (!name || !phone || !address) return;
  // @ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false,
) => {
  let customerData: typeof customersSchema.$inferSelect | undefined;
  try {
    customerData = await db.query.customersSchema.findFirst({
      where: eq(customersSchema.stripeCustomerId, customerId),
    });
  } catch (error) {
    throw new Error(`Customer lookup failed: ${(error as Error).message}`);
  }

  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData: Subscription = {
    id: subscription.id,
    orgId: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    priceId: subscription.items.data[0]?.price.id,
    // TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    cancelAt: subscription.cancel_at
      ? toDateTime(subscription.cancel_at)
      : null,
    canceledAt: subscription.canceled_at
      ? toDateTime(subscription.canceled_at)
      : null,
    currentPeriodStart: toDateTime(subscription.current_period_start),
    currentPeriodEnd: toDateTime(subscription.current_period_end),
    created: toDateTime(subscription.created),
    endedAt: subscription.ended_at ? toDateTime(subscription.ended_at) : null,
    trialStart: subscription.trial_start
      ? toDateTime(subscription.trial_start)
      : null,
    trialEnd: subscription.trial_end
      ? toDateTime(subscription.trial_end)
      : null,
  };

  try {
    await db
      .insert(subscriptionsSchema)
      .values(subscriptionData)
      .onConflictDoUpdate({
        target: subscriptionsSchema.id,
        set: subscriptionData,
      });
  } catch (error) {
    throw new Error(
      `Subscription insert/update failed: ${(error as Error).message}`,
    );
  }

  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`,
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    // @ts-ignore
    await copyBillingDetailsToCustomer(
      subscription.default_payment_method as Stripe.PaymentMethod,
    );
};

export {
  createCustomerInStripe,
  createOrRetrieveCustomer,
  deletePriceRecord,
  deleteProductRecord,
  getOrgId,
  manageSubscriptionStatusChange,
  upsertPriceRecord,
  upsertProductRecord,
};
