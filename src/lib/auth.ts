import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signOut } from 'next-auth/react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authOptions: AuthOptions = {
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
              createdAt: user.data.user.createdAt,
              updatedAt: user.data.user.updatedAt,
              accessToken: user.data.accessToken,
              expiresIn: user.data.expiresIn,
              refreshToken: user.data.refreshToken,
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
  secret: process.env.JWT_SECRET || 'projectBokk',

  callbacks: {
    async jwt({ token, user }: any) {
      console.log('user', user);
      if (user) {
        token = {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expiresIn: user.expiresIn,
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      }
      console.log('data token', token);
      const expirationDate = new Date(token.expiresIn).getTime(); // Konversi ke timestamp
      const currentTime = Date.now(); // Waktu saat ini dalam milidetik

      console.log('token expired', expirationDate);
      console.log('current time', currentTime);

      if (
        (token.expiresIn && currentTime >= expirationDate) ||
        token.accessToken === undefined
      ) {
        console.log('Token expired, attempting to refresh token');

        // Panggil endpoint refresh token
        const response = await fetch(`${apiUrl}/api/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: token.refreshToken }), // Kirim refresh token
        });

        if (response.ok) {
          const data = await response.json();
          console.log('respone data refresh token ', data);
          token.accessToken = data.accessToken; // Perbarui access token
          token.expiresIn = new Date(Date.now() + 3600 * 1000).toISOString(); // Set waktu kedaluwarsa baru (1 jam dari sekarang)
        } else {
          console.log('Failed to refresh token');
          return null; // Kembalikan null jika refresh gagal
        }
      }
      console.log('respone after refres data token ', token);
      return token;
    },

    async session({ session, token }: any) {
      console.log('token blok session ', token);
      session.accessToken = token.accessToken;
      console.log('token.accessToken', token.accessToken);
      try {
        const response = await fetch(apiUrl + '/api/user/profile', {
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
        if (resp.meta.statusCode !== 200) {
          if (typeof window !== 'undefined') {
            session = null;
          }
        } else {
          session.accessToken = token.accessToken;
          session.user = {
            id: token.id,
            email: token.email,
            name: token.name,
            createdAt: token.createdAt,
            updatedAt: token.updatedAt,
          };

          session.user = resp.data;
        }
      } catch (e) {
        return null;
      }

      return session;
    },
  },
};

export default authOptions;
