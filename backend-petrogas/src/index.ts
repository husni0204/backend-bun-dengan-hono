import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json("Forbiden!", 403);
});

export default app;
