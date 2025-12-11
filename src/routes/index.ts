import { Hono } from "hono";
import { validateBody } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { register } from "../controllers/registerController";
import { login } from "../controllers/loginController";
import { verifyToken } from "../middlewares/auth.middleware";
import {createUser, deleteUser, getUserById, getUsers, updateUser} from "../controllers/userController";
import {createUserSchema, updateUserSchema} from "../schemas/user.schema";

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

//get users route (protected)
router.get("/users", verifyToken, getUsers);

//create user route
router.post("/users", verifyToken, validateBody(createUserSchema), createUser);

//get user by ID route
router.get("/users/:id", verifyToken, getUserById);

//update user by ID route
router.put("/users/:id", verifyToken, validateBody(updateUserSchema), updateUser);

//delete user by ID route
router.delete("/users/:id", verifyToken, deleteUser)

export const Routes = router;
