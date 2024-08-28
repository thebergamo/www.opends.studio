import { and, eq, inArray, sql } from 'drizzle-orm';
import { cache } from 'react';

import { db } from '@/libs/DB';
import {
  pricesSchema,
  productsSchema,
  subscriptionsSchema,
} from '@/models/Schema';

export const getSubscription = cache(async () => {
  try {
    const subscription = await db.query.subscriptionsSchema.findFirst({
      with: {
        price: {
          with: {
            product: true,
          },
        },
      },
      where: inArray(subscriptionsSchema.status, ['active', 'trialing']),
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
