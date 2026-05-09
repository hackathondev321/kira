"use client";

import { useMemo, useState } from "react";
import type { LaunchPass } from "@/lib/products";

type CheckoutResponse = {
  checkoutUrl: string;
  mode: "live" | "demo";
  message: string;
  pass: LaunchPass;
  payload: {
    price: number;
    currency: string;
    receiver: string;
    name: string;
    redirectUrl?: string;
  };
  settlement: {
    chain: string;
    token: string;
    receiver: string;
  };
};

type Transaction = {
  _id: string;
  transaction_hash: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  amount: number;
  createdAt: string;
};

type TransactionsResponse = {
  mode: "live" | "demo";
  transactions: Transaction[];
  total?: number;
  message?: string;
};

export function CheckoutPanel({ passes }: { passes: LaunchPass[] }) {
  const [selectedId, setSelectedId] = useState(passes[0]?.id);
  const [checkout, setCheckout] = useState<CheckoutResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionsResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPass = useMemo(
    () => passes.find((pass) => pass.id === selectedId) ?? passes[0],
    [passes, selectedId],
  );

  async function createCheckout() {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ passId: selectedPass.id }),
      });
      const data = (await response.json()) as CheckoutResponse | { message?: string };

      if (!response.ok || !("checkoutUrl" in data)) {
        throw new Error(data.message ?? "Unable to create checkout.");
      }

      setCheckout(data);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to create checkout.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function reconcileTransactions() {
    setIsReconciling(true);
    setError(null);

    try {
      const response = await fetch("/api/transactions");
      const data = (await response.json()) as TransactionsResponse | { message?: string };

      if (!response.ok || !("transactions" in data)) {
        throw new Error(data.message ?? "Unable to fetch transactions.");
      }

      setTransactions(data);
    } catch (transactionError) {
      setError(
        transactionError instanceof Error
          ? transactionError.message
          : "Unable to fetch transactions.",
      );
    } finally {
      setIsReconciling(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-200">
              Live Checkout
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Accept any chain. Settle on Solana.
            </h2>
          </div>
          <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-100">
            KIRAPAY Core Flow
          </span>
        </div>

        <div className="mt-6 grid gap-3">
          {passes.map((pass) => {
            const isActive = pass.id === selectedPass.id;
            return (
              <button
                className={`rounded-3xl border p-4 text-left transition ${
                  isActive
                    ? "border-cyan-300 bg-cyan-300/15 shadow-lg shadow-cyan-950/30"
                    : "border-white/10 bg-black/20 hover:border-white/30"
                }`}
                key={pass.id}
                onClick={() => {
                  setSelectedId(pass.id);
                  setCheckout(null);
                }}
                type="button"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{pass.name}</h3>
                    <p className="mt-1 text-sm text-slate-300">{pass.tagline}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-2 text-right text-slate-950">
                    <p className="text-xs font-semibold uppercase tracking-widest">
                      Price
                    </p>
                    <p className="text-xl font-black">
                      ${pass.price} {pass.currency}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-3xl bg-slate-950/60 p-5">
          <p className="text-sm leading-6 text-slate-300">{selectedPass.description}</p>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            <Metric label="Buyer" value={selectedPass.buyerValue} />
            <Metric label="Solana" value={selectedPass.solanaUtility} />
            <Metric label="Merchant" value={selectedPass.merchantUseCase} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isCreating}
            onClick={createCheckout}
            type="button"
          >
            {isCreating ? "Creating KIRAPAY link..." : "Create KIRAPAY Checkout"}
          </button>
          {checkout ? (
            <a
              className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-cyan-200 hover:text-cyan-100"
              href={checkout.checkoutUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open hosted checkout
            </a>
          ) : null}
          <button
            className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-emerald-200 hover:text-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isReconciling}
            onClick={reconcileTransactions}
            type="button"
          >
            {isReconciling ? "Reconciling..." : "Reconcile transactions"}
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-300/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </p>
        ) : null}
      </div>

      <div className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-5 shadow-2xl shadow-black/30 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-200">
                API Evidence
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Server-created payment intent
              </h2>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-200">
              {checkout?.mode ?? "ready"}
            </span>
          </div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-black/60 p-4">
            <pre className="overflow-x-auto text-xs leading-6 text-cyan-50">
              {JSON.stringify(
                checkout?.payload ?? {
                  endpoint: "POST /api/checkout",
                  kirapayEndpoint: "POST /link/generate",
                  settlement: "Solana USDC",
                  secretHandling: "KIRAPAY_API_KEY stays server-side",
                },
                null,
                2,
              )}
            </pre>
          </div>

          {checkout ? (
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>
                <span className="font-semibold text-white">Checkout URL:</span>{" "}
                <span className="break-all text-cyan-100">{checkout.checkoutUrl}</span>
              </p>
              <p>
                <span className="font-semibold text-white">Settlement:</span>{" "}
                {checkout.settlement.token} on {checkout.settlement.chain} to{" "}
                <span className="break-all text-cyan-100">
                  {checkout.settlement.receiver}
                </span>
              </p>
              <p className="rounded-2xl bg-cyan-300/10 p-3 text-cyan-100">
                {checkout.message}
              </p>
            </div>
          ) : null}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-200">
                Merchant Ops
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Payment reconciliation
              </h2>
            </div>
            <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-100">
              {transactions?.mode ?? "idle"}
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {(transactions?.transactions ?? []).map((transaction) => (
              <div
                className="rounded-3xl border border-white/10 bg-black/25 p-4"
                key={transaction._id}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-white">${transaction.amount} USDC</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      transaction.status === "COMPLETED"
                        ? "bg-emerald-300/15 text-emerald-100"
                        : "bg-amber-300/15 text-amber-100"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
                <p className="mt-2 break-all text-xs text-slate-400">
                  {transaction.transaction_hash}
                </p>
              </div>
            ))}
            {!transactions ? (
              <p className="rounded-3xl border border-dashed border-white/15 p-4 text-sm text-slate-300">
                Click reconcile to fetch KIRAPAY merchant transactions. With no API key,
                the app shows deterministic demo data for judges.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
      <p className="text-xs font-bold uppercase tracking-widest text-cyan-200">
        {label}
      </p>
      <p className="mt-2 text-slate-100">{value}</p>
    </div>
  );
}
