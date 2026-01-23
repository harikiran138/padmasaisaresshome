import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
    error?: string;
  }

  interface User {
      role?: string;
      refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    uid: string;
    role: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
