import { NextResponse } from "next/server";

type KiraPayTransaction = {
  _id: string;
  transaction_hash: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  amount: number;
  createdAt: string;
};

export async function GET() {
  const apiKey = process.env.KIRAPAY_API_KEY;
  const baseUrl = process.env.KIRAPAY_API_BASE_URL ?? "https://api.kira-pay.com/api";

  if (!apiKey || process.env.KIRAPAY_DEMO_MODE?.toLowerCase() === "true") {
    return NextResponse.json({
      mode: "demo",
      transactions: demoTransactions,
      message:
        "Demo reconciliation data. Add KIRAPAY_API_KEY to read live merchant transactions.",
    });
  }

  const response = await fetch(`${baseUrl}/wallet/transactions`, {
    headers: {
      "x-api-key": apiKey,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(
      {
        message:
          data?.message ?? "Unable to fetch KIRAPAY transaction history.",
      },
      { status: response.status },
    );
  }

  return NextResponse.json({
    mode: "live",
    transactions: data?.data?.transactions ?? [],
    total: data?.data?.total ?? 0,
  });
}

const demoTransactions: KiraPayTransaction[] = [
  {
    _id: "txn_demo_01",
    transaction_hash: "5YjKiraDemoSolanaReceipt9bS6pQmE7Xn1V2p",
    status: "COMPLETED",
    amount: 2.00,
    createdAt: "2026-05-09T14:08:00.000Z",
  },
  {
    _id: "txn_demo_02",
    transaction_hash: "7zFrontierCrossChainIntent4Qx8nSolanaSettle",
    status: "PENDING",
    amount: 2.00,
    createdAt: "2026-05-09T14:16:00.000Z",
  },
];
