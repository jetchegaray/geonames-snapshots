import { NextFunction } from 'express';

export const loggerMiddeware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //console.log(`Request ${req.json}`);
  next();
};
