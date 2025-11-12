import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile?.login) {
        const adminLogins = process.env.ADMIN_GITHUB_LOGINS?.split(",").map(
          (login) => login.trim()
        ) || [];

        if (adminLogins.length === 0) {
          // If no admin logins configured, allow all GitHub users
          return true;
        }

        // Check if user's GitHub username is in the allowlist
        return adminLogins.includes(profile.login);
      }
      return false;
    },
    async session({ session, token }) {
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
});

export { handler as GET, handler as POST };

