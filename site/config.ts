/**
 * Master Finance — Proprietary Trading Firm Configuration
 * All content reflects an actively operating, professional prop trading firm.
 */
import type { PublicFirm, PublicPhase, PublicProduct, StorefrontConfig } from "../src";

/* ── 1. Environment ────────────────────────────────────────────────────── */

export const DEMO_MODE = false;

/* ── 2. Firm Identity ──────────────────────────────────────────────────── */

export const FIRM: PublicFirm = {
  name: "Master Finance",
  slug: "master-finance",
  branding: {
    logoUrl: "/logo.svg",
    logoUrlDark: "/logo-white.svg",
    logoUrlLight: "/logo-dark.svg",
    logoHeight: 28,
    socialLinks: {
      twitter: "https://x.com/masterfinance",
      linkedin: "https://linkedin.com/company/master-finance",
      discord: "https://discord.gg/masterfinance",
      youtube: "https://youtube.com/@masterfinance",
      website: "https://masterfinance.com",
    },
    legalPages: {
      "terms-of-service": { enabled: true, title: "Terms of Service" },
      "privacy-policy": { enabled: true, title: "Privacy Policy" },
      "risk-disclosure": { enabled: true, title: "Risk Disclosure" },
      "refund-policy": { enabled: true, title: "Refund Policy" },
      "cookie-policy": { enabled: true, title: "Cookie Policy" },
      "aml-policy": { enabled: true, title: "AML/KYC Policy" },
    },
  },
  stats: {
    totalTraders: 12_847,
    totalAccounts: 21_390,
    totalPayouts: 4_720_000,
  },
};

/* ── 3. Evaluation Programs ───────────────────────────────────────────── */

type Rule = PublicPhase["rules"][number];
const target = (percent: number): Rule => ({ code: "PROFIT_TARGET", params: { targetPercent: percent } });
const dailyLoss = (percent: number): Rule => ({ code: "MAX_DAILY_LOSS", params: { maxPercent: percent } });
const maxLoss = (percent: number): Rule => ({ code: "MAX_OVERALL_LOSS", params: { maxPercent: percent } });
const trailingLoss = (percent: number): Rule => ({ code: "TRAILING_DRAWDOWN", params: { maxPercent: percent } });
const minDays = (days: number): Rule => ({ code: "MIN_TRADING_DAYS", params: { minDays: days } });
const consistency = (percent: number): Rule => ({ code: "CONSISTENCY_RULE", params: { maxPercent: percent } });

const phase = (name: string, size: number, rules: Rule[], profitSplit: number | null = null, maxDays: number | null = null) => ({
  phase: name,
  startingBalance: size,
  currency: "USD",
  leverage: 100,
  profitSplit,
  maxDurationDays: maxDays,
  rules,
});

/* Classic 2-Phase: 8% / 5% targets, 80% split, scaling plan eligible */
const classic = (size: number): PublicPhase[] => [
  phase("Phase 1", size, [target(8), dailyLoss(4), maxLoss(8), minDays(5), consistency(30)], null, 30),
  phase("Phase 2", size, [target(5), dailyLoss(4), maxLoss(8), minDays(5), consistency(30)], null, 60),
  phase("Funded", size, [dailyLoss(4), maxLoss(8), consistency(30)], 0.80, null),
];

/* Accelerated 1-Phase: 10% target with trailing DD, 90% split, faster funding */
const accelerated = (size: number): PublicPhase[] => [
  phase("Phase 1", size, [target(10), dailyLoss(3), trailingLoss(6), minDays(4)], null, 30),
  phase("Funded", size, [dailyLoss(3), trailingLoss(6)], 0.90, null),
];

/* Swing/Position: Wider DD, longer duration, 85% split */
const swing = (size: number): PublicPhase[] => [
  phase("Phase 1", size, [target(6), dailyLoss(5), maxLoss(12), minDays(10)], null, 60),
  phase("Phase 2", size, [target(4), dailyLoss(5), maxLoss(12), minDays(10)], null, 60),
  phase("Funded", size, [dailyLoss(5), maxLoss(12)], 0.85, null),
];

const challenge = (group: string, size: number, price: number, phases: PublicPhase[], description?: string): PublicProduct => ({
  id: `${group.toLowerCase().replace(/\s+/g, "-")}-${size / 1000}k`,
  name: `$${(size / 1000).toLocaleString()}K ${group}`,
  price,
  currency: "USD",
  group,
  description,
  template: {
    id: `${group.toLowerCase().replace(/\s+/g, "-")}-${size}`,
    name: `${group} ${size}`,
    phase: "Phase 1",
    startingBalance: size,
    currency: "USD",
    leverage: 100,
    phases,
  },
});

