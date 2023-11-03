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
        let user = { id: "", name: "", password: "" };
        const response = await fetch("http://localhost:3500/listOfUsers");
        const users = await response.json();
        user = users.filter(
          (oneUser: { id: string; name: string; password: string }) => {
            if (
              credentials?.username === oneUser.name &&
              credentials?.password === oneUser.password
            ) {
              return true;
            }
          }
        )[0];
        if (user.name !== "") {
          return user;
        } else {
          return null;
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
