import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
      isVerified: boolean;
      isGoogleAccount: boolean;
      avatar?: string;
    } & DefaultSession['user'];
    error?: 'RefreshAccessTokenError';
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    userId: string;
    avatar?: string;
    isVerified: boolean;
    isGoogleAccount: boolean;
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    userId: string;
    avatar?: string;
    isVerified: boolean;
    isGoogleAccount: boolean;
    accessToken: string;
    refreshToken: string;
    oauth_accessToken;
    error?: 'RefreshAccessTokenError';
  }
}
