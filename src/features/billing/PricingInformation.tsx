import { useTranslations } from 'next-intl';

import { PricingCard } from '@/features/billing/PricingCard';
import { PricingFeature } from '@/features/billing/PricingFeature';
import type { pricesSchema, productsSchema } from '@/models/Schema';
import type { BillingInterval, PlanId } from '@/types/Subscription';
import { PricingPlanMap } from '@/utils/AppConfig';

type Product = typeof productsSchema.$inferSelect;
type Price = typeof pricesSchema.$inferSelect;

type Plan = Product & {
  prices: Array<Price>;
};

const PricingInformation = (props: {
  plans: Array<Plan>;
  buttonList: Record<PlanId, React.ReactNode>;
}) => {
  const t = useTranslations('PricingPlan');

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-3">
      {props.plans.map((plan) => (
        <PricingCard
          key={plan.id}
          planId={plan.metadata?.translationId!}
          price={plan.prices[0]?.unitAmount!}
          currency={plan.prices[0]?.currency!}
          interval={plan.prices[0]?.interval! as BillingInterval}
          button={props.buttonList[plan.metadata?.translationId!]}
        >
          <PricingFeature>
            {t('feature_team_member', {
              number:
                PricingPlanMap[plan.metadata?.translationId!].features
                  .teamMember,
            })}
          </PricingFeature>

          <PricingFeature>
            {t('feature_schema', {
              number:
                PricingPlanMap[plan.metadata?.translationId!].features.schema,
            })}
          </PricingFeature>
          <PricingFeature>{t('feature_email_support')}</PricingFeature>
        </PricingCard>
      ))}
    </div>
  );
};

export { PricingInformation };
