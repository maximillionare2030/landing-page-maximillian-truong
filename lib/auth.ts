import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import type { User, Account, Profile } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: Account | null;
      profile?: Profile;
    }) {
      if (account?.provider === "github") {
        const githubProfile = profile as { login?: string } | undefined;
        if (githubProfile?.login) {
          const adminLogins =
            process.env.ADMIN_GITHUB_LOGINS?.split(",").map((login: string) => login.trim()) || [];

          if (adminLogins.length === 0) {
            // If no admin logins configured, allow all GitHub users
            return true;
          }

          // Check if user's GitHub username is in the allowlist
          return adminLogins.includes(githubProfile.login);
        }
      }
      return false;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

