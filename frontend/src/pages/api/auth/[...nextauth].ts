import { verify } from 'jsonwebtoken';
import NextAuth, { AuthOptions, TokenSet } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

async function credentialsTokenHandle(token: JWT) {
  try {
    verify(token.accessToken, process.env.ACCESS_JWT_SECRET as string);
    return token;
  } catch (error) {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token.refreshToken}`,
        },
        method: 'POST',
      });

      const refreshedUser = await response.json();
      if (!response.ok) throw refreshedUser;

      return {
        ...token,
        accessToken: refreshedUser.accessToken,
      };
    } catch (error) {
      //console.error('Error refreshing access token', error);
      return { ...token, error: 'RefreshAccessTokenError' as const };
    }
  }
}

async function googleTokenHandle(token: JWT) {
  const tokenResult = await credentialsTokenHandle(token);
  token.accessToken = tokenResult.accessToken;
  token.error = tokenResult.error;

  if (Date.now() < token.oauth_expires_at * 1000) {
    return token;
  } else {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID as string,
          client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
          grant_type: 'refresh_token',
          refresh_token: token.oauth_refreshToken as string,
        }),
        method: 'POST',
      });

      const tokens: TokenSet = await response.json();
      if (!response.ok) throw tokens;

      return {
        ...token,
        oauth_access_token: tokens.access_token,
        oauth_expires_at: tokens.expires_at
          ? Math.floor(Date.now() / 1000 + tokens.expires_at)
          : token.oauth_expires_at,
        oauth_refresh_token: tokens.refresh_token ?? token.refresh_token,
      };
    } catch (error) {
      //console.error('Error refreshing access token', error);
      return { ...token, error: 'RefreshAccessTokenError' as const };
    }
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });

        const user = await res.json();
        if (res.ok && user) return user;

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === 'google' && !profile?.email_verified)
        return false;

      if (account?.provider === 'google' && profile) {
        //Call google api login in my backend send info for register and generate access and refresh tokens
        const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`;
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            avatar: profile.image,
            idToken: account.id_token,
            name: profile.name,
            email: profile.email,
            email_verified: profile.email_verified,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        const userData = await res.json();
        user.accessToken = userData.accessToken;
        user.refreshToken = userData.refreshToken;
        user.userId = userData.userId;
        user.isVerified = userData.isVerified;
        user.isGoogleAccount = userData.isGoogleAccount;
        return true;
      }

      return true;
    },
    async jwt({ token, account, user, profile }) {
      if (account) {
        token.oauth_accessToken = account.access_token;
        token.oauth_refreshToken = account.refresh_token;
        token.authType = account.type;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userId = user.userId;
        token.picture = user.avatar;
        token.avatar = user.avatar;
        token.isGoogleAccount = user.isGoogleAccount;
        token.isVerified = user.isVerified;

        return token;
      } else if (token.authType === 'credentials') {
        //Handle refresh access tokens if credentials auth type
        return credentialsTokenHandle(token);
      } else {
        //Handle refresh access tokens if oauth(google) auth type
        return googleTokenHandle(token);
      }
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.oauth_accessToken = token.oauth_accessToken;
      session.user.oauth_refreshToken = token.oauth_refreshToken;
      session.user.avatar = token.avatar;
      session.user.isVerified = token.isVerified;
      session.user.isGoogleAccount = token.isGoogleAccount;
      session.error = token.error;
      session.authType = token.authType;

      return session;
    },
  },
  events: {
    async signOut({ session, token }) {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`;
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.refreshToken}`,
        },
      });
    },
  },
};

export default NextAuth(authOptions);
