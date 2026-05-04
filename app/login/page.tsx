import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-1 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              fluent-in-code
            </p>
            <h1 className="font-serif-italic text-3xl font-light">
              <span>locked</span> <span className="text-primary">in.</span>
            </h1>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
