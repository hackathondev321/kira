# KiraLaunch Submission Write-Up

## Concept

KiraLaunch helps Solana builders sell a paid test product to users through KIRAPAY. A buyer can open the hosted KIRAPAY checkout, complete payment, and the merchant receives SOL settlement on Solana.

The product is designed for real adoption because it focuses on things people already pay for: small paid products and checkout validation. KIRAPAY removes the largest checkout barrier by abstracting chain, token, bridging, and gas complexity.

Live demo: https://kira-ivory.vercel.app/

## Problem

Crypto payments are still fragmented. A Solana merchant may want SOL settlement, while a customer holds funds on another chain. Asking the customer to bridge, swap, and manage gas creates drop-off. This is especially painful for mainstream use cases where the user only wants the product, not a crypto operations tutorial.

## Solution

KiraLaunch turns checkout into an intent:

1. Merchant publishes the KIRAPAY Test Product.
2. Buyer chooses the product.
3. Backend creates a live KIRAPAY payment link with price, order metadata, Solana settlement wallet, and configured Solana output token.
4. Buyer completes hosted KIRAPAY checkout from the chain and token they already use.
5. KIRAPAY settles the merchant's funds on Solana.
6. Webhook or reconciliation confirms completion and unlocks the Solana pass.

## Technical Architecture

Frontend:

- Next.js App Router UI.
- Single live test product for payment validation.
- Checkout creation button that calls the local backend.
- API evidence panel that displays the generated KIRAPAY payload.
- Merchant reconciliation panel for transaction status.

Backend:

- `POST /api/checkout` creates a KIRAPAY payment link.
- `GET /api/transactions` fetches merchant transactions from KIRAPAY.
- `POST /api/webhooks/kirapay` receives payment events and identifies the fulfillment action.

KIRAPAY:

- `POST /link/generate` creates the hosted checkout URL from a server-side request.
- `GET /wallet/transactions` supports merchant reconciliation.
- API key is never exposed to the browser.
- Live mode is enabled with `KIRAPAY_DEMO_MODE=false` on deployment.

Solana:

- Settlement receiver is a Solana merchant wallet.
- Completion events are the trigger for minting or unlocking a pass.
- The current prototype models the fulfillment layer and is ready for an on-chain mint/receipt program.

## KIRAPAY Depth

KIRAPAY is the central enabler, not an optional payment button. Without KIRAPAY, KiraLaunch cannot solve its core problem: selling Solana utility to buyers with funds spread across other chains and tokens.

The app demonstrates:

- Payment link generation.
- Hosted cross-chain checkout.
- Solana settlement configuration.
- Server-side secret handling.
- Transaction reconciliation.
- Webhook-driven fulfillment design.

## Scalability

The flow scales because checkout creation is stateless, KIRAPAY handles cross-chain routing, and fulfillment can be processed asynchronously through webhook events. A production deployment would add a database-backed order table, idempotent webhook handling, and a queue for Solana mint or unlock operations.

## Demo Notes

The deployed prototype is configured for live mode:

- `KIRAPAY_API_KEY` is stored only in Vercel environment variables.
- `KIRAPAY_DEMO_MODE=false` forces checkout creation through KIRAPAY's API.
- Solana settlement is configured server-side through `Address` and `tokenOut`, while the API key remains private in Vercel environment variables.

A local fallback mode remains available for reviewers without a merchant API key, but the submitted deployment is intended to demonstrate live KIRAPAY payment-link generation and transaction verification.
