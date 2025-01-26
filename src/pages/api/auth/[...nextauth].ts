import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import { signOut } from 'next-auth/react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const options: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        const { email, password } = credentials;

        try {
          const response = await fetch(apiUrl + '/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          });
          const user = await response.json();

          if (response.ok && user.meta.statusCode === 200) {
            // Mengembalikan data pengguna dan token
            return {
              id: user.data.user.id,
              username: user.data.user.username,
              email: user.data.user.email,
              name: user.data.user.name,
              role: user.data.user.role,
              createdAt: user.data.user.createdAt,
              updatedAt: user.data.user.updatedAt,
              accessToken: user.data.accessToken, // Simpan accessToken untuk nanti
            };
          } else {
            // Jika login gagal, kembalikan null
            console.error('Login failed:', user);
            return null;
          }
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'projectabsenniya',

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        // Menambahkan properti pengguna ke token JWT
        token = {
          ...token,
          accessToken: user.accessToken,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      }
      return token;
    },

    async session({ session, token }: any) {
      // Meneruskan data dari token ke session
      session.accessToken = token.accessToken;
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
      };

      // Profil API tambahan untuk user
      try {
        const response = await fetch(apiUrl + '/auth/profile', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: token.id,
          }),
        });

        const resp = await response.json();
        if (resp.message === 'Unauthenticated.') {
          signOut();
          return;
        }

        session.user = resp.data;
      } catch (e) {
        console.error('Error fetching profile:', e);
      }
      return session;
    },
  },
};

export default NextAuth(options);
