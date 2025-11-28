import { Hono } from "hono";
import { validateBody} from "../middlewares/validate.middleware";
import { registerSchema } from "../schemas/auth.schema";
import { register } from "../controllers/registerController";

// initialize router
const router = new Hono()

//register route
router.post('/register', validateBody(registerSchema), register);

export const Routes = router;