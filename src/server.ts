import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin@cluster0.h5pr3.mongodb.net/l2b5-ph-tour-management?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to DB");

    server = app.listen(5000, () => {
      console.log("server is listening to port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
