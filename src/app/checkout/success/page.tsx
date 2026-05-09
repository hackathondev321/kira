import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { getLaunchPass } from "@/lib/products";

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ pass?: string }>;
}) {
  const params = await searchParams;
  const pass = getLaunchPass(params.pass ?? "");

  return (
    <main className="min-h-screen bg-[#0c0c0e] text-[#f0ede8]">
      <div className="mx-auto flex min-h-screen max-w-[640px] flex-col items-start justify-center px-6 py-16">
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#86efac]/15">
          <CheckCircle2 size={22} className="text-[#86efac]" />
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#555]">
          Payment confirmed
        </p>
        <h1 className="text-4xl font-black tracking-tight">
          Your {pass.name} is ready.
        </h1>
        <p className="mt-5 leading-relaxed text-[#777]">
          KIRAPAY confirmed your cross-chain payment. In production, a webhook
          triggers the backend to mint or unlock your Solana access pass.
        </p>

        <div className="mt-8 w-full rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#555]">Unlocked</p>
          <p className="text-sm leading-relaxed text-[#888]">{pass.solanaUtility}</p>
        </div>

        <Link
          href="/"
          className="mt-8 flex items-center gap-2 text-sm text-[#555] transition hover:text-[#f0ede8]"
        >
          <ArrowLeft size={14} /> Back to demo
        </Link>
      </div>
    </main>
  );
}
