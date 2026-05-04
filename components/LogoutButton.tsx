"use client";

import { logout } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useTransition } from "react";

export function LogoutButton() {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={pending}
      onClick={() => start(() => logout().then(() => undefined).catch(() => undefined))}
      aria-label="Log out"
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
