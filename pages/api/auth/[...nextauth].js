import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { compare } from "bcryptjs";
import dbConnect from "../../../lib/dbconnect";
import User from "../../../models/user";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../..//lib/mdbclient";
import { getToken } from "next-auth/jwt"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GCLIENTID,
      clientSecret: process.env.GCLIENTSCECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({

      async authorize(credentials) {
        
        await dbConnect();

        // console.log(credentials);

        const temp = await User.findOne({
          email: credentials.email,
        });
  

        if (!temp) {
          throw new Error("No user found with the email");
        }

        const checkPassword = await compare(
          credentials.password,
          temp.hash_password
        );

        if (!checkPassword) {
          throw new Error("Password doesnt match");
        }

        const user = {
          id: temp._id,
          email: temp.email,
          name: temp.name,
          image: temp.image,
        };


        return user;
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
