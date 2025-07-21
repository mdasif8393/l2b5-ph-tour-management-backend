/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    // connect to database
    await mongoose.connect(
      // Database string
      envVars.DB_URL
    );
    console.log("Connected to DB");

    // express server
    server = app.listen(envVars.PORT, () => {
      console.log(`server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

// 1st start server after that create super admin
(async () => {
  await startServer();
  await seedSuperAdmin();
})();

// handle unhandle rejection error occur from Promise
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

// uncaught exception for undeclare variable used
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
