import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Store,
  UserCog,
  Bike,
  Utensils,
  ChefHat,
  Soup,
  Layers,
  Shield,
  KeyRound,
  Tag,
  Gift,
  LifeBuoy,
  Ticket,
  CreditCard,
  MapPin,
  Wallet,
  Image as ImageIcon,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  ChevronDown,
  ChevronRight,
  Globe,
  Activity,
  Building2,
  MessageSquare,
  UserCircle,
  ShieldCheck,
  Palette,
  Sparkles,
  BadgeIndianRupee,
  TicketCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authStore } from "@/store/auth";
import { ADMIN_LOGO_URL } from "@/api/endpoints";
import { authService } from "@/services/auth.service";
import { useQueryClient } from "@tanstack/react-query";

type Item = {
  label: string;
  to?: string;
  icon?: any;
  children?: { label: string; to: string }[];
};

const NAV: { section?: string; items: Item[] }[] = [
  { items: [{ label: "Dashboard", to: "/", icon: LayoutDashboard }] },
  {
    items: [
      {
        label: "Orders",
        icon: ShoppingBag,
        children: [
          { label: "All Orders", to: "/orders" },
          { label: "Active Orders", to: "/orders/active" },
          { label: "Pending", to: "/orders/pending" },
          { label: "Accepted", to: "/orders/accepted" },
          { label: "Preparing", to: "/orders/preparing" },
          { label: "Ready for Pickup", to: "/orders/ready-for-pickup" },
          { label: "Delivered", to: "/orders/delivered" },
          { label: "Cancelled", to: "/orders/cancelled" },
        ],
      },
    ],
  },
  { items: [{ label: "Customers", to: "/customers", icon: Users }] },
  {
    section: "MR BREADO BUSINESS",
    items: [
      { label: "Business Outlets", to: "/business-outlets", icon: Building2 },
      { label: "Outlet Managers", to: "/owners", icon: UserCog },
    ],
  },
  {
    section: "DELIVERY MANAGEMENT",
    items: [{ label: "Delivery Boys", to: "/delivery-boys", icon: Bike }],
  },
  {
    section: "MENU MANAGEMENT",
    items: [
      { label: "Foods", to: "/foods", icon: Utensils },
      { label: "Mr. Breado Store", to: "/admin-foods", icon: ChefHat },
      { label: "Cuisine", to: "/cuisine", icon: Soup },
      { label: "Categories", to: "/categories", icon: Layers },
      { label: "Brands", to: "/brands", icon: Palette },
    ],
  },
  {
    section: "ROLE MANAGEMENT",
    items: [
      { label: "Roles", to: "/roles", icon: Shield },
      { label: "Permissions", to: "/permissions", icon: KeyRound },
    ],
  },
  {
    section: "OFFER MANAGEMENT",
    items: [
      { label: "Coupons", to: "/coupons", icon: Tag },
      { label: "Coupon Usage", to: "/coupon-usage", icon: TicketCheck },
      { label: "Banners", to: "/banners", icon: ImageIcon },
      { label: "Offers", to: "/offers", icon: Gift },
    ],
  },
  {
    section: "SUPPORT MANAGEMENT",
    items: [
      { label: "Support Dashboard", to: "/support", icon: LifeBuoy },
      { label: "Support Tickets", to: "/tickets", icon: Ticket },
      { label: "Notifications", to: "/notifications", icon: Bell },
    ],
  },
  {
    section: "ZONE MANAGEMENT",
    items: [{ label: "Zones", to: "/zones", icon: MapPin }],
  },
  {
    section: "SERVICE MANAGEMENT",
    items: [
      { label: "Operations", to: "/operations", icon: Activity },
      {
        label: "Outlet Business Control",
        to: "/business-outlets",
        icon: Building2,
      },
      {
        label: "Customer Messages",
        to: "/customer-messages",
        icon: MessageSquare,
      },
      { label: "Admin Profile", to: "/admin-profile", icon: UserCircle },
      { label: "Bite Stories", to: "/stories", icon: Sparkles },
      {
        label: "Online Transactions",
        to: "/online-transactions",
        icon: CreditCard,
      },
    ],
  },
  {
    section: "BUSINESS CONFIG",
    items: [
      { label: "API Keys", to: "/api-keys", icon: KeyRound },
      {
        label: "Delivery Pricing",
        to: "/delivery-pricing",
        icon: BadgeIndianRupee,
      },
      { label: "Payment Controls", to: "/payment-controls", icon: CreditCard },
      { label: "Settings", to: "/settings", icon: Settings },
    ],
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to?: string) =>
    !!to && (to === "/" ? pathname === "/" : pathname.startsWith(to));
  const initiallyOpen: Record<string, boolean> = {};
  NAV.forEach((g) =>
    g.items.forEach((it) => {
      if (it.children?.some((c) => isActive(c.to)))
        initiallyOpen[it.label] = true;
    }),
  );
  const [open, setOpen] = useState<Record<string, boolean>>(initiallyOpen);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-[72px] items-center gap-3 border-b border-sidebar-border px-5">
        <img
          src={ADMIN_LOGO_URL}
          alt="Mr. Breado"
          className="h-10 w-10 rounded-xl object-contain"
        />
        <span className="text-lg font-semibold tracking-tight">Mr. Breado</span>
      </div>
      <div className="border-b border-sidebar-border p-3">
        <div className="flex items-center gap-2 rounded-md bg-sidebar-accent px-3 py-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <input
            placeholder="Search here"
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3 text-sm">
        {NAV.map((group, gi) => (
          <div key={gi} className="mb-2">
            {group.section && (
              <div className="px-3 pb-1 pt-3 text-[10px] font-semibold tracking-widest text-muted-foreground">
                {group.section}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const active =
                isActive(item.to) || item.children?.some((c) => isActive(c.to));
              if (item.children) {
                const isOpen = open[item.label] ?? false;
                return (
                  <div key={item.label}>
                    <button
                      onClick={() =>
                        setOpen((o) => ({ ...o, [item.label]: !o[item.label] }))
                      }
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-md px-3 py-2 transition-colors",
                        active
                          ? "bg-primary/15 text-primary shadow-[inset_3px_0_0_var(--primary)]"
                          : "hover:bg-sidebar-accent",
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      <span className="flex-1 text-left">{item.label}</span>
                      {isOpen ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="ml-7 mt-0.5 border-l border-sidebar-border pl-2">
                        {item.children.map((c) => (
                          <Link
                            key={c.to}
                            to={c.to}
                            onClick={onNavigate}
                            className={cn(
                              "block rounded-md px-3 py-1.5 text-[13px] transition-colors",
                              isActive(c.to)
                                ? "bg-primary/10 text-primary"
                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent",
                            )}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.to!}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                    active
                      ? "bg-primary/15 text-primary shadow-[inset_3px_0_0_var(--primary)]"
                      : "hover:bg-sidebar-accent",
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <LogoutButton />
      </div>
    </div>
  );
}

function ThemeSwitcher() {
  const [theme, setTheme] = useState("luxury");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("admin-theme");
      if (stored === "dark" || stored === "light" || stored === "luxury")
        setTheme(stored);
    } catch {
      // Storage can be disabled in private mobile browsers.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.remove(
      "theme-dark",
      "theme-light",
      "theme-luxury",
    );
    document.documentElement.classList.add(`theme-${theme}`);
    try {
      window.localStorage.setItem("admin-theme", theme);
    } catch {
      /* optional */
    }
  }, [hydrated, theme]);

  return (
    <select
      value={theme}
      disabled={!hydrated}
      onChange={(e) => setTheme(e.target.value)}
      className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold outline-none hover:bg-accent"
      title="Theme"
    >
      <option value="dark">Dark</option>
      <option value="light">Light</option>
      <option value="luxury">Luxury</option>
    </select>
  );
}

function LogoutButton({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return (
    <button
      onClick={async () => {
        await authService.logout();
        authStore.clear();
        qc.clear();
        navigate({ to: "/login", replace: true });
      }}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-destructive hover:bg-sidebar-accent",
        compact ? "w-auto border border-destructive/20" : "w-full",
      )}
      title="Log out of admin dashboard"
    >
      <LogOut className="h-4 w-4" /> {compact ? "Logout" : "Log out"}
    </button>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onPress = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("button, a, [role=button]")) return;
      if (
        typeof navigator !== "undefined" &&
        typeof window !== "undefined" &&
        "vibrate" in navigator &&
        window.matchMedia("(pointer: coarse)").matches
      )
        navigator.vibrate?.(12);
    };
    if (typeof document === "undefined") return;
    document.addEventListener("click", onPress, { passive: true });
    return () => document.removeEventListener("click", onPress);
  }, []);
  return (
    <div className="flex h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-background text-foreground">
      <aside className="hidden w-[285px] shrink-0 border-r border-sidebar-border bg-sidebar shadow-card lg:block">
        <SidebarContent />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex min-h-[64px] shrink-0 items-center gap-2 border-b border-border bg-card/85 px-2 pb-2 pt-[max(.5rem,env(safe-area-inset-top))] shadow-sm backdrop-blur-xl sm:min-h-[72px] sm:gap-3 sm:px-4 sm:py-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open navigation"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background/80 transition hover:bg-accent lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[min(88vw,320px)] border-sidebar-border bg-sidebar p-0"
            >
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="flex-1" />
          <Link
            to="/notifications"
            className="relative rounded-xl border border-transparent p-2 text-primary transition hover:border-primary/30 hover:bg-primary/10"
            title="Open notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-primary shadow-glow" />
          </Link>
          <div className="hidden items-center gap-2 rounded-xl border border-border bg-card px-2 py-1 text-sm md:flex">
            <Sparkles className="h-4 w-4 text-primary" />
            <ThemeSwitcher />
          </div>
          <button className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent sm:flex">
            <Globe className="h-4 w-4" /> English{" "}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5 pr-3 shadow-card">
            <img
              src={ADMIN_LOGO_URL}
              alt="Admin"
              className="h-9 w-9 rounded-full object-contain"
            />
            <div className="hidden text-xs leading-tight sm:block">
              <div className="text-muted-foreground">Hello</div>
              <div className="font-semibold">Mr. Breado Admin</div>
            </div>
          </div>
          <div className="hidden md:block">
            <LogoutButton compact />
          </div>
        </header>
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
          <div className="mx-auto w-full max-w-[1680px] px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:p-4 md:p-7">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
