import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";

import { globalErrorhandler } from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// passport auth
app.use(
  expressSession({
    secret: "Your secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/v1", router);

// root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message:
      "Welcome to Tour Management System Backend using Express Mongoose Mongo",
  });
});

// global error handler
app.use(globalErrorhandler);

// not found route
app.use(notFound);

export default app;
