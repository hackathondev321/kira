import { SOLANA_SETTLEMENT_WALLET, type LaunchPass } from "./products";

export type CreateKiraPayLinkRequest = {
  price: number;
  originalPrice: number;
  tokenOut: Record<string, string | number>;
  receiver: string;
  customOrderId: string;
  name: string;
  redirectUrl?: string;
};

export type CreateKiraPayLinkResponse = {
  message: string;
  data: {
    url: string;
  };
};

export type CheckoutResult = {
  checkoutUrl: string;
  mode: "live" | "demo";
  payload: CreateKiraPayLinkRequest;
  message: string;
};

export function buildCheckoutPayload(
  pass: LaunchPass,
  origin: string,
): CreateKiraPayLinkRequest {
  const redirectUrl = new URL("/checkout/success", origin);
  redirectUrl.searchParams.set("pass", pass.id);

  return {
    price: pass.price,
    originalPrice: pass.price,
    tokenOut: getSettlementToken(),
    receiver: getSettlementWallet(),
    customOrderId: `kiralaunch_${pass.id}_${Date.now()}`,
    name: `Borderless LaunchPass - ${pass.name}`,
    redirectUrl: redirectUrl.toString(),
  };
}

export async function createKiraPayCheckout(
  payload: CreateKiraPayLinkRequest,
): Promise<CheckoutResult> {
  const apiKey = process.env.KIRAPAY_API_KEY;
  const baseUrl = process.env.KIRAPAY_API_BASE_URL ?? "https://api.kira-pay.com/api";
  const shouldUseDemo =
    !apiKey || process.env.KIRAPAY_DEMO_MODE?.toLowerCase() === "true";

  if (shouldUseDemo) {
    return {
      checkoutUrl: buildDemoCheckoutUrl(payload),
      mode: "demo",
      payload,
      message:
        "Demo checkout generated locally. Add KIRAPAY_API_KEY for live KIRAPAY links.",
    };
  }

  const response = await fetch(`${baseUrl}/link/generate`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      price: payload.price,
      originalPrice: payload.originalPrice,
      tokenOut: payload.tokenOut,
      Address: payload.receiver,
      receiver: payload.receiver,
      customOrderId: payload.customOrderId,
      name: payload.name,
      redirectUrl: payload.redirectUrl,
      type: "single_use",
      isViewAsCrypto: true,
      cryptoCurrency: String(payload.tokenOut.symbol ?? "SOL"),
    }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as
    | CreateKiraPayLinkResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    const message =
      data && "message" in data && data.message
        ? data.message
        : "KIRAPAY checkout request failed.";
    throw new Error(message);
  }

  const checkoutUrl =
    data && "data" in data && typeof data.data?.url === "string"
      ? data.data.url
      : null;

  if (!checkoutUrl) {
    throw new Error("KIRAPAY response did not include a checkout URL.");
  }

  const message =
    data && "message" in data && data.message
      ? data.message
      : "KIRAPAY checkout link created.";

  return {
    checkoutUrl,
    mode: "live",
    payload,
    message,
  };
}

function buildDemoCheckoutUrl(payload: CreateKiraPayLinkRequest) {
  const demoUrl = new URL("https://checkout.kira-pay.com/demo");
  demoUrl.searchParams.set("amount", String(payload.price));
  demoUrl.searchParams.set("receiver", getSettlementWallet());
  demoUrl.searchParams.set("name", payload.name);
  if (payload.redirectUrl) {
    demoUrl.searchParams.set("redirectUrl", payload.redirectUrl);
  }
  return demoUrl.toString();
}

export function getSettlementWallet() {
  return process.env.SOLANA_SETTLEMENT_WALLET ?? SOLANA_SETTLEMENT_WALLET;
}

function getSettlementToken(): Record<string, string | number> {
  if (process.env.KIRAPAY_TOKEN_OUT_JSON) {
    return JSON.parse(process.env.KIRAPAY_TOKEN_OUT_JSON) as Record<
      string,
      string | number
    >;
  }

  return {
    chainId: "101",
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
  };
}
