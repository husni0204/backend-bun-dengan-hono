import { Hono } from "hono";
import { Routes } from "./routes";
import { cors } from "hono/cors"

const app = new Hono().basePath("/api");

// app.get("/", (c) => {
//   return c.text("Hello Hono!");
// });

// cors as middleware for all end point
app.use("*", cors());

app.route("/", Routes);

export default app;