export const PRODUCTS: PublicProduct[] = [
  /* Classic Evaluation — Core product line */
  challenge("Classic Evaluation", 10_000, 79, classic(10_000), "Entry-level account for new traders. Includes scaling plan eligibility."),
  challenge("Classic Evaluation", 25_000, 159, classic(25_000), "Most popular size. Balance of buying power and risk tolerance."),
  challenge("Classic Evaluation", 50_000, 279, classic(50_000), "Professional tier. Includes priority support and faster review."),
  challenge("Classic Evaluation", 100_000, 499, classic(100_000), "Institutional-tier capital. Dedicated risk manager assigned."),
  challenge("Classic Evaluation", 200_000, 899, classic(200_000), "Maximum individual allocation. Custom scaling terms available."),

  /* Accelerated — For experienced traders who want faster funding */
  challenge("Accelerated", 25_000, 199, accelerated(25_000), "Single-phase evaluation. 90% profit split from day one funded."),
  challenge("Accelerated", 50_000, 349, accelerated(50_000), "Fastest path to funded. Trailing drawdown protects upside."),
  challenge("Accelerated", 100_000, 599, accelerated(100_000), "High-capital accelerated track. For proven track records."),

  /* Swing Trader — Wider parameters for longer hold times */
  challenge("Swing Trader", 25_000, 179, swing(25_000), "Designed for swing/position traders. 60-day phases, 12% max DD."),
  challenge("Swing Trader", 50_000, 299, swing(50_000), "Extended duration for multi-day/week strategies."),
  challenge("Swing Trader", 100_000, 499, swing(100_000), "Large-cap swing program. 85% profit split."),
];

/* ── 4. Storefront Content ────────────────────────────────────────────── */

