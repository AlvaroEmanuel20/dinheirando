import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { ProviderType } from 'next-auth/providers';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
      oauth_accessToken?: string;
      oauth_refreshToken?: string;
      isVerified: boolean;
      isGoogleAccount: boolean;
      avatar?: string;
      avatarUrl?: string;
    } & DefaultSession['user'];
    error?: 'RefreshAccessTokenError';
    authType: ProviderType;
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    userId: string;
    avatar?: string;
    avatarUrl?: string;
    isVerified: boolean;
    isGoogleAccount: boolean;
    accessToken: string;
    refreshToken: string;
  }

  interface Profile {
    email_verified: boolean;
    picture: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    userId: string;
    avatar?: string;
    avatarUrl?: string;
    isVerified: boolean;
    isGoogleAccount: boolean;
    accessToken: string;
    refreshToken: string;
    oauth_accessToken?: string;
    oauth_refreshToken?: string;
    authType: ProviderType;
    error?: 'RefreshAccessTokenError';
    oauth_expires_at: number;
  }
}
