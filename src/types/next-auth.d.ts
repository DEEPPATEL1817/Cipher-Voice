// import 'next-auth'
// import { DefaultSession } from 'next-auth'

// declare module 'next-auth'{
//     interface User{
//         _id?: string,
//         isVerified?: boolean,
//         isAcceptingMessages?: boolean,
//         username?: string
//     }
//     interface Session {
//         user:{
//             _id?: string,
//             isVerified?: boolean,
//             isAcceptingMessages?: boolean,
//             username?: string
//         } & DefaultSession['user']
//     }
// }

// //alternative way to write above code and the below code is for jwt 

// declare module 'next-auth/jwt'{
//     interface JWT {
//         _id?: string,
//         isVerified?: boolean,
//         isAcceptingMessages?: boolean,
//         username?: string
//     }
// }


// src/types/next-auth.d.ts
import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';


declare module 'next-auth' {
  interface User extends DefaultUser {
    _id: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    username: string;
    provider: string;
  }

  interface Session {
    user: User & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id: string;
    email: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    username: string;
    provider?: string
  }
}
