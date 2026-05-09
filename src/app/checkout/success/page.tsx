import Link from "next/link";
import { getLaunchPass } from "@/lib/products";

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ pass?: string }>;
}) {
  const params = await searchParams;
  const pass = getLaunchPass(params.pass ?? "");

  return (
    <main className="min-h-screen bg-[#050814] px-5 py-10 text-white">
      <section className="mx-auto flex min-h-[80vh] max-w-3xl flex-col justify-center">
        <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-8 shadow-2xl shadow-emerald-950/30">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-100">
            Payment Confirmed
          </p>
          <h1 className="mt-4 text-5xl font-black tracking-tight">
            Your {pass.name} is ready.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-200">
            In production, this page is reached after KIRAPAY checkout completes.
            The backend webhook confirms payment status, then unlocks or mints the
            Solana access pass for the buyer.
          </p>
          <div className="mt-6 rounded-3xl bg-black/30 p-5">
            <p className="text-sm font-semibold text-cyan-100">Unlocked utility</p>
            <p className="mt-2 text-slate-200">{pass.solanaUtility}</p>
          </div>
          <Link
            className="mt-8 inline-flex rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-200"
            href="/"
          >
            Back to demo
          </Link>
        </div>
      </section>
    </main>
  );
}
