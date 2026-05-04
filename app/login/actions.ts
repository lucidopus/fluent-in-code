"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/session";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

export type LoginState = { error?: string };

export async function verifyPassword(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const limit = checkRateLimit(`login:${ip}`);
  if (!limit.ok) {
    return { error: `Too many attempts. Try again in ${limit.retryAfterSec}s.` };
  }

  const hash = process.env.APP_PASSWORD_HASH;
  if (!hash) {
    return { error: "Server misconfigured: APP_PASSWORD_HASH is not set." };
  }
  if (!hash.startsWith("$2")) {
    // Common .env gotcha: dotenv-expand ate the $-prefixed segments.
    // Escape with \$ in .env.local — see README.
    return { error: "Server misconfigured: APP_PASSWORD_HASH appears mangled (escape $ as \\$ in .env.local)." };
  }

  const ok = await bcrypt.compare(password, hash);
  if (!ok) {
    return { error: "Wrong password." };
  }

  resetRateLimit(`login:${ip}`);
  const session = await getSession();
  session.authedAt = Date.now();
  await session.save();

  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  redirect(safeNext);
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
