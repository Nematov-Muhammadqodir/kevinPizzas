// import {
//   KeyObject,
//   PrivateKeyInput,
//   JsonWebKeyInput,
//   PublicKeyInput,
// } from "crypto";
// import { AUTH_TIMER } from "../libs/config";
// import Errors, { HttpCode, Message } from "../libs/Errors";
// import { Member } from "../libs/types/member";
// import jwt from "jsonwebtoken";

// class AuthService {
//   private readonly secretToken;

//   constructor() {
//     this.secretToken = process.env.SECRET_TOKEN as string;
//   }

//   public async createToken(payload: Member): Promise<string> {
//     console.log("payload", payload);
//     console.log("secretToken", this.secretToken);
//     console.log("secretToken", typeof this.secretToken);
//     return new Promise((resolve, reject) => {
//       const duration = `${AUTH_TIMER}h`;
//       jwt.sign(
//         payload,
//         process.env.SECRET_TOKEN as string,
//         { expiresIn: duration },
//         (err, token) => {
//           if (err)
//             reject(
//               new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CRAETION_FAILED)
//             );
//           else {
//             resolve(token as string);
//           }
//         }
//       );
//     });
//   }

//   public async checkAuth(token: string): Promise<Member> {
//     const result: Member = (await jwt.verify(
//       token,
//       this.secretToken
//     )) as Member;

//     return result;
//   }
// }

// export default AuthService;

import Errors, { Message } from "../libs/Errors";
import { AUTH_TIMER } from "../libs/config";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";
import { HttpCode } from "../libs/Errors";

class AuthService {
  private readonly secretToken;
  constructor() {
    this.secretToken = process.env.SECRET_TOKEN as string;
  }

  public async createToken(payload: Member): Promise<string> {
    console.log("payload", payload);
    console.log("secretToken", this.secretToken);
    console.log("secretToken", typeof this.secretToken);
    return new Promise((resolve, reject) => {
      const duration = `${AUTH_TIMER}h`;
      jwt.sign(
        payload,
        process.env.SECRET_TOKEN as string,
        {
          expiresIn: duration,
        },
        (err, token) => {
          if (err)
            reject(
              new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CRAETION_FAILED)
            );
          else {
            resolve(token as string);
          }
        }
      );
    });
  }

  public async checkAuth(token: string): Promise<Member> {
    const result: Member = (await jwt.verify(
      token,
      this.secretToken
    )) as Member;

    console.log("memberNick", result.memberNick);
    return result;
  }
}

export default AuthService;
