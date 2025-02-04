import express from "express";
import { join } from "path";

import { router } from "./routes";
import { databaseConnect, prisma } from "./database";

const app = express();
const PORT = process.env.PORT || 3000;

// databaseConnect(app);

app.use(express.static(join(__dirname, "../public")));
app.use(express.json());
// TODO: app.use(defineGlobalLocals());
app.set("view engine", "pug");

app.use(router);

app.on("ready", () => {
  try {
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

    const exitSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];

    for (const sig of exitSignals) {
      process.on(sig, async () => {
        try {
          // await stopJobs();
          await prisma.$disconnect();
          console.info("App exited with success");
          process.exit(ExitStatus.Success);
        } catch (error) {
          console.error(`App exited with error: ${error}`);
          process.exit(ExitStatus.Failure);
        }
      });
    }
  } catch (error) {
    console.error(`App exited with error: ${error}`);
    process.exit(ExitStatus.Failure);
  }
});

enum ExitStatus {
  Failure = 1,
  Success = 0,
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
app.emit("ready");
