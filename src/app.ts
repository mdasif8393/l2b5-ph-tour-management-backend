import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";

import { globalErrorhandler } from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";

const app = express();
app.use(express.json());
app.use(cors());

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
