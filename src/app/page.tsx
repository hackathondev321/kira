import { CheckoutPanel } from "@/components/CheckoutPanel";
import { launchPasses } from "@/lib/products";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050814] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[20%] h-[32rem] w-[32rem] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[30%] h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-5 py-8 md:px-8 lg:px-10">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-300 font-black text-slate-950">
              KL
            </div>
            <div>
              <p className="font-semibold">KiraLaunch</p>
              <p className="text-sm text-slate-400">Powered by KIRAPAY</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 px-4 py-2">
              Non-custodial
            </span>
            <span className="rounded-full border border-white/10 px-4 py-2">
              Intent-based
            </span>
            <span className="rounded-full border border-white/10 px-4 py-2">
              Solana settlement
            </span>
          </div>
        </nav>

        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100">
              Frontier Hackathon Submission
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
              Sell Solana utility to anyone, even if their funds live on another
              chain.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              KiraLaunch is a checkout and fulfillment layer for creators, events,
              and SaaS teams. Customers pay from any supported chain through
              KIRAPAY, while merchants receive predictable USDC settlement on
              Solana and unlock the purchased pass.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Stat label="Chains abstracted" value="70+" />
              <Stat label="Tokens supported" value="20K+" />
              <Stat label="Merchant fee" value="1.5%" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/40 backdrop-blur">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-200">
              Why this wins
            </p>
            <div className="mt-5 space-y-4">
              <PitchCard
                title="KIRAPAY is the product, not an add-on"
                body="The app cannot work without cross-chain checkout because the core pain point is selling Solana utility to users who do not hold Solana assets."
              />
              <PitchCard
                title="Real adoption path"
                body="Events, creator memberships, and SaaS seats are things users already pay for. KIRAPAY removes the bridge, token, and gas decision from checkout."
              />
              <PitchCard
                title="Scalable architecture"
                body="The frontend never sees the API key. A server route creates payment links, a webhook endpoint unlocks fulfillment, and transaction APIs reconcile merchant revenue."
              />
            </div>
          </div>
        </section>

        <CheckoutPanel passes={launchPasses} />

        <section className="grid gap-4 md:grid-cols-4">
          <ArchitectureStep
            number="01"
            title="Customer chooses pass"
            body="Buyer selects a Solana-native product without needing to own SOL or USDC on Solana."
          />
          <ArchitectureStep
            number="02"
            title="Backend creates intent"
            body="Next.js API route sends price, currency, receiver, name, and redirectUrl to KIRAPAY."
          />
          <ArchitectureStep
            number="03"
            title="KIRAPAY routes payment"
            body="Hosted checkout accepts the buyer's wallet, chain, and token, then resolves the payment intent."
          />
          <ArchitectureStep
            number="04"
            title="Solana unlock"
            body="Webhook or reconciliation confirms completion and unlocks the user pass on Solana."
          />
        </section>

        <footer className="border-t border-white/10 py-8 text-sm text-slate-400">
          Built for the KIRAPAY Frontier track: cross-chain checkout with Solana
          settlement, real API integration, and a judge-ready demo mode.
        </footer>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
      <p className="text-3xl font-black text-cyan-200">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{label}</p>
    </div>
  );
}

function PitchCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
      <h2 className="font-semibold text-white">{title}</h2>
      <p className="mt-2 leading-7 text-slate-300">{body}</p>
    </div>
  );
}

function ArchitectureStep({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
      <p className="text-sm font-black text-cyan-200">{number}</p>
      <h2 className="mt-4 text-xl font-semibold">{title}</h2>
      <p className="mt-3 leading-7 text-slate-300">{body}</p>
    </div>
  );
}
