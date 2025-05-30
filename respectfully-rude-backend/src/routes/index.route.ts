import { Hono } from "hono";
import { backhandedRouter } from "./backhanded.route.ts";

const mainRouter = new Hono();

mainRouter.route("/backhanded", backhandedRouter);

export { mainRouter };
