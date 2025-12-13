// import zod
import { z } from 'zod';

// import schemas auth
import { createUserSchema, updateUserSchema } from '../schemas/user.schema';

// infer types from schemas
export type UserCreateRequest = z.infer<typeof createUserSchema>;
export type UserUpdateRequest = z.infer<typeof updateUserSchema>;