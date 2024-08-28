'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type {
  pricesSchema,
  productsSchema,
  subscriptionsSchema,
} from '@/models/Schema';
import type { PlanId } from '@/types/Subscription';
import { PLAN_ID } from '@/utils/AppConfig';
import { getStripe } from '@/utils/stripe/client';
import {
  checkoutWithStripe,
  createStripePortal,
  upgradeSubscription,
} from '@/utils/stripe/server';

import { PricingInformation } from '../billing/PricingInformation';

type Subscription = typeof subscriptionsSchema.$inferSelect;
type Price = typeof pricesSchema.$inferSelect;
type Product = typeof productsSchema.$inferSelect;

export type SubscriptionWithPriceAndProduct = Subscription & {
  price:
    | (Price & {
        product: Product | null;
      })
    | null;
};
export type Plan = Product & {
  prices: Array<Price>;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
  plans: Array<Plan>;
}

export default function CustomerPortalForm({ subscription, plans }: Props) {
  const t = useTranslations('SubscriptionIndex');
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const getPlan = (translationId: PlanId) =>
    plans.find((p) => p.metadata?.translationId === translationId);

  const getPriceId = (translationId: PlanId) =>
    getPlan(translationId)?.prices[0]?.id!;

  const isCurrentPlan = (planType: PlanId) => {
    if (!subscription && planType === PLAN_ID.FREE) return true;

    return subscription?.priceId === getPriceId(planType);
  };

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    router.push(redirectUrl);
  };

  // eslint-disable-next-line consistent-return
  const handleStripeCheckout = async (priceId: string) => {
    setPriceIdLoading(priceId);

    if (subscription) {
      try {
        toast.info(t('subscription_update'));
        await upgradeSubscription(subscription.id, priceId);
        toast.success(t('subscription_update_success'));
        return router.push('/dashboard');
      } catch (error) {
        setPriceIdLoading(undefined);
        return toast.error(t('subscription_update_error'));
      }
    }

    const { errorCode, sessionId } = await checkoutWithStripe(
      priceId,
      'recurring',
      currentPath,
    );

    if (errorCode) {
      setPriceIdLoading(undefined);
      return toast.error(t(errorCode));
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return toast.error(t('checkout_error'));
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    return setPriceIdLoading(undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('portal_title')}</CardTitle>
        <CardDescription>
          {t('current_plan', {
            planName: subscription?.price?.product?.name || PLAN_ID.FREE,
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-xl font-semibold">
          <h2 className="pb-4 text-xl font-semibold">
            {!subscription && t('choose_plan')}
          </h2>
          <PricingInformation
            plans={plans}
            buttonList={{
              [PLAN_ID.FREE]: (
                <Button
                  className="mt-5 w-full"
                  size="sm"
                  disabled={
                    priceIdLoading === getPriceId(PLAN_ID.FREE) ||
                    isCurrentPlan(PLAN_ID.FREE)
                  }
                  onClick={() => handleStripeCheckout(getPriceId(PLAN_ID.FREE))}
                >
                  {isCurrentPlan(PLAN_ID.FREE) && t('button_current_plan')}
                  {!isCurrentPlan(PLAN_ID.FREE) && t('downgrade_button_text')}
                </Button>
              ),
              [PLAN_ID.PREMIUM]: (
                <Button
                  className="mt-5 w-full"
                  size="sm"
                  disabled={
                    priceIdLoading === getPriceId(PLAN_ID.PREMIUM) ||
                    isCurrentPlan(PLAN_ID.PREMIUM)
                  }
                  onClick={() =>
                    handleStripeCheckout(getPriceId(PLAN_ID.PREMIUM))
                  }
                >
                  {isCurrentPlan(PLAN_ID.PREMIUM) && t('button_current_plan')}
                  {isCurrentPlan(PLAN_ID.ENTERPRISE) &&
                    t('downgrade_button_text')}
                  {isCurrentPlan(PLAN_ID.FREE) && t('upgrade_button_text')}
                </Button>
              ),
              [PLAN_ID.ENTERPRISE]: (
                <Button
                  className="mt-5 w-full"
                  size="sm"
                  disabled={
                    priceIdLoading === getPriceId(PLAN_ID.ENTERPRISE) ||
                    isCurrentPlan(PLAN_ID.ENTERPRISE)
                  }
                  onClick={() =>
                    handleStripeCheckout(getPriceId(PLAN_ID.ENTERPRISE))
                  }
                >
                  {isCurrentPlan(PLAN_ID.ENTERPRISE) &&
                    t('button_current_plan')}
                  {!isCurrentPlan(PLAN_ID.ENTERPRISE) &&
                    t('upgrade_button_text')}
                </Button>
              ),
            }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="gap-4 text-xl font-semibold">
          <p className="pb-4 sm:pb-0">Manage your subscription on Stripe</p>
          <Button
            onClick={handleStripePortalRequest}
            disabled={isSubmitting}
            className="mt-4"
          >
            Open customer portal
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
