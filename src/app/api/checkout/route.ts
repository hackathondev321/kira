import { NextResponse, type NextRequest } from "next/server";
import {
  buildCheckoutPayload,
  createKiraPayCheckout,
  getSettlementWallet,
} from "@/lib/kirapay";
import { getLaunchPass } from "@/lib/products";

export async function POST(request: NextRequest) {
  let payload: ReturnType<typeof buildCheckoutPayload> | null = null;

  try {
    const body = (await request.json()) as { passId?: string };
    const pass = getLaunchPass(body.passId ?? "");
    const origin = request.nextUrl.origin;
    payload = buildCheckoutPayload(pass, origin);
    const checkout = await createKiraPayCheckout(payload);

    return NextResponse.json({
      pass,
      ...checkout,
      settlement: {
        chain: "Solana",
        token: "Dashboard-configured settlement",
        receiver: getSettlementWallet(),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create a KIRAPAY checkout session.";

    return NextResponse.json({ message, payload }, { status: 502 });
  }
}
