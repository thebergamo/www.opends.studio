import { Share2Icon, SymbolIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';

import { Background } from '@/components/Background';
import { CollabIcon } from '@/components/icons/CollabIcon';
import { FeatureCard } from '@/features/landing/FeatureCard';
import { Section } from '@/features/landing/Section';

const Features = () => {
  const t = useTranslations('Features');

  return (
    <div id="product">
      <Background>
        <Section
          subtitle={t('section_subtitle')}
          title={t('section_title')}
          description={t('section_description')}
        >
          <div className="grid grid-cols-1 gap-x-3 gap-y-8 md:grid-cols-3">
            <FeatureCard
              icon={<SymbolIcon className="size-7 stroke-primary-foreground" />}
              title={t('feature1_title')}
            >
              {t('feature1_description')}
            </FeatureCard>

            <FeatureCard
              icon={<Share2Icon className="size-7 stroke-primary-foreground" />}
              title={t('feature2_title')}
            >
              {t('feature2_description')}
            </FeatureCard>

            <FeatureCard
              icon={
                <CollabIcon className="size-7 stroke-primary-foreground stroke-2" />
              }
              title={t('feature3_title')}
            >
              {t('feature3_description')}
            </FeatureCard>
          </div>
        </Section>
      </Background>
    </div>
  );
};

export { Features };
