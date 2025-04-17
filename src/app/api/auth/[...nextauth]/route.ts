
import { createClient } from '@/utils/supabase/client';
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
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mode: { label: "Mode", type: "text" }
      },
      async authorize(credentials) {
        // We'll implement this in Part 2
        return null;
      }
    })
  ],
  // Basic configuration
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
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