import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import promisePool from "../../../../../lib/db";

const authOption = {
    providers: [
        CredentialsProvider({
         
          name: 'credentials',
        
          credentials: {},
          async authorize(credentials, req) {


           const {username , password} = credentials;

           try{

            const [rows] = await promisePool.query(
              'SELECT * FROM user WHERE username = ?',
              [username]
          );

          if (rows.length === 0) {
              return null; // User not found
          }

          const user = rows[0];

          // Check if the password matches
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
              return null; // Password does not match
          }

          // Return the user object (excluding the password)
          return { id: user.id, username: user.username };

           }catch(error){
            console.log("Error : ",error);
            
           }


          }
        })
      ],
      session: {
        strategy: "jwt",
      },
      secret: process.env.NEXTAUTH_SECRET,
      pages:{
        signIn: "/login"
      }
}

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
