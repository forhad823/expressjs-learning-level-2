import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log("Method-URL-Time:", req.method, req.url, Date.now());
  const log = `\nMethod -> ${req.method}, Time -> ${Date.now()}, URL -> ${req.url}\n`;
  fs.appendFile("logger.txt", log, (err) => {
    // console.log(err); err না থাকলে বার বার null দিতে থাকে ।
  });
  next();
};

export default logger;
