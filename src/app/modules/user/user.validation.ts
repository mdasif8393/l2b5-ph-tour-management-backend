import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name must be 2 charecters" })
    .max(50, { message: "Name too long" }),
  email: z.string().email(),
  password: z.string().min(5),
  phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Phone number is not match with Bangladesh format",
    })
    .optional(),
  address: z.string().optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name must be 2 charecters" })
    .max(50, { message: "Name too long" })
    .optional(),
  password: z.string().min(5).optional(),
  phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Phone number is not match with Bangladesh format",
    })
    .optional(),
  role: z.enum(Object.keys(Role) as [string]).optional(),
  IsActive: z.enum(Object.keys(IsActive) as [string]).optional(),
  isDeleted: z
    .boolean({ invalid_type_error: "isDeleted must be boolean" })
    .optional(),
  isVerified: z
    .boolean({ invalid_type_error: "isVerified must be boolean" })
    .optional(),
});
