# KiraLaunch Submission Write-Up

## Concept

KiraLaunch helps Solana builders sell paid utility to users who may not hold Solana assets. A buyer can purchase a creator pass, event ticket, or SaaS seat from any supported chain through KIRAPAY. The merchant receives predictable USDC settlement on Solana, then the app unlocks the purchased utility.

The product is designed for real adoption because it focuses on things people already pay for: memberships, tickets, and software seats. KIRAPAY removes the largest checkout barrier by abstracting chain, token, bridging, and gas complexity.

## Problem

Crypto payments are still fragmented. A Solana merchant may want USDC on Solana, while a customer holds funds on another chain. Asking the customer to bridge, swap, and manage gas creates drop-off. This is especially painful for mainstream use cases where the user only wants the product, not a crypto operations tutorial.

## Solution

KiraLaunch turns checkout into an intent:

1. Merchant publishes a Solana-native product.
2. Buyer chooses the product.
3. Backend creates a KIRAPAY payment link with price, currency, Solana receiver, and redirect URL.
4. Buyer completes hosted KIRAPAY checkout from the chain and token they already use.
5. KIRAPAY settles the merchant's funds on Solana.
6. Webhook or reconciliation confirms completion and unlocks the Solana pass.

## Technical Architecture

Frontend:

- Next.js App Router UI.
- Product catalog for three high-adoption verticals.
- Checkout creation button that calls the local backend.
- API evidence panel that displays the generated KIRAPAY payload.
- Merchant reconciliation panel for transaction status.

Backend:

- `POST /api/checkout` creates a KIRAPAY payment link.
- `GET /api/transactions` fetches merchant transactions from KIRAPAY.
- `POST /api/webhooks/kirapay` receives payment events and identifies the fulfillment action.

KIRAPAY:

- `POST /link/generate` creates the hosted checkout URL.
- `GET /wallet/transactions` supports merchant reconciliation.
- API key is never exposed to the browser.

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

The prototype supports two modes:

- Live mode with `KIRAPAY_API_KEY` and `KIRAPAY_DEMO_MODE=false`.
- Demo mode with deterministic checkout and transaction data for judge review.

This makes the project easy to run while still showing the exact production integration boundary.
