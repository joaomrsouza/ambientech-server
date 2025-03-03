import { Router } from "express";

import { root } from "./root";
import { notFound } from "./not-found";
import { notify } from "./notify";
import { unsubscribe } from "./unsubscribe";
import { query } from "./api/query";
import { register } from "./api/register";
import { health } from "./health";

export const router = Router();

router.route("/").get(root);

router.route("/health").get(health);

router.route("/notify").get(notify.get).post(notify.post);

router.route("/unsubscribe").post(unsubscribe.post);

router.route("/unsubscribe/:email").get(unsubscribe.get);

router.route("/api/query").get(query);

router.route("/api/register").post(register);

router.route("*").get(notFound);
