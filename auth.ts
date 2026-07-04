import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter, AdapterUser } from "@auth/core/adapters";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import LINE from "next-auth/providers/line";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

// updateUser shouldn't clobber fields the user already set (matches the pattern used
// across our other Auth.js + Prisma projects).
function protectedAdapter(base: Adapter): Adapter {
  return {
    ...base,
    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      const current = await prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true, email: true, image: true },
      });
      if (current) {
        if (current.name) delete user.name;
        if (current.email) delete user.email;
        if (current.image) delete user.image;
      }
      const { id, ...rest } = user;
      if (Object.keys(rest).length === 0) {
        const existing = await prisma.user.findUnique({ where: { id } });
        return existing as AdapterUser;
      }
      return base.updateUser!(user);
    },
  };
}

const oauthProviders = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  oauthProviders.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  oauthProviders.push(
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  );
}

if (process.env.LINE_CLIENT_ID && process.env.LINE_CLIENT_SECRET) {
  oauthProviders.push(
    LINE({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
      authorization: { params: { scope: "profile openid email" } },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email ?? null,
          image: profile.picture,
        };
      },
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: protectedAdapter(PrismaAdapter(prisma)),
  providers: [
    ...oauthProviders,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        if (!user.isActive) return null;

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  // The Credentials provider only works with JWT sessions in Auth.js (database sessions
  // require the adapter to own the sign-in step, which Credentials bypasses) — so this
  // whole app uses JWT sessions, including for the OAuth providers above.
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, profile }) {
      if (profile?.email && user.id && !user.email) {
        try {
          await prisma.user.update({ where: { id: user.id }, data: { email: profile.email as string } });
        } catch {
          // email already used by another account — ignore, sign-in still proceeds
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      const userId = (token.id as string) ?? user?.id;

      // Re-read role/profile from the DB on every call (not just at sign-in or on an
      // explicit client update()) — Auth.js invokes jwt() on every session check under
      // the JWT strategy, so this is just one indexed lookup per request. Without this,
      // hasProfile stayed frozen at "false" from the moment of first OAuth sign-in, and
      // completing onboarding (which relied on useSession().update() firing and landing
      // before the next navigation) could race and leave the JWT stale — bouncing the
      // user from /dashboard back to /onboarding in a loop even after they'd finished it.
      if (userId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            role: true,
            isActive: true,
            student: { select: { id: true } },
            teacher: { select: { id: true } },
            parent: { select: { id: true } },
          },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.isActive = dbUser.isActive;
          token.hasProfile = !!(dbUser.student || dbUser.teacher || dbUser.parent);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as (typeof session.user)["role"];
        session.user.isActive = token.isActive as boolean;
        session.user.hasProfile = token.hasProfile as boolean;
      }
      return session;
    },
  },
});
