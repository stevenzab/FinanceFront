import { betterAuth } from "better-auth";
import { dash } from "@better-auth/infra";

export const auth = betterAuth({
  // Add your existing Better Auth config here
  plugins: [
    dash(),
  ],
});
