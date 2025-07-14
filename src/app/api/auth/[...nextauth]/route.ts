
import NextAuth from 'next-auth';
import { authConfig, credentialsProvider } from '@/auth';

const { handlers } = NextAuth({
  ...authConfig,
  providers: [credentialsProvider],
});

export const { GET, POST } = handlers;
