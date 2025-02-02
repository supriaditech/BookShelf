import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verify } from 'jsonwebtoken';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'projectBOOKshelf543345'; // Ganti dengan secret yang aman
console.log('JWT_SECRET===================', JWT_SECRET);
export const authOptions: NextAuthOptions = {
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
              exp: user.expiresIn,
            };
          } else {
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

  secret: JWT_SECRET,

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
          exp: user.expiresIn,
        };
      }
      console.log('data token', token);

      // Check if token is expired
      const expirationDate = new Date(token.expiresIn).getTime();
      const currentTime = Date.now();

      if (currentTime >= expirationDate || !token.accessToken) {
        console.log('Token expired, attempting to refresh token');

        const response = await fetch(`${apiUrl}/api/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('response data refresh token ', data);
          token.accessToken = data.accessToken;
          token.expiresIn = new Date(Date.now() + 86400 * 1000).toISOString();
        } else {
          console.log('Failed to refresh token');
          return null;
        }
      }
      console.log('token after refresh', token);
      return token;
    },

    async session({ session, token }: any) {
      console.log('token blok session ', token);
      session.accessToken = token.accessToken;
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
      };

      // Fetch user profile
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
          session = null;
        } else {
          session.user = resp.data;
        }
      } catch (e) {
        console.error('Error fetching profile:', e);
        session = null;
      }

      return session;
    },
  },
};

export default authOptions;
