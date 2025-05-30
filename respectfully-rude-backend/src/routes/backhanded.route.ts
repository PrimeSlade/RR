import { Hono } from "hono";
import { createList } from "../controllers/backhanded/create.backhanded.ts";

const backhandedRouter = new Hono();

backhandedRouter.post("/create", createList);

export { backhandedRouter };
