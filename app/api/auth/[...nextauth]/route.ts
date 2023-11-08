import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { promises as fs } from "fs";

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

      async authorize(credentials, req) {
        try {
          if (!credentials || !credentials.username || !credentials.password)
            return null;
          // const response = await fetch("http://localhost:3500/listOfUsers");
          const file = await fs.readFile(
            process.cwd() + "/myData/listOfUsers.json",
            "utf8"
          );
          const userList = JSON.parse(file);
          let user = userList.filter(
            (oneUser: { id: string; name: string; password: string }) => {
              if (
                credentials?.username === oneUser.name &&
                credentials?.password === oneUser.password
              ) {
                return true;
              }
            }
          )[0];
          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (e) {
          console.log("Failed to Fetch Users from server");
        }
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
    signOut: "/signOut",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
