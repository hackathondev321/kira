import { CheckoutPanel } from "@/components/CheckoutPanel";
import { launchPasses } from "@/lib/products";
import { ArrowUpRight, Zap, Shield, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0e] text-[#f0ede8]">
      {/* Nav */}
      <header className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-6 md:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c8f461]">
            <span className="text-xs font-black text-[#0c0c0e]">K</span>
          </div>
          <span className="font-semibold tracking-tight">KiraLaunch</span>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-[#888] md:flex">
          <a href="#products" className="transition hover:text-[#f0ede8]">Products</a>
          <a href="#how" className="transition hover:text-[#f0ede8]">How it works</a>
          <a href="#checkout" className="transition hover:text-[#f0ede8]">Checkout</a>
        </nav>

        <a
          href="https://docs.kira-pay.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm transition hover:border-[#c8f461] hover:text-[#c8f461]"
        >
          Docs <ArrowUpRight size={13} />
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1320px] px-6 pb-24 pt-20 md:px-10 md:pt-28">
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="mb-6 inline-block rounded-full border border-[#c8f461]/30 bg-[#c8f461]/8 px-4 py-1.5 text-xs font-medium tracking-wide text-[#c8f461]">
              Built for KIRAPAY Frontier Hackathon
            </p>
            <h1 className="max-w-3xl text-[clamp(2.6rem,6vw,5.5rem)] font-black leading-[1.02] tracking-[-0.03em] text-[#f0ede8]">
              Sell anything on Solana.{" "}
              <span className="text-[#888]">Let buyers pay from any chain.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#888]">
              KiraLaunch is a checkout layer for Solana payments.
              One live test product, one KIRAPAY checkout, settled in SOL through the merchant dashboard.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#checkout"
                className="rounded-full bg-[#c8f461] px-7 py-3.5 text-sm font-bold text-[#0c0c0e] transition hover:bg-[#d6f97a]"
              >
                Try checkout demo
              </a>
              <a
                href="https://kira-pay.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-[#888] transition hover:text-[#f0ede8]"
              >
                Powered by KIRAPAY <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          {/* Side stats */}
          <div className="space-y-3">
            <StatCard icon={<Globe size={16} />} value="70+" label="Chains supported" />
            <StatCard icon={<Zap size={16} />} value="20K+" label="Tokens accepted" />
            <StatCard icon={<Shield size={16} />} value="1.5%" label="Flat merchant fee" />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1320px] border-t border-white/8 px-6 md:px-10" />

      {/* Products */}
      <section id="products" className="mx-auto max-w-[1320px] px-6 py-24 md:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#555]">Live test product</p>
            <h2 className="text-4xl font-black tracking-tight">One product. One live checkout.</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#666]">
            This demo product matches the live KIRAPAY payment link configured for Solana (SOL) settlement.
          </p>
        </div>

        <div className="grid gap-px bg-white/8 overflow-hidden rounded-2xl md:grid-cols-1">
          {launchPasses.map((pass, i) => (
            <ProductCard key={pass.id} pass={pass} index={i} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-[#111114]">
        <div className="mx-auto max-w-[1320px] px-6 py-24 md:px-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#555]">Under the hood</p>
          <h2 className="mb-16 max-w-xl text-4xl font-black tracking-tight">
            How a cross-chain intent becomes a Solana settlement.
          </h2>

          <div className="grid gap-0 md:grid-cols-4">
            {steps.map((step, i) => (
              <StepCard key={step.title} step={step} index={i} total={steps.length} />
            ))}
          </div>
        </div>
      </section>

      {/* Checkout demo */}
      <section id="checkout" className="mx-auto max-w-[1320px] px-6 py-24 md:px-10">
        <div className="mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#555]">Live demo</p>
          <h2 className="text-4xl font-black tracking-tight">KIRAPAY checkout, right here.</h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#666]">
            Pick the test product, hit the button. Our backend calls KIRAPAY{" "}
            <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-[#c8f461]">
              POST /link/generate
            </code>{" "}
            and returns a hosted checkout URL. Your API key never touches the browser.
          </p>
        </div>

        <CheckoutPanel passes={launchPasses} />
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 bg-[#0c0c0e]">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-6 px-6 py-8 md:px-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#c8f461]">
              <span className="text-[10px] font-black text-[#0c0c0e]">K</span>
            </div>
            <span className="text-sm font-semibold text-[#888]">KiraLaunch</span>
          </div>
          <p className="text-xs text-[#444]">
            Frontier Hackathon 2026 · KIRAPAY cross-chain track · Solana settlement
          </p>
          <a
            href="https://github.com/hackathondev321/kira"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#555] transition hover:text-[#f0ede8]"
          >
            GitHub <ArrowUpRight size={11} />
          </a>
        </div>
      </footer>
    </main>
  );
}

const steps = [
  {
    n: "01",
    title: "Pick a pass",
    body: "Buyer selects a Solana product. No need to hold SOL or bridge anything.",
  },
  {
    n: "02",
    title: "Backend creates intent",
    body: "Next.js server calls KIRAPAY with price, currency, and your Solana wallet.",
  },
  {
    n: "03",
    title: "KIRAPAY routes payment",
    body: "Hosted checkout accepts any token from any chain and resolves the intent.",
  },
  {
    n: "04",
    title: "Pass unlocked on Solana",
    body: "Webhook confirms completion. The access pass is minted or unlocked.",
  },
];

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-5 py-4">
      <div className="flex items-center gap-3 text-[#555]">
        {icon}
        <span className="text-sm text-[#666]">{label}</span>
      </div>
      <span className="text-xl font-black text-[#f0ede8]">{value}</span>
    </div>
  );
}

function ProductCard({
  pass,
  index,
}: {
  pass: { name: string; tagline: string; price: number; currency: string; description: string; merchantUseCase: string };
  index: number;
}) {
  const accents = ["#c8f461", "#7dd3fc", "#fda4af"];
  const accent = accents[index % accents.length];

  return (
    <div className="group bg-[#0c0c0e] p-8 transition-colors hover:bg-[#111114]">
      <div
        className="mb-6 inline-block rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em]"
        style={{ background: `${accent}18`, color: accent }}
      >
        ${pass.price} {pass.currency}
      </div>
      <h3 className="mb-3 text-xl font-bold tracking-tight">{pass.name}</h3>
      <p className="mb-6 text-sm leading-relaxed text-[#666]">{pass.tagline}</p>
      <p className="border-t border-white/8 pt-5 text-xs leading-relaxed text-[#555]">
        {pass.merchantUseCase}
      </p>
    </div>
  );
}

function StepCard({
  step,
  index,
  total,
}: {
  step: { n: string; title: string; body: string };
  index: number;
  total: number;
}) {
  return (
    <div
      className={`p-8 ${index < total - 1 ? "border-b border-white/8 md:border-b-0 md:border-r" : ""}`}
    >
      <p className="mb-6 font-mono text-xs text-[#333]">{step.n}</p>
      <h3 className="mb-3 text-lg font-bold">{step.title}</h3>
      <p className="text-sm leading-relaxed text-[#666]">{step.body}</p>
    </div>
  );
}
