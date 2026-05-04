import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  authedAt?: number;
};

export const SESSION_COOKIE = "fic_session";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "",
  cookieName: SESSION_COOKIE,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  },
};

export async function getSession() {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    throw new Error("SESSION_SECRET must be set and at least 32 characters");
  }
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function isAuthed(): Promise<boolean> {
  const session = await getSession();
  return Boolean(session.authedAt);
}

export async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) {
    throw new Error("Unauthorized");
  }
}
