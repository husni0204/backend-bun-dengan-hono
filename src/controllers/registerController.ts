import type { Context } from "hono";
import prisma from "../../prisma/client";
import type {RegisterRequest} from "../types/auth";

export const register = async (c: Context) => {
    try {
        // ekstrak data yang sudah tervalidasi
        const { name, username, email, password } = c.get("validatedBody") as RegisterRequest;

        // cek duplikat email / username
        const existing = await prisma.users.findFirst({
            where: { OR: [{ email}, { username }]},
            select: { id: true, email: true, username: true },
        })

        // jika duplikat, kembalikan error 409
        if (existing) {
            const conflictField = existing.email === email ? "email" : existing.username === username ? "username" : "email";
            return c.json(
                {
                    success: false,
                    message:
                    conflictField === "email"
                    ? "Email sudah terdafatar"
                        : "username sudah digunakan",
                    errors: { [conflictField]: "telah digunakan"},
                },
                409
            )
        }

        // Hash password
        const hashedPassword = await Bun.password.hash(password);

        //Buat user baru
        const user = await prisma.users.create({
            data: { name, username, email, password: hashedPassword },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        // return respon sukses 201
        return c.json(
            {
                success: true,
                message: "User Berhasil Dibuat",
                data: user,
            },
            201
        )
    } catch (err) {
        //return internal server error
        return c.json({ success: false, message: "Internal server error"}, 500)
    }
}