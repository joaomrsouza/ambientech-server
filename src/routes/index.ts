import { Router } from "express";

import { root } from "./root";
import { notFound } from "./not-found";
import { notify } from "./notify";
import { unsubscribe } from "./unsubscribe";
import { query } from "./api/query";
import { register } from "./api/register";

export const router = Router();

router.route("/").get(root);

router.route("/notify").get(notify);

router.route("/unsubscribe").get(unsubscribe);

router.route("/api/query").get(query);

router.route("/api/register").post(register);

router.route("*").get(notFound);
