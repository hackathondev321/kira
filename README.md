# KiraLaunch

KiraLaunch is a KIRAPAY-powered checkout and fulfillment layer for selling Solana-native utility to buyers on any chain. It targets the KIRAPAY Frontier hackathon by making cross-chain checkout the core product flow: users pay with their preferred token and chain through KIRAPAY, while the merchant settles in USDC on Solana and unlocks an access pass.

Live demo: https://kira-ivory.vercel.app/

## Why This Matters

Solana apps often lose buyers at checkout because users may hold funds on Ethereum, Polygon, BNB Chain, or another network. KiraLaunch removes that friction for real products like creator memberships, event tickets, and SaaS seats.

KIRAPAY is central to the solution:

- The app creates KIRAPAY payment links from a server-side API route.
- Buyers are sent to hosted KIRAPAY checkout for cross-chain payment.
- Settlement is configured for the merchant's Solana wallet.
- Transaction reconciliation reads KIRAPAY merchant transactions.
- A webhook endpoint is prepared to unlock or mint the Solana pass after payment completion.

## Demo Flow

1. Open the home page.
2. Choose a launch pass: creator membership, event access, or SaaS seat.
3. Click **Create KIRAPAY Checkout**.
4. The Next.js backend calls KIRAPAY `POST /link/generate`.
5. The UI displays the checkout URL, exact API payload, and Solana settlement receiver.
6. Click **Open hosted checkout** to continue payment.
7. Click **Reconcile transactions** to show merchant operations and transaction status.

The deployed version is configured for live KIRAPAY payment-link generation. A local demo fallback exists only so reviewers can inspect the UX without a merchant API key.

## KIRAPAY Integration

KIRAPAY docs used:

- Base URL: `https://api.kira-pay.com/api`
- Authentication: `x-api-key`
- Create payment link: `POST /link/generate`
- Transactions: `GET /wallet/transactions`

Create link payload:

```json
{
  "price": 0.02,
  "currency": "USDC",
  "originalPrice": 0.02,
  "tokenOut": {
    "chain": "solana",
    "chainId": "101",
    "symbol": "USDC",
    "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "decimals": 6
  },
  "receiver": "your_solana_wallet_address",
  "name": "Borderless LaunchPass - Frontier Event Access",
  "redirectUrl": "http://localhost:3000/checkout/success?pass=event-access"
}
```

## Architecture

- `src/app/page.tsx` renders the prize-oriented landing page and explains the adoption use case.
- `src/components/CheckoutPanel.tsx` handles pass selection, checkout creation, API evidence, and reconciliation UI.
- `src/app/api/checkout/route.ts` keeps the KIRAPAY API key server-side and creates checkout links.
- `src/app/api/transactions/route.ts` reads KIRAPAY merchant transactions for reconciliation.
- `src/app/api/webhooks/kirapay/route.ts` receives payment lifecycle events and describes where Solana pass fulfillment occurs.
- `src/app/checkout/success/page.tsx` shows the post-payment unlock experience.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```bash
KIRAPAY_API_KEY=your_kirapay_api_key
KIRAPAY_API_BASE_URL=https://api.kira-pay.com/api
KIRAPAY_DEMO_MODE=false
SOLANA_SETTLEMENT_WALLET=your_solana_wallet
KIRAPAY_TOKEN_OUT_JSON=
```

`KIRAPAY_TOKEN_OUT_JSON` is optional. Leave it empty to use the default Solana USDC settlement token configuration.

## Video Demo Script

1. Start with the problem: Solana merchants lose buyers when checkout requires a specific chain or token.
2. Show KiraLaunch product cards and explain the real adoption targets: creators, events, SaaS.
3. Create a checkout link and show that the server created a KIRAPAY payment intent.
4. Open the hosted checkout URL and explain any-chain payment with Solana settlement.
5. Return to the app, reconcile transactions, and explain webhook-based unlocking.
6. Close with why KIRAPAY is the core enabler: no bridging, no custody, no chain-specific buyer onboarding.

## Production Roadmap

- Verify KIRAPAY webhooks with signed event validation once signature details are available.
- Store orders and payment states in a database.
- Mint compressed Solana access passes or write settlement receipts after completed payment events.
- Add merchant dashboards for revenue analytics, refunds, and customer management.
- Support multiple merchant settlement wallets and token preferences.
