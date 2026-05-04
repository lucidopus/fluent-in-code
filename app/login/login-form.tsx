"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyPassword, type LoginState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: LoginState = {};

export function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const [state, action, pending] = useActionState(verifyPassword, initial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div className="space-y-2">
        <Label htmlFor="password" className="text-xs uppercase tracking-wider">
          password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          autoComplete="current-password"
          disabled={pending}
        />
      </div>
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Verifying…" : "Enter"}
      </Button>
    </form>
  );
}
