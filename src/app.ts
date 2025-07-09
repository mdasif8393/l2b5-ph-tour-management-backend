import express, { Request, Response } from "express";

const app = express();

// root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message:
      "Welcome to Tour Management System Backend using Express Mongoose Mongo",
  });
});

export default app;
