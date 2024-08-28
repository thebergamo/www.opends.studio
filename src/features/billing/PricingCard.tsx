import { useTranslations } from 'next-intl';
import React from 'react';

import type { BillingInterval, PlanId } from '@/types/Subscription';

const PricingCard = (props: {
  planId: PlanId;
  price: number;
  currency: string;
  interval: BillingInterval;
  button: React.ReactNode;
  children: React.ReactNode;
}) => {
  const t = useTranslations('PricingPlan');
  const planPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.currency || 'USD',
    minimumFractionDigits: 0,
  }).format((props.price || 0) / 100);

  return (
    <div className="rounded-xl border border-border px-6 py-8 text-center">
      <div className="text-lg font-semibold">
        {t(`${props.planId}_plan_name`)}
      </div>

      <div className="mt-3 flex items-center justify-center">
        <div className="text-5xl font-bold">{planPrice}</div>

        <div className="ml-1 text-muted-foreground">
          / {t(`plan_interval_${props.interval}`)}
        </div>
      </div>

      <div className="mt-2 text-sm text-muted-foreground">
        {t(`${props.planId}_plan_description`)}
      </div>

      {props.button}

      <ul className="mt-8 space-y-3">{props.children}</ul>
    </div>
  );
};

export { PricingCard };
