import { ApiResponse } from "./common.schema";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const UpdateProfilePayload = z.object({
  first_name: z.string().openapi({ example: "Mikasa" }),
  last_name: z.string().openapi({ example: "Ackerman" }),
});

const ProfileSchema = z.object({
  email: z.string().openapi({ example: "skyes@email.com" }),
  first_name: z.string().openapi({ example: "skyes" }),
  last_name: z.string().openapi({ example: "crawford" }),
  profile_image: z
    .string()
    .openapi({ example: "http://localhost:3000/Skyes.jpg" }),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const ProfileResponseSchema = ApiResponse(ProfileSchema);
export const UpdateProfileImageResponseSchema = ApiResponse(ProfileSchema, {
  message: "Update profile image berhasil",
});

export const UpdateProfileResponseSchema = ApiResponse(ProfileSchema, {
  message: "Update profile berhasil",
});
