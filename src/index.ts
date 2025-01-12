import express from "express";
import { join } from "path";

import { router } from "./routes";
import { databaseConnect } from "./database";

const app = express();
const PORT = process.env.PORT || 3000;

databaseConnect(app);

app.use(express.static(join(__dirname, "../public")));
app.use(express.json());
// TODO: app.use(defineGlobalLocals());
app.set("view engine", "pug");

app.use(router);

app.on("ready", () => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server: Server is listening on port ${PORT}`);
  });
  if (process.env.IS_PRODUCTION === "true") {
    // eslint-disable-next-line no-console
    console.log("Starting Jobs");
    // TODO: startJobs();
  }
});
