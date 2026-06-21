import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  Navigate,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Toaster } from "@/components/ui/sonner";
import { OutletCommandCenterPage } from "@/components/business-outlets/OutletCommandCenter";
import { ApiKeysPage } from "@/components/business-settings/ApiKeysPage";
import { PaymentControlsPage } from "@/components/business-settings/PaymentControlsPage";
import { useAuth } from "@/store/auth";

const PUBLIC_ROUTES = ["/login", "/register"];

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mr. Breado Admin" },
      { name: "description", content: "Food delivery admin dashboard." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isAuthenticated } = useAuth();
  const isPublic = PUBLIC_ROUTES.some((p) => pathname.startsWith(p));
  const outletDashboardMatch = pathname.match(/^\/business-outlets\/([^/?#]+)$/);
  const isApiKeysPage = pathname === "/api-keys";
  const isPaymentControlsPage = pathname === "/payment-controls";

  return (
    <QueryClientProvider client={queryClient}>
      {isPublic ? (
        isAuthenticated && pathname.startsWith("/login") ? (
          <Navigate to="/" />
        ) : (
          <Outlet />
        )
      ) : !isAuthenticated ? (
        <Navigate to="/login" />
      ) : (
        <AdminLayout>
          {isApiKeysPage ? (
            <ApiKeysPage />
          ) : isPaymentControlsPage ? (
            <PaymentControlsPage />
          ) : outletDashboardMatch?.[1] ? (
            <OutletCommandCenterPage outletId={decodeURIComponent(outletDashboardMatch[1])} />
          ) : (
            <Outlet />
          )}
        </AdminLayout>
      )}
      <Toaster />
    </QueryClientProvider>
  );
}
