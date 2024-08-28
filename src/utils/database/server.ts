import { eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { customersSchema } from '@/models/Schema';
import { createCustomerInStripe, getOrgId } from '@/utils/database/admin';
import { stripe } from '@/utils/stripe/config';

const getCurrentCustomer = async () => {
  const orgId = getOrgId();

  const customer = await db.query.customersSchema.findFirst({
    where: eq(customersSchema.id, orgId),
  });

  return customer;
};

export const createOrRetrieveCustomer = async () => {
  const existingCustomer = await getCurrentCustomer();

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
