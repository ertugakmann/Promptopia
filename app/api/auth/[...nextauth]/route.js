import nextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

const handler = nextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  async session({ session }) {},

  async signIn({ profile }) {
    try {
      await connectToDB();

      const userExist = await User.findOne({ email: profile.email });

      if (!userExist) {
        await User.create({
          email: profile.email,
          username: profile.name.replace(" ", " ").toLowerCase(),
          image: profile.picture,
        });
      }
      return true;
    } catch (error) {}
  },
});

export { handler as GET, handler as POST };
