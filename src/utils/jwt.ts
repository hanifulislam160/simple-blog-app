import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
const createToken = (
  payload: JwtPayload,
  secret: string,
  expire: SignOptions,
) => {
  const token = jwt.sign(payload, secret, { expiresIn: expire } as SignOptions);

  return token;
};

export const jwtUtils = {
  createToken,
};
