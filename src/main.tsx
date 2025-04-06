import { Fieldset } from "@/components/shared/composites/fieldset";
import "@/global.css";
import { routeTree } from "@/routeTree.gen";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { lazy } from "react";
import ReactDOM from "react-dom/client";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    Fieldset,
    InputField: lazy(
      () => import("@/components/shared/composites/input-field"),
    ),
    TextareaField: lazy(
      () => import("@/components/shared/composites/textarea-field"),
    ),
    RadioGroupField: lazy(
      () => import("@/components/shared/composites/radiogroup-field"),
    ),
  },
  formComponents: {
    SubmitButton: lazy(
      () => import("@/components/shared/composites/submit-button"),
    ),
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultPendingComponent: () => <div>loading...</div>,
  defaultErrorComponent: ({ error }) => <div>{error.message}</div>,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>,
  );
}
