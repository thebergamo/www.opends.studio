import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/button';
import { MessageState } from '@/features/dashboard/MessageState';
import { TitleBar } from '@/features/dashboard/TitleBar';

const DashboardIndexPage = () => {
  const t = useTranslations('DashboardIndex');

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <MessageState
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M0 0h24v24H0z" stroke="none" />
            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3M12 12l8-4.5M12 12v9M12 12L4 7.5" />
          </svg>
        }
        title={t('message_state_title')}
        description={t.rich('message_state_description', {
          code: (chunks) => (
            <code className="bg-secondary text-secondary-foreground">
              {chunks}
            </code>
          ),
        })}
        button={
          <a
            className={buttonVariants({ size: 'lg' })}
            href="https://nextjs-boilerplate.com/pro-saas-starter-kit"
          >
            {t('message_state_button')}
          </a>
        }
      />
    </>
  );
};

export default DashboardIndexPage;
