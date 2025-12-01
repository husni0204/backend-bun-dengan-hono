import type { Context } from "hono";
import prisma from "../../prisma/client";
import {UserCreateRequest} from "../types/user";

/**
 * @param c
 * @returns
 * get all users
 */

const getUsers = async (c: Context) => {
    try {
        // get all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { id: "desc" }
        })

        // return json
        return c.json({
            success: true,
            message: "List Data Users",
            data: users,
        }, 200)

    } catch (e: unknown) {
        console.error(`Error getting users: ${e}`)
        // optional return 500 for consistent
        return c.json({ success: false, message: "Internal Server Error" }, 500)
    }
}

/**
 * @param c
 * @returns
 * create a new user
 */

const createUser = async (c: Context) => {
    try {
        // ekstrak data yang sudah tervalidasi
        const { name, username, email, password } = c.get(
            "validatedBody"
        ) as UserCreateRequest;

        // cek duplikat email / username
        const existing = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] },
            select: { id: true, email: true, username: true },
        });

        // jika duplikat, kembalikan error 409
        if (existing) {
            const conflictField =
                existing.email === email
                    ? "email"
                    : existing.username === username
                        ? "username"
                        : "email";
            return c.json(
                {
                    success: false,
                    message:
                        conflictField === "email"
                            ? "Email sudah terdafatar"
                            : "username sudah digunakan",
                    errors: { [conflictField]: "telah digunakan" },
                },
                409
            );
        }

        // Hash password
        const hashedPassword = await Bun.password.hash(password);

        //Buat user baru
        const user = await prisma.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // return respon sukses 201
        return c.json(
            {
                success: true,
                message: "User Berhasil Dibuat",
                data: user,
            },
            201
        );
    } catch (e: unknown) {
        console.error(`Error creating user: ${e}`)
        //return internal server error
        return c.json({ success: false, message: "Internal server error" }, 500);
    }
}

/**
 * @param c
 * @returns
 * Get user by Id
 */

const getUserById = async (c: Context) => {
    try {
        // get userId from param
        const userId = c.req.param("id")

        // get user by ID
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        //if user not found
        if (!user) {
            return c.json({
                success: false,
                message: "User Tidak Ditemukan!",
            }, 404)
        }

        // return json
        return c.json({
            success: true,
            message: "Detail Data User",
            data: user,
        }, 200)

    } catch (e: unknown) {
        console.error(`Error getting users: ${e}`)
        // optional return 500 for consistent
        return c.json({ success: false, message: "Internal Server Error" }, 500)
    }
}

export { getUsers, createUser, getUserById };