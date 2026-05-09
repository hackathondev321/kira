import { NextResponse, type NextRequest } from "next/server";

type KiraPayWebhookEvent = {
  type?: string;
  status?: string;
  transaction_hash?: string;
  amount?: number;
  currency?: string;
  linkCode?: string;
};

export async function POST(request: NextRequest) {
  const event = (await request.json().catch(() => null)) as
    | KiraPayWebhookEvent
    | null;

  if (!event) {
    return NextResponse.json({ message: "Invalid webhook payload." }, { status: 400 });
  }

  // In production this is where the app would verify the event, update the order,
  // and mint or unlock the Solana access pass after a completed payment.
  return NextResponse.json({
    received: true,
    nextAction:
      event.status === "COMPLETED"
        ? "unlock_solana_launchpass"
        : "wait_for_finality",
    event,
  });
}
