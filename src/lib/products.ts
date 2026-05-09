export type LaunchPass = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  currency: "USDC";
  inventory: number;
  solanaUtility: string;
  buyerValue: string;
  merchantUseCase: string;
};

export const SOLANA_SETTLEMENT_WALLET =
  "8nKiraFrontierSolanaMerchant111111111111111111111";

export const launchPasses: LaunchPass[] = [
  {
    id: "creator-studio",
    name: "Creator Studio Pass",
    tagline: "Sell gated Solana drops to fans on any chain.",
    description:
      "A one-month membership for creators who sell token-gated videos, design packs, and community perks without forcing fans to bridge first.",
    price: 19,
    currency: "USDC",
    inventory: 124,
    solanaUtility: "Mints a compressed access pass and records revenue on Solana.",
    buyerValue: "Fans pay from their native wallet and receive access in seconds.",
    merchantUseCase: "Creator subscriptions, paid communities, premium drops.",
  },
  {
    id: "event-access",
    name: "Frontier Event Access",
    tagline: "Cross-chain ticket checkout, Solana settlement.",
    description:
      "A global event ticket that accepts payments from EVM users while settling the merchant's treasury directly on Solana.",
    price: 49,
    currency: "USDC",
    inventory: 68,
    solanaUtility: "Issues a Solana ticket receipt for check-in and refunds.",
    buyerValue: "No chain switching at the door; scan, pay, and enter.",
    merchantUseCase: "Conferences, hackathons, meetups, paid workshops.",
  },
  {
    id: "saas-seat",
    name: "AI SaaS Seat",
    tagline: "Crypto-native billing without chain lock-in.",
    description:
      "A starter SaaS subscription that lets teams pay in the asset they already hold while the operator receives predictable Solana USDC.",
    price: 99,
    currency: "USDC",
    inventory: 32,
    solanaUtility: "Creates a Solana billing receipt and unlocks seat provisioning.",
    buyerValue: "Teams can pay from Ethereum, BNB Chain, Polygon, or Solana.",
    merchantUseCase: "SaaS subscriptions, API credits, usage-based products.",
  },
];

export function getLaunchPass(id: string) {
  return launchPasses.find((pass) => pass.id === id) ?? launchPasses[0];
}
