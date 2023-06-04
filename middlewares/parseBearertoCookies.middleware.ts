import { Request, Response, NextFunction } from "express";
export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    if (!cookies.token) {
      const token = req.headers["authorization"]?.split(" ")[1];
      req.cookies.token = token;
    }
    next();
  };
};
