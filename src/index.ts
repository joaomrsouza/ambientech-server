import express from "express";
import { join } from "path";

import { router } from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(join(__dirname, "../public")));
app.use(express.json());
// TODO: app.use(defineGlobalLocals());
app.set("view engine", "pug");

app.use(router);

console.log("Server: Server is ready");

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server: Server is listening on port ${PORT}`);
});

if (process.env.IS_PRODUCTION === "true") {
  // eslint-disable-next-line no-console
  console.log("Starting Jobs");
  // TODO: startJobs();
}

// Process exit/error handlers

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

const exitSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];

for (const sig of exitSignals) {
  process.on(sig, async () => {
    try {
      // TODO: await stopJobs();
      console.info("App exited with success");
      process.exit(ExitStatus.Success);
    } catch (error) {
      console.error(`App exited with error: ${error}`);
      process.exit(ExitStatus.Failure);
    }
  });
}

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`
  );
  throw reason;
});

process.on("uncaughtException", (error) => {
  console.error(`App exiting due to an uncaught exception: ${error}`);
  process.exit(ExitStatus.Failure);
});
