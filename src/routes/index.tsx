import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authStore } from "@/modules/authentication/stores";
import { supabase } from "@/supabase";
import { Icon } from "@iconify/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/")({
  component: LoginTemplate,
  beforeLoad: async () => {
    await authStore.getState().fetchUser();

    const user = authStore.getState().user;
    if (user) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

function LoginTemplate() {
  const email = React.useId();
  const password = React.useId();

  const navigate = useNavigate({ from: "/" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get("email")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
    });

    if (error) throw new Error(error.message);

    navigate({
      to: "/buckets",
      replace: true,
    });
  }

  return (
    <main className="grid min-h-svh place-content-center gap-y-6 *:max-w-sm">
      <section className="grid gap-y-1 text-center">
        <h1 className="text-xl leading-none font-bold">
          Welcome to <pre className="inline">buckit</pre>
        </h1>
        <p className="text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium underline">
            Sign Up
          </Link>
        </p>
      </section>
      <form className="grid gap-y-3" onSubmit={handleSubmit}>
        <fieldset className="grid gap-y-1.5">
          <Label htmlFor={email}>Email</Label>
          <Input
            type="email"
            name="email"
            id={email}
            placeholder="johndoe@gmail.com"
          />
        </fieldset>
        <fieldset className="grid gap-y-1.5">
          <Label htmlFor={password}>Password</Label>
          <Input
            type="password"
            name="password"
            id={password}
            placeholder="********"
          />
        </fieldset>
        <Button type="submit" className="mt-3">
          Login
        </Button>
      </form>
      <Separator />
      <section className="flex justify-between">
        <Button variant="outline">
          <Icon icon="bxl:apple" />
          Continue with Apple
        </Button>
        <Button variant="outline">
          <Icon icon="bxl:google" />
          Continue with Google
        </Button>
      </section>
      <p className="text-muted-foreground text-center text-xs text-balance [&>a]:underline">
        By clicking continue, you agree to our{" "}
        <Link to=".">Terms of Service</Link> and{" "}
        <Link to=".">Privacy Policy</Link>
      </p>
    </main>
  );
}
