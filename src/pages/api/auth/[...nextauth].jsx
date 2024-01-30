import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { ssoLogin } from "src/hooks/apis/onboardingApi";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({ account, user }) {
      try {
        const res = await ssoLogin(account);
        const token = res.data.token;
        account.id_token = token;

        user.id_token = token;

        return user;
      } catch (error) {
        console.error("Error in ssoLogin:", error);
        return null;
      }
    },
    async jwt(token, user) {
      function findAccessToken(obj) {
        for (const key in obj) {
          if (key === "id_token") {
            return obj[key];
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            const result = findAccessToken(obj[key]);
            if (result) {
              return result;
            }
          }
        }
        return null;
      }

      const accessToken = findAccessToken(token.token.token);
      if (user) {
        token.user = user;
      }

      if (accessToken) {
        token.accessToken = accessToken;
      }

      if (token?.token?.token?.id_token) {
        token.idToken = token.token.token.id_token;
      }

      return token;
    },
    async session({ session, token }) {
      try {
        if (token?.token?.account?.id_token) {
          session.idToken = token?.token?.account?.id_token;
        }
        if (token?.token?.user?.id_token) {
          session.idToken = token?.token?.user?.id_token;
        }

        if (token?.accessToken) {
          session.accessToken = token.accessToken;
        }
        return session;
      } catch (error) {
        console.error("Error setting token in session:", error);
        return session;
      }
    },
    async onError(error, _context) {
      console.error("Authentication error:", error);
      return Promise.resolve("/api/auth/error");
    },
  },
});
