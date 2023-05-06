import { verify } from 'jsonwebtoken';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

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
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user, profile }) {
      // Aqui é onde eu tenho que adicionar as info vindas do user no signIn no token
      console.log(profile);
      console.log(account);
      if (account) {
        token.oauth_accessToken = account.access_token;

        if (account.type === 'credentials' && user) {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.userId = user.userId;
          token.picture = user.avatar;
          token.isGoogleAccount = user.isGoogleAccount;
          token.isVerified = user.isVerified;
        }

        return token;
      } else {
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
    },
    async session({ session, token }) {
      //Aqui é onde eu tenho que adicionar o accessToken no objeto session para consumir no front e enviar nas reqs
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.avatar = token.avatar;
      session.user.isVerified = token.isVerified;
      session.user.isGoogleAccount = token.isGoogleAccount;
      session.error = token.error;

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
