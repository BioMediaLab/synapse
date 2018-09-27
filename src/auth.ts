import * as jwt from "jsonwebtoken";

let secret: string | boolean = false;

const getSecret = async (): Promise<string> => {
  if (!secret) {
    secret = "test123";
  }
  return secret as string;
};

export const createJWT = (userId: string): Promise<string> =>
  new Promise(async (resolve, reject) => {
    const sec = await getSecret();
    jwt.sign({}, sec, {
      algorithm: "HS512",
      expiresIn: "30 days",
      subject: userId,
    }, (err, token: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });

interface IntJWTVailidate {
  isValid: boolean;
  uid?: string;
}

export const validateJWT = (token: string): Promise<IntJWTVailidate> =>
  new Promise(async (resolve) => {
    const sec = await getSecret();
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
