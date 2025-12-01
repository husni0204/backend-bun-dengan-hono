import { Hono } from "hono";
import { validateBody } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { register } from "../controllers/registerController";
import { login } from "../controllers/loginController";

// initialize router
const router = new Hono();

//route get home
router.get("/", (c) => {
  return c.text("Welcome to the API");
});

//register route
router.post("/register", validateBody(registerSchema), register);

//login route
router.post("/login", validateBody(loginSchema), login);

export const Routes = router;
