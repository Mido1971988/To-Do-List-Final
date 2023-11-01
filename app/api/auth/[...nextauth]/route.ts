import { TaskObject } from "@/types/TaskObject.types";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Your User Name",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your Password",
        },
      },

      async authorize(credentials) {
        let found = false;
        let user = { id: "", name: "", password: "" };
        const response = await fetch("http://localhost:3500/listOfUsers");
        const users = await response.json();
        users.map(
          (userServer: { id: string; name: string; password: string }) => {
            if (found) return;
            if (
              credentials?.username === userServer.name &&
              credentials?.password === userServer.password
            ) {
              found = true;
              user = userServer;
              return;
            }
          }
        );
        if (found) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
});

export { handler as GET, handler as POST };
