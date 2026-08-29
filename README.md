# 🚗 Car Deal Analyzer

### 🔗 **[Open the live site →](https://duncanburns2013-dot.github.io/Car-Dealership-Value/)**

**Know what the dealership knows — before you sign.** A free, no-signup tool that exposes the tactics dealers use and helps you sanity-check whether a car deal is actually fair.

## What it does

- **Loan stretch** — shows how stretching a loan term secretly creates monthly "leg" the finance office uses to load on add-ons.
- **Lease vs. Buy** — decodes the dealer's hidden "money factor" (× 2400 = your real APR) and compares a lease against buying on net cost, counting the equity you keep.
- **Trade-in** — organize outside appraisals (CarMax, Carvana, dealers) and instantly spot a lowball offer.
- **Finance office** — the *true* cost of add-ons (extended warranty, GAP, paint, etc.), interest included.
- **Deal score** — a live 0–100 score with red flags, plus average APR by credit tier.
- **Learn** — plain-English explainers on APR, loan terms, negative equity, and leasing.

## Data sources

Benchmark figures are current as of **August 2026** and come from:

- **APR by credit tier, amount financed, lease share** — Experian, *State of the Automotive Finance Market*, Q1 2026 (VantageScore 4.0).
- **Loan terms, negative equity, average payment** — Edmunds quarterly new-vehicle reports, Q2 2026.
- **Disclosure rules** — Truth in Lending Act (CFPB/FTC).

Experian publishes roughly a quarter in arrears, so re-check `CREDIT_TIERS` and the `EXPLAINERS` stats each quarter.

## Tech

Vite + React single-page app. Every push to `main` auto-deploys to GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```
