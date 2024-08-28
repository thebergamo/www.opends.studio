import { and, eq, inArray, sql } from 'drizzle-orm';
import { cache } from 'react';

import { db } from '@/libs/DB';
import {
  pricesSchema,
  productsSchema,
  subscriptionsSchema,
} from '@/models/Schema';

import { getOrgId } from './admin';

export const getSubscription = cache(async () => {
  const orgId = getOrgId();
  try {
    const subscription = await db.query.subscriptionsSchema.findFirst({
      with: {
        price: {
          with: {
            product: true,
          },
        },
      },
      where: and(
        eq(subscriptionsSchema.orgId, orgId),
        inArray(subscriptionsSchema.status, ['active', 'trialing']),
      ),
    });

    return subscription;
  } catch (err) {
    console.error(err);
    return null;
  }
});

export const getProducts = cache(async () => {
  const products = await db.query.productsSchema.findMany({
    with: {
      prices: true,
    },
    where: and(eq(productsSchema.active, true), eq(pricesSchema.active, true)),
    orderBy: [sql`metadata->>'index' asc`],
  });

  return products;
});