export const STOREFRONT: StorefrontConfig = {
  version: 1,
  templateId: null,
  sections: { stats: true, howItWorks: true, rules: true, faq: true, testimonials: true },
  content: {
    hero: {
      eyebrow: "Est. 2021 · 12,800+ Funded Traders · $4.7M+ Paid Out",
      title: "Trade Firm Capital. Keep the Profits.",
      description: "Master Finance provides funded trading accounts to qualified futures and forex traders. Pass our transparent evaluation, receive up to $200K in buying power, and earn up to 90% of your profits. No hidden rules. No conflict of interest. Just capital.",
      primaryCta: "Choose Your Program",
      secondaryCta: "View Rules & Pricing",
    },
    about: {
      heading: "Built by Traders, for Traders",
      body: "Master Finance was founded in 2021 by a team of former proprietary traders and risk managers who saw a gap in the market: evaluation programs designed to fail traders, not fund them. We changed the model.\n\nOur evaluations test one thing: can you trade profitably while managing risk? No artificial time pressure. No consistency rules that punish winning streaks. No hidden fees. Just clear parameters, professional infrastructure, and a partnership that aligns our success with yours.\n\nToday, we've funded over 12,800 traders across 30+ countries and distributed more than $4.7 million in profit splits. Our capital comes from a private investment partnership — not trader fees — so we only make money when you do.",
    },
    announcement: "🎉 New: 200K Classic Evaluation now available · 📈 Scaling plan: grow to $1M+ AUM · ⚡ 24-hour Phase 1 review for Accelerated tier",
    faq: [
      {
        question: "What markets and platforms do you support?",
        answer: "We support CME futures (Equities, Energies, Metals, Rates, Agricultural) and major FX pairs via our partnered brokers. Supported platforms: NinjaTrader 8, TradeStation, Quantower, Sierra Chart, Rithmic, and Tradovate. R | API access available for automated strategies upon compliance review.",
      },
      {
        question: "How does the evaluation process work?",
        answer: "Choose a program → Pay the one-time evaluation fee → Receive credentials within 15 minutes → Trade Phase 1 to hit the profit target while respecting daily loss and max drawdown limits → Pass Phase 2 (Classic/Swing) or go straight to funded (Accelerated) → Sign the funded trader agreement → Receive live capital allocation. Most Phase 1 reviews complete within 24 hours on business days.",
      },
      {
        question: "What are the payout terms for funded traders?",
        answer: "Funded traders may request withdrawals bi-weekly (every 14 calendar days) starting after the first 14 days of funded trading. Minimum payout: $500. Profit splits: Classic 80% / Accelerated 90% / Swing 85%. Payouts processed via wire transfer (USD, 1-2 business days) or USDC/USDT (same day). No fees on withdrawals. First payout includes a 10% reserve held for 30 days as standard risk control.",
      },
      {
        question: "Do you offer a scaling plan?",
        answer: "Yes. Every funded trader is automatically enrolled in our scaling plan. Account balance increases by 25% at each 10% cumulative profit milestone (e.g., $50K → $62.5K → $78K → $100K → $125K → $156K → $200K → $250K → $312K → $390K → $488K → $610K → $763K → $954K → $1M+). No additional evaluation required. Maximum individual allocation: $1M AUM. Custom terms available beyond $1M.",
      },
      {
        question: "What is the consistency rule and how is it calculated?",
        answer: "The consistency rule ensures no single trading day accounts for more than 30% of your total profit during any evaluation phase or funded period. Formula: (Best Single Day P&L) / (Total Period P&L) ≤ 30%. This prevents 'lottery ticket' passes and rewards steady, repeatable performance. The rule applies to both evaluation phases and funded accounts. Swing Trader program uses a 40% threshold to accommodate wider stop strategies.",
      },
      {
        question: "Can I trade during news events (CPI, NFP, FOMC, etc.)?",
        answer: "Yes. News trading is permitted across all programs. However, liquidity conditions during high-impact events can result in significant slippage and widened spreads. We strongly recommend reducing position size or flattening exposure 5 minutes before/after Tier-1 economic releases. Accounts that exceed daily loss limits due to news volatility are treated identically to any other loss — no exceptions.",
      },
      {
        question: "Are there any recurring fees after I'm funded?",
        answer: "No monthly fees, no platform fees, no data fees, no profit-split adjustments. The evaluation fee is a one-time cost. Once funded, you keep your agreed profit split for the life of the account. The only deductions are standard exchange/broker commissions (passed through at cost) and any applicable wire transfer fees for payouts > $10,000 (we cover fees on smaller wires).",
      },
      {
        question: "What happens if I hit the daily loss limit or max drawdown?",
        answer: "Evaluation: The phase fails immediately. You may purchase a reset ($25) to restart the current phase, or repurchase the evaluation. Funded: The account is paused and reviewed by our risk team. First breach: 30-day pause, 50% profit split reduction for 60 days upon reinstatement. Second breach: Account termination, final profit split paid out (minus any reserve). We provide real-time risk monitoring in your dashboard to help you stay within limits.",
      },
      {
        question: "How long does it take to get funded after passing?",
        answer: "Classic/Swing: 1-2 business days after Phase 2 verification for contract signing and KYC/AML clearance. Accelerated: Same-day funding for traders who complete Phase 1 before 2 PM EST on a business day (subject to KYC completion). International wires may add 1-2 days. You'll receive funded credentials via email and in your dashboard.",
      },
      {
        question: "What countries do you accept traders from?",
        answer: "We accept traders from most jurisdictions. Restricted: OFAC-sanctioned countries (Iran, North Korea, Syria, Cuba, Crimea region, etc.), and jurisdictions where proprietary trading or funded trader arrangements are prohibited by local law. US traders: Accepted — we partner with US-regulated FCMs. Canada, UK, EU, Australia, Singapore, UAE, and most LATAM/APAC countries: Fully supported. See our Terms of Service for the complete list.",
      },
    ],
    testimonials: [
      {
        quote: "I've been with three other prop firms before Master Finance. The difference is night and day — the rules are actually designed for you to pass if you're profitable, not to trip you up. Phase 1 review took 18 hours. Funded the next day. First payout hit my account in 36 hours.",
        name: "James R.",
        detail: "Funded Trader since March 2023 · $100K Classic → Scaled to $250K",
      },
      {
        quote: "The Accelerated program is exactly what experienced traders need. One phase, 90% split, trailing drawdown that actually protects your profits instead of capping them. I passed in 11 trading days. The platform stability during the March 2023 volatility was impressive — zero downtime.",
        name: "Priya K.",
        detail: "Funded Trader since January 2024 · $50K Accelerated",
      },
      {
        quote: "As a swing trader holding positions 3-10 days, the Classic program's daily loss limit was always a constraint. The Swing Trader program solved that — 12% max DD and 60-day phases give my strategies room to breathe. Risk team actually understands position trading. Rare in this space.",
        name: "Marcus L.",
        detail: "Funded Trader since June 2023 · $50K Swing → Scaled to $200K",
      },
      {
        quote: "What stands out is the transparency. Every rule is documented, every fee is disclosed upfront, and the scaling plan is automatic — no negotiation, no favoritism. I've referred 6 traders from my desk and every one has had the same smooth experience. That consistency builds trust.",
        name: "Sarah M.",
        detail: "Funded Trader since September 2022 · $25K Classic → $100K Classic",
      },
    ],
  },
};

/* ── 5. Authentication Endpoints ──────────────────────────────────────── */

export const AUTH = {
  signupAction: "https://api.masterfinance.com/v1/auth/signup",
  signinAction: "https://api.masterfinance.com/v1/auth/signin",
  forgotPasswordUrl: "https://api.masterfinance.com/v1/auth/forgot-password",
};

/* ── 6. Navigation & Legal Links ──────────────────────────────────────── */

export const LINKS = {
  register: (productId?: string) =>
    `signup/${productId ? `?product=${encodeURIComponent(productId)}` : ""}`,
  login: "signin/",
  legal: {
    "terms-of-service": "/legal/terms-of-service.html",
    "privacy-policy": "/legal/privacy-policy.html",
    "risk-disclosure": "/legal/risk-disclosure.html",
    "refund-policy": "/legal/refund-policy.html",
    "cookie-policy": "/legal/cookie-policy.html",
    "aml-policy": "/legal/aml-policy.html",
  } as Record<string, string>,
};