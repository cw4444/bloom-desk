"use client";

import { useState, useCallback } from "react";
import {
  DEMO_DMS,
  CURRENT_STOCK,
  processDM,
  type ProcessedResult,
} from "@/lib/demo-data";

// ─── Icons ───────────────────────────────────────────────────────────
function FlowerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0 9-9c0-3-2-5.5-4.5-7C14.5 3.5 12 3 12 3s-2.5.5-4.5 2C5 6.5 3 9 3 12a9 9 0 0 0 9 9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c-3 0-6-1.5-7.5-3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c3 0 6-1.5 7.5-3" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3a2.25 2.25 0 0 0-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────
function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        active
          ? "bg-accent text-white"
          : "text-muted hover:text-foreground hover:bg-accent-muted"
      }`}
    >
      {children}
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return (
    <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-card-border hover:bg-accent-muted text-muted hover:text-foreground transition-all">
      {copied ? <><CheckIcon className="w-3.5 h-3.5 text-success" /> Copied</> : <><ClipboardIcon className="w-3.5 h-3.5" /> Copy</>}
    </button>
  );
}

function VibeBadge({ vibe }: { vibe: string }) {
  const colours: Record<string, string> = {
    wild: "bg-sage-muted text-sage border-sage/20",
    romantic: "bg-pink-50 text-pink-600 border-pink-200",
    elegant: "bg-purple-50 text-purple-600 border-purple-200",
    modern: "bg-slate-100 text-slate-600 border-slate-200",
    bold: "bg-red-50 text-red-600 border-red-200",
    cheerful: "bg-yellow-50 text-yellow-700 border-yellow-200",
    classic: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colours[vibe] ?? colours.classic}`}>
      {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
    </span>
  );
}

function ProcessingDots() {
  return (
    <div className="flex items-center justify-center gap-2 py-20">
      <span className="text-lg bloom-1">🌸</span>
      <span className="text-lg bloom-2">🌿</span>
      <span className="text-lg bloom-3">💐</span>
      <span className="ml-3 text-muted text-sm">Building your bouquet...</span>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function Home() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"recipe" | "email" | "stock">("recipe");

  const handleProcess = useCallback(() => {
    if (!message.trim()) return;
    setProcessing(true);
    setResult(null);
    setTimeout(() => {
      setResult(processDM(message));
      setProcessing(false);
      setActiveTab("recipe");
    }, 1600);
  }, [message]);

  const loadDemo = useCallback((text: string) => {
    setMessage(text);
    setResult(null);
  }, []);

  return (
    <div className="min-h-full">
      {/* ─── Header ────────────────────────────────────────── */}
      <header className="border-b border-card-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <FlowerIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Bloom Desk</h1>
              <p className="text-xs text-muted">DM → Bouquet → Payment link</p>
            </div>
          </div>
          <span className="text-xs text-muted bg-accent-muted border border-accent/10 px-3 py-1.5 rounded-full">
            Demo Mode
          </span>
        </div>
      </header>

      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="border-b border-card-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-muted border border-sage/15 text-sage text-xs font-medium mb-6">
            <FlowerIcon className="w-3.5 h-3.5" />
            Built for UK Florists
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Messy DM in.
            <br />
            <span className="text-accent">Beautiful quote out.</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto text-base sm:text-lg">
            Paste an Instagram DM, WhatsApp message, or email. Bloom Desk
            extracts the brief, builds a flower recipe from your stock, and
            drafts a payment link email — in seconds.
          </p>
        </div>
      </section>

      {/* ─── Main App ──────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* ─── Left: Input ──────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                Customer Message
              </h3>
              <span className="text-xs text-muted">
                {message.length > 0
                  ? `${message.split(/\s+/).filter(Boolean).length} words`
                  : "Paste a DM or try a demo"}
              </span>
            </div>

            <textarea
              value={message}
              onChange={(e) => { setMessage(e.target.value); setResult(null); }}
              placeholder={`Paste a customer DM here...\n\ne.g. "Hiya! I want something wild for my mum's 60th, maybe £50?"`}
              className="w-full h-44 sm:h-52 p-4 rounded-xl bg-card border border-card-border text-foreground placeholder:text-muted/40 resize-none focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all text-sm leading-relaxed"
            />

            {/* Demo buttons */}
            <div className="space-y-2">
              <p className="text-xs text-muted font-medium">Try a demo:</p>
              <div className="flex flex-wrap gap-2">
                {DEMO_DMS.map((d) => (
                  <button
                    key={d.label}
                    onClick={() => loadDemo(d.message)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-card-border text-sm hover:border-accent/40 hover:bg-accent-muted transition-all"
                  >
                    <span>{d.icon}</span>
                    <span className="text-muted">{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Process button */}
            <button
              onClick={handleProcess}
              disabled={!message.trim() || processing}
              className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Building bouquet...
                </>
              ) : (
                <>
                  <FlowerIcon className="w-4 h-4" />
                  Build Quote
                </>
              )}
            </button>

            {/* How it works */}
            <div className="rounded-xl bg-card border border-card-border p-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                The Pipeline
              </h4>
              <div className="space-y-2 text-sm text-muted">
                {[
                  ["1.", "Customer sends vague DM on any platform"],
                  ["2.", "AI extracts budget, date, occasion & vibe"],
                  ["3.", "Recipe engine matches stems to your live stock"],
                  ["4.", "Calculates costs, delivery fee & your margin"],
                  ["5.", "Drafts a professional payment link email"],
                ].map(([n, text]) => (
                  <div key={text} className="flex items-start gap-2.5">
                    <span className="text-accent font-bold mt-0.5">{n}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Right: Output ─────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                Bloom Desk Output
              </h3>
              {result && <div className="w-2 h-2 rounded-full bg-success animate-pulse" />}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-card rounded-xl border border-card-border">
              <Tab active={activeTab === "recipe"} onClick={() => setActiveTab("recipe")}>Recipe & Cost</Tab>
              <Tab active={activeTab === "email"} onClick={() => setActiveTab("email")}>Payment Email</Tab>
              <Tab active={activeTab === "stock"} onClick={() => setActiveTab("stock")}>Current Stock</Tab>
            </div>

            {/* Output panels */}
            <div className="rounded-xl bg-card border border-card-border min-h-[420px] overflow-hidden">
              {processing ? (
                <ProcessingDots />
              ) : activeTab === "stock" ? (
                /* ─── Stock Tab (always visible) ─────────── */
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Seasonal Stock — Spring
                    </h4>
                    <span className="text-xs text-muted">{CURRENT_STOCK.length} lines</span>
                  </div>
                  <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                    {CURRENT_STOCK.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-background rounded-lg px-3 py-2 text-sm"
                      >
                        <div>
                          <span className="font-medium">{s.name}</span>
                          <span className="text-muted ml-1.5">({s.colour})</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted">
                          <span>£{s.pricePerStem.toFixed(2)}/stem</span>
                          <span className="font-mono">{s.available} avail</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted italic">
                    This stock list is editable per client — connect to your POS or update manually.
                  </p>
                </div>
              ) : !result ? (
                <div className="flex flex-col items-center justify-center h-[420px] text-muted text-sm">
                  <FlowerIcon className="w-10 h-10 mb-3 opacity-20" />
                  <p>Paste a customer message and hit &quot;Build Quote&quot;</p>
                  <p className="text-xs mt-1">or check the Current Stock tab</p>
                </div>
              ) : (
                <div className="p-4 sm:p-5">
                  {/* ─── Recipe Tab ─────────────────────── */}
                  {activeTab === "recipe" && (
                    <div className="space-y-5">
                      {/* Extracted brief */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                          Extracted Brief
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            ["Occasion", result.extracted.occasion],
                            ["Recipient", result.extracted.recipient],
                            ["Date", result.extracted.date],
                            ["Budget", result.extracted.budget ? `£${result.extracted.budget}` : "Not specified"],
                          ].map(([label, value]) => (
                            <div key={label} className="bg-background rounded-lg px-3 py-2">
                              <div className="text-xs text-muted">{label}</div>
                              <div className="text-sm font-medium">{value}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <VibeBadge vibe={result.extracted.vibe} />
                          {result.extracted.delivery && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                              Delivery Required
                            </span>
                          )}
                          {result.extracted.notes !== "None" && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-background text-muted border border-card-border">
                              {result.extracted.notes}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Flower recipe */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                          Suggested Recipe
                        </h4>
                        <div className="space-y-1.5">
                          {result.recipe.stems.map((s, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between bg-background rounded-lg px-3 py-2.5 text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent" />
                                <span className="font-medium">{s.flower.name}</span>
                                <span className="text-muted text-xs">({s.flower.colour})</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-muted">x{s.qty}</span>
                                <span className="font-medium">£{s.cost.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                          <div className="flex items-center gap-2 bg-sage-muted rounded-lg px-3 py-2.5 text-sm text-sage">
                            <span className="w-2 h-2 rounded-full bg-sage" />
                            <span>{result.recipe.greenery}</span>
                          </div>
                        </div>
                      </div>

                      {/* Costing */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                          Costing
                        </h4>
                        <div className="bg-background rounded-xl p-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted">Stems subtotal</span>
                            <span>£{result.recipe.subtotal.toFixed(2)}</span>
                          </div>
                          {result.recipe.delivery_fee > 0 && (
                            <div className="flex justify-between">
                              <span className="text-muted">Delivery</span>
                              <span>£{result.recipe.delivery_fee.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted">Wrapping, labour & margin</span>
                            <span>£{(result.recipe.total - result.recipe.subtotal - result.recipe.delivery_fee).toFixed(2)}</span>
                          </div>
                          <div className="border-t border-card-border pt-2 flex justify-between font-semibold">
                            <span>Customer total</span>
                            <span className="text-accent">£{result.recipe.total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-success">
                            <span>Your margin</span>
                            <span>{result.recipe.margin_pct}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─── Email Tab ──────────────────────── */}
                  {activeTab === "email" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                          Payment Link Email
                        </h4>
                        <CopyButton text={result.email_draft} />
                      </div>
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 bg-background rounded-lg p-4 font-sans max-h-[450px] overflow-y-auto">
                        {result.email_draft}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Features Grid ──────────────────────────────── */}
        <div className="mt-16 grid sm:grid-cols-3 gap-4">
          {[
            {
              title: "Any Platform",
              desc: "Instagram DMs, WhatsApp, email, even texts — paste it in, we extract the order.",
              n: "1",
            },
            {
              title: "Stock-Aware Recipes",
              desc: "Suggests stems from YOUR seasonal stock list. No more quoting flowers you don't have.",
              n: "2",
            },
            {
              title: "One-Click Payment",
              desc: "Drafts a polite, professional email with a payment link. No more chasing invoices.",
              n: "3",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl bg-card border border-card-border p-5 space-y-2"
            >
              <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center text-sm font-bold">
                {f.n}
              </span>
              <h4 className="font-semibold text-sm">{f.title}</h4>
              <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ─── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-card-border mt-auto bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between text-xs text-muted">
          <span>Bloom Desk — Proof of Concept</span>
          <span>Customise this for your floristry</span>
        </div>
      </footer>
    </div>
  );
}
