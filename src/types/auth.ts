import { z  } from "zod";
import { registerSchema, loginSchema} from "../schemas/auth.schema";

//infer types from schemas
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;