import { db } from "@/app/_lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions, User } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,

  // garante que a sessão é controlada via JWT
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isValid) return null;

        // Retorne exatamente como o PrismaAdapter espera
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        } as User;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {


        const dbUser = await db.user.findUnique({
          where: { id: user.id },
        });

        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.isAdmin = dbUser?.isAdmin ?? false;
        token.barbershopId = dbUser?.barbershopId ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      // Constrói a sessão a partir do token JWT
      if (token?.id) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          image: token.picture as string,
          isAdmin: token.isAdmin as boolean,
          barbershopId: token.barbershopId as string | null,
        };


      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
