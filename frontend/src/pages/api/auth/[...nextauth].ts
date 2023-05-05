import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user, profile }) {
      // Aqui é onde eu tenho que adicionar as info vindas do user no signIn no token
      if (account && user) {
        token.oauth_accessToken = account.access_token;

        if (account.type === 'credentials') {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.userId = user.userId;
          token.picture = user.avatar;
          token.isGoogleAccount = user.isGoogleAccount;
          token.isVerified = user.isVerified;
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      //Aqui é onde eu tenho que adicionar o accessToken no objeto session para consumir no front e enviar nas reqs
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.avatar = token.avatar;
      session.user.isVerified = token.isVerified;
      session.user.isGoogleAccount = token.isGoogleAccount;

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
