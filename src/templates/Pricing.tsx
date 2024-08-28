import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { buttonVariants } from '@/components/ui/button';
import { PricingInformation } from '@/features/billing/PricingInformation';
import { Section } from '@/features/landing/Section';
import { PLAN_ID } from '@/utils/AppConfig';
import { getProducts } from '@/utils/database/queries';

const Pricing = async () => {
  const t = await getTranslations('Pricing');
  const plans = await getProducts();

  return (
    <div id="price">
      <Section
        subtitle={t('section_subtitle')}
        title={t('section_title')}
        description={t('section_description')}
      >
        <PricingInformation
          plans={plans}
          buttonList={{
            [PLAN_ID.FREE]: (
              <Link
                className={buttonVariants({
                  size: 'sm',
                  className: 'mt-5 w-full',
                })}
                href="/sign-up"
              >
                {t('button_text')}
              </Link>
            ),
            [PLAN_ID.PREMIUM]: (
              <Link
                className={buttonVariants({
                  size: 'sm',
                  className: 'mt-5 w-full',
                })}
                href="/sign-up"
              >
                {t('button_text')}
              </Link>
            ),
            [PLAN_ID.ENTERPRISE]: (
              <Link
                className={buttonVariants({
                  size: 'sm',
                  className: 'mt-5 w-full',
                })}
                href="/sign-up"
              >
                {t('button_text')}
              </Link>
            ),
          }}
        />
      </Section>
    </div>
  );
};

export { Pricing };
