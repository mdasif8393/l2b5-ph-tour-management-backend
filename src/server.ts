/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    // connect to database
    await mongoose.connect(
      // Database string
      "mongodb+srv://admin:admin@cluster0.h5pr3.mongodb.net/l2b5-ph-tour-management?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to DB");

    // express server
    server = app.listen(5000, () => {
      console.log("server is listening to port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

// handle unhandle rejection error
process.on("unhandledRejection", (err) => {
  console.log(
    "Unhandle Rejection is detected... Server is shutting down.",
    err
  );
  if (server) {
    // 1st close express server
    server.close(() => {
      // 2nd close node js server
      process.exit(1);
    });
  }
  // if server not found then close node app
  process.exit(1);
});

// create unhandle exception error
//// Promise.reject(new Error("Forget to handle unhandle rejection error"));

// Uncaught Rejection Error
process.on("uncaughtException", (err) => {
  console.log(
    "Uncaught Exception is detected... Server is shutting down.",
    err
  );
  if (server) {
    // 1st close express server
    server.close(() => {
      // 2nd close node js server
      process.exit(1);
    });
  }
  // if server not found then close node app
  process.exit(1);
});

// create uncaught rejection error
//// console.log(a);

// signal termination error
process.on("SIGTERM", () => {
  console.log("SIGTERM signal is detected... Server is shutting down.");
  if (server) {
    // 1st close express server
    server.close(() => {
      // 2nd close node js server
      process.exit(1);
    });
  }
  // if server not found then close node app
  process.exit(1);
});
