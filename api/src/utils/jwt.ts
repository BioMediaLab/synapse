import * as jwt from "jsonwebtoken";

const getSecret = (): string => {
  return process.env.JWT_GENERATION_SECRET;
};

interface IUser {
  id: string;
}

export const createJWT = (user: IUser): Promise<string> =>
  new Promise(async (resolve, reject) => {
    const sec = getSecret();
    jwt.sign(
      {
        userId: user.id,
      },
      sec,
      {
        algorithm: "HS512",
        expiresIn: "30 days",
        subject: user.id,
      },
      (err, token: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      },
    );
  });

interface IntJWTVailidate {
  isValid: boolean;
  uid?: string;
}

export const validateJWT = (token: string): Promise<IntJWTVailidate> =>
  new Promise(async resolve => {
    const sec = getSecret();
    jwt.verify(token, sec, {}, (err, payload) => {
      if (err) {
        resolve({
          isValid: false,
        });
      } else {
        resolve({
          isValid: true,
          uid: (payload as any).sub,
        });
      }
    });
  });
