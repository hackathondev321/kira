"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, Clock, Terminal } from "lucide-react";
import type { LaunchPass } from "@/lib/products";

type CheckoutResponse = {
  checkoutUrl: string;
  mode: "live" | "demo";
  message: string;
  pass: LaunchPass;
  payload: {
    price: number;
    currency: string;
    originalPrice: number;
    tokenOut: Record<string, string | number>;
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
    () => passes.find((p) => p.id === selectedId) ?? passes[0],
    [passes, selectedId],
  );

  async function createCheckout() {
    setIsCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ passId: selectedPass.id }),
      });
      const data = (await res.json()) as CheckoutResponse | { message?: string };
      if (!res.ok || !("checkoutUrl" in data)) throw new Error(data.message ?? "Unable to create checkout.");
      setCheckout(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create checkout.");
    } finally {
      setIsCreating(false);
    }
  }

  async function reconcileTransactions() {
    setIsReconciling(true);
    setError(null);
    try {
      const res = await fetch("/api/transactions");
      const data = (await res.json()) as TransactionsResponse | { message?: string };
      if (!res.ok || !("transactions" in data)) throw new Error(data.message ?? "Unable to fetch transactions.");
      setTransactions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to fetch transactions.");
    } finally {
      setIsReconciling(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      {/* Left: pass selector */}
      <div>
        {/* Pass tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {passes.map((pass) => (
            <button
              key={pass.id}
              type="button"
              onClick={() => { setSelectedId(pass.id); setCheckout(null); }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                pass.id === selectedPass.id
                  ? "bg-[#c8f461] text-[#0c0c0e]"
                  : "border border-white/10 text-[#888] hover:border-white/25 hover:text-[#f0ede8]"
              }`}
            >
              {pass.name}
            </button>
          ))}
        </div>

        {/* Selected pass detail */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">{selectedPass.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#777]">{selectedPass.description}</p>
            </div>
            <div className="shrink-0 rounded-xl border border-white/8 px-4 py-3 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#555]">Price</p>
              <p className="mt-0.5 text-2xl font-black">${selectedPass.price}</p>
              <p className="text-xs text-[#555]">{selectedPass.currency}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Detail label="For buyers" value={selectedPass.buyerValue} />
            <Detail label="On Solana" value={selectedPass.solanaUtility} />
            <Detail label="Use case" value={selectedPass.merchantUseCase} />
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isCreating}
              onClick={createCheckout}
              className="rounded-full bg-[#c8f461] px-6 py-3 text-sm font-bold text-[#0c0c0e] transition hover:bg-[#d6f97a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating ? "Generating link…" : "Create KIRAPAY checkout"}
            </button>

            {checkout && (
              <a
                href={checkout.checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-[#888] transition hover:border-[#c8f461] hover:text-[#c8f461]"
              >
                Open checkout <ArrowUpRight size={13} />
              </a>
            )}

            <button
              type="button"
              disabled={isReconciling}
              onClick={reconcileTransactions}
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-[#888] transition hover:border-white/25 hover:text-[#f0ede8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isReconciling ? "Fetching…" : "Reconcile txns"}
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/8 p-4 text-sm text-red-300">
              {error}
            </p>
          )}
        </div>

        {/* Transactions */}
        {transactions && (
          <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.02] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-semibold">Merchant transactions</h4>
              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#555]">
                {transactions.mode}
              </span>
            </div>
            <div className="space-y-3">
              {transactions.transactions.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between gap-4 rounded-xl border border-white/6 px-4 py-3">
                  <div className="flex items-center gap-3">
                    {tx.status === "COMPLETED"
                      ? <CheckCircle2 size={15} className="text-[#86efac]" />
                      : <Clock size={15} className="text-[#fde68a]" />
                    }
                    <div>
                      <p className="text-sm font-semibold">${tx.amount} USDC</p>
                      <p className="mt-0.5 max-w-[180px] truncate font-mono text-[10px] text-[#444]">
                        {tx.transaction_hash}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    tx.status === "COMPLETED" ? "bg-[#86efac]/10 text-[#86efac]" : "bg-[#fde68a]/10 text-[#fde68a]"
                  }`}>
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: API evidence */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-white/8 bg-[#0a0a0c] overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/8 px-5 py-3.5">
            <div className="flex items-center gap-2.5 text-[#555]">
              <Terminal size={13} />
              <span className="font-mono text-xs">KIRAPAY API request</span>
            </div>
            <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold ${
              checkout?.mode === "live"
                ? "bg-[#86efac]/10 text-[#86efac]"
                : "bg-white/6 text-[#666]"
            }`}>
              {checkout?.mode ?? "ready"}
            </span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-6 text-[#c8f461]">
            {JSON.stringify(
              checkout?.payload ?? {
                method: "POST",
                url: "https://api.kira-pay.com/api/link/generate",
                headers: { "x-api-key": "••••••••" },
                body: {
                  price: selectedPass.price,
                  currency: selectedPass.currency,
                  originalPrice: selectedPass.price,
                  tokenOut: {
                    chain: "solana",
                    chainId: "101",
                    symbol: selectedPass.currency,
                    address: "EPjF...Dt1v",
                    decimals: 6,
                  },
                  receiver: "<SOLANA_WALLET>",
                  name: `Borderless LaunchPass - ${selectedPass.name}`,
                  redirectUrl: "/checkout/success",
                },
              },
              null,
              2,
            )}
          </pre>
        </div>

        {checkout && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#555]">Response</p>
            <div className="space-y-3 text-sm">
              <Row label="Checkout URL">
                <a
                  href={checkout.checkoutUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 break-all text-[#7dd3fc] underline-offset-2 hover:underline"
                >
                  {checkout.checkoutUrl.length > 45
                    ? checkout.checkoutUrl.slice(0, 45) + "…"
                    : checkout.checkoutUrl}
                  <ArrowUpRight size={11} className="shrink-0" />
                </a>
              </Row>
              <Row label="Settles to">
                <span className="font-mono text-xs text-[#888]">
                  {checkout.settlement.token} on {checkout.settlement.chain}
                </span>
              </Row>
              <Row label="Receiver">
                <span className="max-w-[180px] truncate font-mono text-xs text-[#888]">
                  {checkout.settlement.receiver}
                </span>
              </Row>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#555]">API endpoints used</p>
          <div className="space-y-2 font-mono text-xs">
            <EndpointRow method="POST" path="/link/generate" desc="Create checkout link" />
            <EndpointRow method="GET" path="/wallet/transactions" desc="Merchant reconciliation" />
            <EndpointRow method="POST" path="/webhook" desc="Fulfillment trigger" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#444]">{label}</p>
      <p className="text-xs leading-relaxed text-[#888]">{value}</p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 border-t border-white/6 pt-3 first:border-0 first:pt-0">
      <span className="text-[#555]">{label}</span>
      {children}
    </div>
  );
}

function EndpointRow({ method, path, desc }: { method: string; path: string; desc: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded bg-[#c8f461]/12 px-1.5 py-0.5 text-[#c8f461]">{method}</span>
      <span className="text-[#f0ede8]">{path}</span>
      <span className="text-[#444]">—</span>
      <span className="text-[#555]">{desc}</span>
    </div>
  );
}
