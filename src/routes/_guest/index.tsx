import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoginSchema } from "@/lib/schemas";
import { useAppForm } from "@/main";
import { useAuthStore } from "@/modules/authentication/stores";
import { Icon } from "@iconify/react";
import { createFileRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_guest/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/" });

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    } as z.input<typeof LoginSchema>,
    validators: {
      onSubmit: LoginSchema,
    },
    onSubmit: async ({ value }) => {
      await useAuthStore.getState().login(value);

      navigate({
        to: "/dashboard",
        replace: true,
      });
    },
  });

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
      <form
        className="grid gap-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppField name="email">
          {(field) => (
            <field.InputField
              label="Email"
              type="email"
              placeholder="johndoe@gmail.com"
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.InputField
              label="Password"
              type="password"
              placeholder="********"
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton>Login</form.SubmitButton>
        </form.AppForm>
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
