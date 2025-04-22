import CredentialsProvider from 'next-auth/providers/credentials';
import { createServerSupabase } from '@/utils/supabase/server';
import NextAuth, { NextAuthOptions } from 'next-auth';

interface CustomUser {
  id: string;
  email: string;
  name: string;
}

interface CustomSession {
  user: {
    name: string;
    id: string;
    email: string;
  };
  expires: string;
}


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        name: { label: "Name", type: "text", placeholder: 'Enter your name (if required)' },
        email: { label: "Email", type: "email", placeholder: 'Enter your Email' },
        password: { label: "Password", type: "password", placeholder: 'Enter your password (if required)', },
        mode: { label: "Mode", type: "text", placeholder: 'signin, signup, or resetpassword', }
      },
      async authorize(credentials): Promise<CustomUser | null> {
        try {
          const name = credentials?.name;
          const email = credentials?.email;
          const password = credentials?.password;
          const mode  = credentials?.mode;
          const lowerMode = mode?.toLowerCase();

          if( !email && !password) {
            throw new Error('Email and password are required.');
          }

          const user =
            lowerMode === 'signup'
              ? email && password
                ? await authHandlers.handleSignUp(email, password, name ?? '')
                : null
              : lowerMode === 'signin'
                ? email && password
                  ? await authHandlers.handleSignIn(email, password)
                  : null
                : null;

          if (!user?.id) {
            throw new Error('Signup successful. Please verify your email before signing in.');
}

          return {
            id: user?.id ?? '',
            email: user?.email ?? email ?? '',
            name: user?.email ?? email ?? '',
          }
        } catch (error) {
          console.error('Error in authorize:', {
            error,
            name: credentials?.name,
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.lastUpdated = new Date().toISOString();
      }
      return token;
    },
    async session({ session, token }): Promise<CustomSession> {
      return {
        ...session,
        user : {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
        },
        expires: token.exp as string,
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  events: {
    async signIn({ user}) {
      console.log('User signed in:', {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });
    },

    async signOut({ token }) {
      const supabase = createServerSupabase();
      if(token?.userId) {
        await supabase.auth.signOut()
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const authHandlers = {
  async handleSignUp( email: string, password: string, name: string) {
    const supabase = createServerSupabase();
    const { data, error } = await supabase.auth.signUp ({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXTAUTH_URL}/auth/signin`,
        data:{
          name: name ?? '',
        }
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

    await supabase.from('profiles').insert({
      id: data.user.id,
      name,
      email,
    });

    return data.user;
  },

  async handleSignIn(email: string, password: string) {
    const supabase = createServerSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No user found');
    return data.user;
  },


}
const handleAuth = async (req: Request, res: Response) => {
  try {
    return await NextAuth(authOptions) (req, res);
  } catch (error) {
    console.error('Error in auth handler:', error);
    throw error
  }
}