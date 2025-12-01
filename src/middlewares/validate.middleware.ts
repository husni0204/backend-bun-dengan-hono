import { z } from "zod";
import type { MiddlewareHandler } from "hono";
import { formatZodErrors } from "../utils/validation";

export function validateBody<T extends z.ZodTypeAny>(
  schema: T
): MiddlewareHandler {
  return async (c, next) => {
    // must json
    const ct = c.req.header("content-type") || "";
    if (!ct.toLowerCase().includes("application/json")) {
      return c.json(
        {
          success: false,
          message: "Unsupported Media Type: use application/json",
        },
        415
      );
    }

    //parse body save
    let raw: unknown;
    try {
      raw = await c.req.json();
    } catch {
      return c.json({ success: false, message: "Invalid JSON Payload" }, 400);
    }

    // valid Zod without throw
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message: "Validation Failed!",
          errors: formatZodErrors(parsed.error),
        },
        422
      );
    }

    //save validation controller
    c.set("validatedBody", parsed.data);
    await next();
  };
}
