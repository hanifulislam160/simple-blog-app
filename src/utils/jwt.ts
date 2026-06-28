import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
const createToken = (
  payload: JwtPayload,
  secret: string,
  expire: SignOptions,
) => {
  const token = jwt.sign(payload, secret, { expiresIn: expire } as SignOptions);

  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Invalid Token");
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
