import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "user" | "guest";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "admin" | "user" | "guest";
    password_hash?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "admin" | "user" | "guest";
  }
}
