import '@/styles/global.css';

import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';

import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { AllLocales, AppConfig } from '@/utils/AppConfig';
import { getURL } from '@/utils/Helpers';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: AppConfig.name,
  description: AppConfig.description,
  openGraph: {
    title: AppConfig.name,
    description: AppConfig.description,
  },
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export function generateStaticParams() {
  return AllLocales.map((locale) => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(props.params.locale);

  // Using internationalization in Client Components
  const messages = await getMessages();

  return (
    <html lang={props.params.locale} className="scroll-smooth">
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider
            locale={props.params.locale}
            messages={messages}
          >
            <>
              {props.children}
              <Toaster />
            </>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
