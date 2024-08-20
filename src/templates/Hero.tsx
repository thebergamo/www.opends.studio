import { GitHubLogoIcon, RocketIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { XLogoIcon } from '@/components/icons/XLogoIcon';
import { buttonVariants } from '@/components/ui/button';
import { CenteredHero } from '@/features/landing/CenteredHero';
import { Section } from '@/features/landing/Section';
import { SocialLinks } from '@/utils/AppConfig';

const Hero = () => {
  const t = useTranslations('Hero');

  return (
    <Section className="py-36">
      <CenteredHero
        banner={{
          href: SocialLinks.twitter,
          text: (
            <>
              <XLogoIcon className="mr-1 size-5" /> {t('follow_twitter')}
            </>
          ),
        }}
        title={t.rich('title', {
          important: (chunks) => (
            <span className="bg-gradient-to-r from-gradient-0 via-gradient-40 to-gradient-60 bg-clip-text text-transparent">
              {chunks}
            </span>
          ),
        })}
        description={t('description')}
        buttons={
          <>
            <Link className={buttonVariants({ size: 'lg' })} href="/sign-up">
              <RocketIcon className="mr-2 size-5" />
              {t('primary_button')}
            </Link>

            <a
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
              href={SocialLinks.github}
            >
              <GitHubLogoIcon className="mr-2 size-5" />
              {t('secondary_button')}
            </a>
          </>
        }
      />
    </Section>
  );
};

export { Hero };
