import type { Context } from "hono";
import prisma from "../../prisma/client";
import type { LoginRequest } from "../types/auth";
import { sign } from "hono/jwt";

const login = async (c: Context) => {
  try {
    // ekstrak data yang sudah tervalidasi
    const { username, password } = c.get("validatedBody") as LoginRequest;

    // find user according username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // if user not found
    if (!user) {
      return c.json(
        {
          success: false,
          message: "User tidak ditemukan",
        },
        401
      );
    }

    // check password
    const isPasswordValid = user.password
      ? await Bun.password.verify(password, user.password)
      : false;

    // if wrong password
    if (!isPasswordValid) {
      return c.json(
        {
          success: false,
          message: "Password salah",
        },
        401
      );
    }

    // payload JWT dan sign token
    const payload = {
      sub: user.id,
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    //get secret key from env
    const secret = process.env.JWT_SECRET || "default";

    // sign token
    const token = await sign(payload, secret);

    // login success, return data to user (without password)
    const { password: _, ...useData } = user;

    // return response success 200
    return c.json(
      {
        success: true,
        message: "Login berhasil",
        data: {
          user: useData,
          token: token,
        },
      },
      200
    );
  } catch (error) {
    // return internal server error
    return c.json({ success: false, message: "Internal Server Error" }, 500);
  }
};

export { login };
