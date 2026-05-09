export type LaunchPass = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  currency: "USD";
  inventory: number;
  solanaUtility: string;
  buyerValue: string;
  merchantUseCase: string;
};

export const SOLANA_SETTLEMENT_WALLET =
  "your_solana_wallet_address";

export const launchPasses: LaunchPass[] = [
  {
    id: "test-product",
    name: "KIRAPAY Test Product",
    tagline: "A live checkout product for validating Solana settlement.",
    description:
      "A small-value test product used to demonstrate a real KIRAPAY checkout flow with Solana (SOL) settlement.",
    price: 2.00,
    currency: "USD",
    inventory: 1,
    solanaUtility: "Completes a KIRAPAY-hosted payment and records the purchase for Solana fulfillment.",
    buyerValue: "Buyers can complete payment through KIRAPAY without manually bridging or swapping first.",
    merchantUseCase: "Live hackathon demo, payment-link validation, and transaction proof.",
  },
];

export function getLaunchPass(id: string) {
  return launchPasses.find((pass) => pass.id === id) ?? launchPasses[0];
}
