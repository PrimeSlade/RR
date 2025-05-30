import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { mainRouter } from "./routes/index.route.ts";
import dotenv from "dotenv";
dotenv.config();

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("", mainRouter);

serve(
  {
    fetch: app.fetch,
    // @ts-ignore
    port: process.env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
