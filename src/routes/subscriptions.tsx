import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { CreditCard, Check } from "lucide-react";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({ meta: [{ title: "Subscriptions | Mr. Breado Admin" }] }),
  component: () => {
    const plans = [
      { name:"Basic", price:0, features:["Up to 50 orders/mo","Email support","1 restaurant"], color:"border-border" },
      { name:"Pro", price:49, features:["Unlimited orders","Priority support","5 restaurants","Analytics"], color:"border-primary shadow-glow", popular:true },
      { name:"Enterprise", price:199, features:["Unlimited everything","24/7 support","Unlimited restaurants","Custom integrations","Dedicated manager"], color:"border-border" },
    ];
    return (<>
      <PageHeader title="Subscription Plans" icon={<CreditCard className="h-5 w-5"/>}
        breadcrumbs={[{label:"Dashboard",to:"/"},{label:"Subscriptions"}]} />
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map(p => (
          <div key={p.name} className={`relative rounded-2xl border-2 bg-card p-6 ${p.color}`}>
            {p.popular && <span className="absolute -top-3 right-4 rounded-full gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground">POPULAR</span>}
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold">₹{p.price}</span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
            <ul className="my-6 space-y-2">
              {p.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success"/>{f}</li>
              ))}
            </ul>
            <button className={`w-full rounded-md py-2 text-sm font-medium ${p.popular?"gradient-primary text-primary-foreground":"border border-border hover:bg-accent"}`}>Choose Plan</button>
          </div>
        ))}
      </div>
    </>);
  },
});
