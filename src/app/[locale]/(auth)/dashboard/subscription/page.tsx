import { getTranslations } from 'next-intl/server';

import { TitleBar } from '@/features/dashboard/TitleBar';
import CustomerPortalForm from '@/features/subscription/CustomerPortalForm';
import { getProducts, getSubscription } from '@/utils/database/queries';

export default async function SubscriptionPage() {
  const t = await getTranslations('SubscriptionIndex');
  const [subscription, products] = await Promise.all([
    getSubscription(),
    getProducts(),
  ]);

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      {/* @ts-ignore */}
      <CustomerPortalForm subscription={subscription} plans={products} />
    </>
  );
}
