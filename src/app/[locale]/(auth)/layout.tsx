'use client';

import { enUS, ptBR } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { dark, experimental__simple } from '@clerk/themes';
import { useTheme } from 'next-themes';

import { AppConfig } from '@/utils/AppConfig';

const clerkVariables = {
  colorPrimary: '#C84700',
};

export default function AuthLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? dark : experimental__simple;
  let clerkLocale = enUS;
  let signInUrl = '/sign-in';
  let signUpUrl = '/sign-up';
  let dashboardUrl = '/dashboard';

  const clerkLayout = {
    logoImageUrl: resolvedTheme === 'dark' ? '/logo_dark.svg' : '/logo.svg',
  };

  if (props.params.locale === 'pt-BR') {
    clerkLocale = ptBR;
  }

  if (props.params.locale !== AppConfig.defaultLocale) {
    signInUrl = `/${props.params.locale}${signInUrl}`;
    signUpUrl = `/${props.params.locale}${signUpUrl}`;
    dashboardUrl = `/${props.params.locale}${dashboardUrl}`;
  }

  return (
    <ClerkProvider
      localization={clerkLocale}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={dashboardUrl}
      signUpFallbackRedirectUrl={dashboardUrl}
      appearance={{
        baseTheme: theme,
        variables: clerkVariables,
        layout: clerkLayout,
      }}
    >
      {props.children}
    </ClerkProvider>
  );
}
