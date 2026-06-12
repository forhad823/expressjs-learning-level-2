import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import logger from "./middleware/logger";
import CookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(CookieParser());
// -- default middlewares
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// -- custom middlewares
app.use(logger);

/* const corsOptions = {
  origin: "http://localhost:3000/", // 
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}; */
app.use(
  cors({
    origin: "http://localhost:3000/", // for resource sharing   to front-end
  }),
);

// middleware request এর আগে use করতে হবে

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express Server",
    Author: "Next Level",
  });
});

// making api below
app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
