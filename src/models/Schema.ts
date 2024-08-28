import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import type { PlanId } from '@/types/Subscription';

// Note: this is a private table that contains a mapping of user IDs to Stripe customer IDs.
export const customersSchema = pgTable(
  'customers',
  {
    // ID from Clerk
    id: text('id').primaryKey(),
    // The user's customer ID in Stripe. User must not be able to update this.
    stripeCustomerId: text('stripe_customer_id'),
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
    };
  },
);

// Note: products are created and managed in Stripe and synced to our DB via Stripe webhooks.
export const productsSchema = pgTable('products', {
  // Product ID from Stripe, e.g. prod_1234.
  id: text('id').primaryKey(),
  // Whether the product is currently available for purchase.
  active: boolean('active'),
  // The product's name, meant to be displayable to the customer. Whenever this product is sold via a subscription, name will show up on associated invoice line item descriptions.
  name: text('name'),
  // The product's description, meant to be displayable to the customer. Use this field to optionally store a long form explanation of the product being sold for your own rendering purposes.
  description: text('description'),
  // A URL of the product image in Stripe, meant to be displayable to the customer.
  image: text('image'),
  // Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata: jsonb('metadata').$type<{ index: number; translationId: PlanId }>(),
});

// Note: prices are created and managed in Stripe and synced to our DB via Stripe webhooks.
export const priceTypeEnum = pgEnum('pricing_type', ['one_time', 'recurring']);
export const pricingPlanIntervalEnum = pgEnum('pricing_plan_interval', [
  'day',
  'week',
  'month',
  'year',
]);
export const pricesSchema = pgTable('prices', {
  // Price ID from Stripe, e.g. price_1234.
  id: text('id').primaryKey(),
  // The ID of the product that this price belongs to.
  productId: text('product_id').references(() => productsSchema.id),
  // Whether the price can be used for new purchases.
  active: boolean('active'),
  // A brief description of the price.
  description: text('description'),
  // The unit amount as a positive integer in the smallest currency unit (e.g., 100 cents for US$1.00 or 100 for ¥100, a zero-decimal currency).
  unitAmount: bigint('unit_amount', { mode: 'number' }),
  // Three-letter ISO currency code, in lowercase.
  currency: text('currency'),
  // One of `one_time` or `recurring` depending on whether the price is for a one-time purchase or a recurring (subscription) purchase.
  type: priceTypeEnum('type'),
  // The frequency at which a subscription is billed. One of `day`, `week`, `month` or `year`.
  interval: pricingPlanIntervalEnum('interval'),
  // The number of intervals (specified in the `interval` attribute) between subscription billings. For example, `interval=month` and `interval_count=3` bills every 3 months.
  intervalCount: bigint('interval_count', { mode: 'number' }),
  // Default number of trial days when subscribing a customer to this price using [`trial_from_plan=true`](https://stripe.com/docs/api#create_subscription-trial_from_plan).
  trialPeriodDays: bigint('trial_period_days', { mode: 'number' }),
  // Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata: jsonb('metadata'),
});

// Note: subscriptions are created and managed in Stripe and synced to our DB via Stripe webhooks.
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'trialing',
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'unpaid',
  'paused',
]);

export const subscriptionsSchema = pgTable('subscriptions', {
  // Subscription ID from Stripe, e.g. sub_1234.
  id: text('id').primaryKey(),
  // ID of the org that owns this subscription.
  orgId: text('org_id').notNull(),
  // The status of the subscription object, one of subscription_status type above.
  status: subscriptionStatusEnum('status'),
  // Set of key-value pairs, used to store additional information about the object in a structured format.
  metadata: jsonb('metadata'),
  // ID of the price that created this subscription.
  priceId: text('price_id').references(() => pricesSchema.id),
  // Quantity multiplied by the unit amount of the price creates the amount of the subscription. Can be used to charge multiple seats.
  quantity: bigint('quantity', { mode: 'number' }),
  // If true the subscription has been canceled by the user and will be deleted at the end of the billing period.
  cancelAtPeriodEnd: boolean('cancel_at_period_end'),
  // Time at which the subscription was created.
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  // Start of the current period that the subscription has been invoiced for.
  currentPeriodStart: timestamp('current_period_start', { mode: 'date' })
    .defaultNow()
    .notNull(),
  // End of the current period that the subscription has been invoiced for. At the end of this period, a new invoice will be created.
  currentPeriodEnd: timestamp('current_period_end', { mode: 'date' })
    .defaultNow()
    .notNull(),
  // If the subscription has ended, the timestamp of the date the subscription ended.
  endedAt: timestamp('ended_at', { mode: 'date' }),
  // A date in the future at which the subscription will automatically get canceled.
  cancelAt: timestamp('cancel_at', { mode: 'date' }),
  // If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with `cancel_at_period_end`, `canceledAt` will still reflect the date of the initial cancellation request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
  canceledAt: timestamp('canceled_at', { mode: 'date' }),
  // If the subscription has a trial, the beginning of that trial.
  trialStart: timestamp('trial_start', { mode: 'date' }),
  // If the subscription has a trial, the end of that trial.
  trialEnd: timestamp('trial_end', { mode: 'date' }),
});

export const productRelations = relations(productsSchema, ({ many }) => ({
  prices: many(pricesSchema),
}));

export const pricesRelations = relations(pricesSchema, ({ one, many }) => ({
  product: one(productsSchema, {
    fields: [pricesSchema.productId],
    references: [productsSchema.id],
  }),
  subscriptions: many(subscriptionsSchema),
}));

export const subscriptionsRelations = relations(
  subscriptionsSchema,
  ({ one }) => ({
    price: one(pricesSchema, {
      fields: [subscriptionsSchema.priceId],
      references: [pricesSchema.id],
    }),
  }),
);

// export const pricesRelations = relations(pricesSchema, ({ many }) => ({
//   subscription: many(pricesSchema, {
//     fields: [subscriptionsSchema.priceId],
//     references: [pricesSchema.id]
//   })
// )
