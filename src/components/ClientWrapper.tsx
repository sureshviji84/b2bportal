'use client';

import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/lib/apollo';
import { AuthProvider } from '@/components/providers/AuthProvider';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProvider>
  );
} 