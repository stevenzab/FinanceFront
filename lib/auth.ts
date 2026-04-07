import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { dash } from "@better-auth/infra";

const appUrl =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const auth = betterAuth({
  baseURL: appUrl,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    nextCookies(),
    dash({
      apiKey: process.env.BETTER_AUTH_API_KEY,
    }),
  ],
});
