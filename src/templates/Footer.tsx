import {
  EnvelopeOpenIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { RssLogoIcon } from '@/components/icons/RssLogoIcon';
import { XLogoIcon } from '@/components/icons/XLogoIcon';
import { YouTubeLogoIcon } from '@/components/icons/YouTubeLogoIcon';
import { CenteredFooter } from '@/features/landing/CenteredFooter';
import { Section } from '@/features/landing/Section';
import { AppConfig, SocialLinks } from '@/utils/AppConfig';

import { Logo } from './Logo';

const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <Section className="pb-16 pt-0">
      <CenteredFooter
        logo={<Logo />}
        name={AppConfig.name}
        iconList={
          <>
            <li>
              <a href={SocialLinks.github}>
                <p className="sr-only">Open Design System GitHub link</p>
                <GitHubLogoIcon />
              </a>
            </li>

            <li>
              <a href={SocialLinks.twitter}>
                <p className="sr-only">OpenDS Studio X.com profile link</p>
                <XLogoIcon />
              </a>
            </li>

            <li>
              <a href={SocialLinks.youtube}>
                <p className="sr-only">OpenDS Studio YouTube channel link</p>
                <YouTubeLogoIcon />
              </a>
            </li>

            <li>
              <a href={SocialLinks.linkedin}>
                <p className="sr-only">OpenDS Studio LinkedIn profile link</p>
                <LinkedInLogoIcon />
              </a>
            </li>

            <li>
              <a href={SocialLinks.contact}>
                <p className="sr-only">OpenDS Studio email to contact link</p>
                <EnvelopeOpenIcon />
              </a>
            </li>

            <li>
              <Link href="/rss">
                <p className="sr-only">OpenDS Studio RSS/Atom link</p>
                <RssLogoIcon />
              </Link>
            </li>
          </>
        }
        legalLinks={
          <>
            <li>
              <Link href="/terms">{t('terms_of_service')}</Link>
            </li>
            <li>
              <Link href="/privacy">{t('privacy_policy')}</Link>
            </li>
          </>
        }
      >
        <li>
          <Link href="#product">{t('product')}</Link>
        </li>

        <li>
          <Link href="#price">{t('prices')}</Link>
        </li>

        <li>
          <Link href="/blog">{t('blog')}</Link>
        </li>
      </CenteredFooter>
    </Section>
  );
};

export { Footer };
