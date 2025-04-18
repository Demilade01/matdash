
import { createClient } from '@/utils/supabase/client';
import { times } from 'lodash';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

interface CustomUser {
  id: string;
  email: string;
  name: string;
}

interface CustomSession {
  user: {
    id: string;
    email: string;
  };
  expires: string;
}

const supabase = createClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email", placeholder: 'Enter your Email' },
        password: { label: "Password", type: "password", placeholder: 'Enter your password (if required)', },
        mode: { label: "Mode", type: "text", placeholder: 'signin, signup, or resetpassword', }
      },
      async authorize(credentials): Promise<CustomUser | null> {
        try {
          const { email, password, mode } = credentials ?? {};
          const lowerMode = mode?.toLowerCase();

          if(!email && !password) {
            throw new Error('Email and password are required.');
          }

          const user =
            lowerMode === 'signup'
              ? email && password ? await authHandlers.handleSignUp(email, password) : null
              : lowerMode === 'signin'
              ? email && password ? await authHandlers.handleSignIn(email, password) : null
              : null;

          return {
            id: user?.id ?? '',
            email: user?.email ?? email ?? '',
            name: user?.email ?? email ?? '',
          }
        } catch (error) {
          console.error('Error in authorize:', {
            error,
            email: credentials?.email,
            mode: credentials?.mode,
            timestamp: new Date().toISOString(),
          });
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET
};

const authHandlers = {
  async handleSignUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp ({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXTAUTH_URL}`,
      },
    });

    if(error) {
      console.error("Error signing up:", error);
      throw new Error(error.message);
    }
    if (!data.user?.id) {
      throw new Error(
        'Signup successful. Please check your email for confirmation.'
      );
    }

    return data.user;
  },

  async handleSignIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };