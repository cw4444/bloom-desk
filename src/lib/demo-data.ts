// ─── Types ───────────────────────────────────────────────────────────
export interface StockItem {
  name: string;
  colour: string;
  pricePerStem: number;
  available: number;
  season: string[];
  vibes: string[]; // matches against extracted vibe
}

export interface ExtractedOrder {
  recipient: string;
  occasion: string;
  date: string;
  budget: number | null;
  vibe: string;
  delivery: boolean;
  notes: string;
}

export interface RecipeStem {
  flower: StockItem;
  qty: number;
  cost: number;
}

export interface FlowerRecipe {
  stems: RecipeStem[];
  greenery: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  margin_pct: number;
}

export interface ProcessedResult {
  extracted: ExtractedOrder;
  recipe: FlowerRecipe;
  email_draft: string;
}

// ─── Current Stock (seasonal, mid-spring UK) ─────────────────────────
export const CURRENT_STOCK: StockItem[] = [
  { name: "David Austin Rose", colour: "Blush Pink", pricePerStem: 4.5, available: 80, season: ["spring", "summer"], vibes: ["romantic", "classic", "elegant", "luxury"] },
  { name: "Ranunculus", colour: "Peach", pricePerStem: 3.0, available: 120, season: ["spring"], vibes: ["wild", "romantic", "soft", "garden"] },
  { name: "Tulip", colour: "White", pricePerStem: 1.8, available: 200, season: ["spring"], vibes: ["clean", "modern", "minimal", "classic"] },
  { name: "Tulip", colour: "Deep Purple", pricePerStem: 1.8, available: 150, season: ["spring"], vibes: ["bold", "dramatic", "modern", "wild"] },
  { name: "Anemone", colour: "White & Black Centre", pricePerStem: 2.5, available: 90, season: ["spring", "winter"], vibes: ["modern", "dramatic", "bold", "wild"] },
  { name: "Sweet Pea", colour: "Lilac", pricePerStem: 2.0, available: 100, season: ["spring", "summer"], vibes: ["wild", "garden", "soft", "romantic", "whimsical"] },
  { name: "Peony", colour: "Coral", pricePerStem: 5.5, available: 40, season: ["spring"], vibes: ["luxury", "romantic", "classic", "showstopper"] },
  { name: "Spray Rose", colour: "Ivory", pricePerStem: 2.8, available: 100, season: ["all"], vibes: ["classic", "elegant", "romantic", "soft"] },
  { name: "Lisianthus", colour: "Lavender", pricePerStem: 3.2, available: 60, season: ["spring", "summer"], vibes: ["elegant", "soft", "romantic", "luxury"] },
  { name: "Carnation", colour: "Hot Pink", pricePerStem: 1.2, available: 250, season: ["all"], vibes: ["bold", "fun", "cheerful", "bright"] },
  { name: "Chrysanthemum", colour: "Yellow", pricePerStem: 1.5, available: 180, season: ["all"], vibes: ["cheerful", "bright", "fun", "garden"] },
  { name: "Sunflower", colour: "Golden", pricePerStem: 2.5, available: 70, season: ["summer"], vibes: ["cheerful", "bold", "bright", "fun", "wild"] },
  { name: "Dahlia", colour: "Burgundy", pricePerStem: 4.0, available: 50, season: ["summer", "autumn"], vibes: ["dramatic", "luxury", "bold", "showstopper"] },
  { name: "Eucalyptus", colour: "Silver Green", pricePerStem: 1.5, available: 300, season: ["all"], vibes: ["wild", "modern", "garden", "minimal"] },
  { name: "Gypsophila", colour: "White", pricePerStem: 1.0, available: 400, season: ["all"], vibes: ["wild", "whimsical", "romantic", "soft", "garden"] },
];

const GREENERY_OPTIONS = [
  "Eucalyptus cinerea + Italian ruscus",
  "Mixed foliage (pistache, salal, eucalyptus)",
  "Trailing ivy + soft ruscus",
  "Minimal — eucalyptus parvifolia only",
  "Lush — asparagus fern, eucalyptus, pittosporum",
];

// ─── Demo DMs ────────────────────────────────────────────────────────
export const DEMO_DMS = [
  {
    label: "Instagram — Wild Bouquet",
    icon: "📸",
    platform: "Instagram DM",
    message: `Hiya! I want something really wild and natural looking for my mum's 60th birthday next Saturday. She loves those messy garden-style ones if you know what I mean 😍 Budget is around £50 maybe a bit more if it's gonna be amazing. Can you deliver to LS8? Thanks!! x`,
  },
  {
    label: "WhatsApp — Anniversary",
    icon: "💬",
    platform: "WhatsApp",
    message: `Hi there, my wife and I have our 10th anniversary on the 15th and I'd like to surprise her with something really elegant and romantic. She loves peonies and roses, proper luxury looking. Happy to spend £80-100. I'll collect from the shop if that's easier. Cheers`,
  },
  {
    label: "Email — Corporate Event",
    icon: "📧",
    platform: "Email",
    message: `Good morning,

We're hosting a client dinner on Friday 25th April and need 4 table centrepieces. Looking for something modern and dramatic — think dark purples, whites, very striking. Budget is £200 for all four arrangements. Delivery to our office on Albion Street please.

Kind regards,
Sarah Thompson
Apex Legal LLP`,
  },
];

// ─── Vibe Keyword Map ────────────────────────────────────────────────
const VIBE_KEYWORDS: Record<string, string[]> = {
  wild: ["wild", "messy", "natural", "garden", "loose", "meadow", "rustic", "undone", "organic"],
  romantic: ["romantic", "love", "anniversary", "rose", "roses", "peony", "peonies", "soft", "blush"],
  elegant: ["elegant", "luxury", "luxurious", "classy", "sophisticated", "premium", "high-end"],
  modern: ["modern", "minimal", "clean", "contemporary", "striking", "architectural", "dramatic"],
  bold: ["bold", "dramatic", "dark", "striking", "statement", "wow", "showstopper", "impact"],
  cheerful: ["cheerful", "bright", "fun", "colourful", "colorful", "happy", "vibrant", "sunny"],
  classic: ["classic", "traditional", "timeless", "formal"],
};

// ─── Extraction Logic ────────────────────────────────────────────────
export function extractOrder(message: string): ExtractedOrder {
  const lower = message.toLowerCase();

  // Budget
  let budget: number | null = null;
  const budgetMatch = lower.match(/£(\d+)(?:\s*[-–—]\s*£?(\d+))?/);
  if (budgetMatch) {
    budget = budgetMatch[2]
      ? Math.round((parseInt(budgetMatch[1]) + parseInt(budgetMatch[2])) / 2)
      : parseInt(budgetMatch[1]);
  }

  // Date
  let date = "Not specified";
  const datePatterns = [
    /(?:on|next|this)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
    /(\d{1,2})(?:st|nd|rd|th)?\s*(?:of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)/i,
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/i,
    /(?:next|this)\s+(saturday|sunday|week|friday)/i,
    /(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/,
  ];
  for (const p of datePatterns) {
    const m = message.match(p);
    if (m) {
      date = m[0];
      break;
    }
  }

  // Occasion
  let occasion = "Not specified";
  const occasions: [RegExp, string][] = [
    [/birthday|bday/i, "Birthday"],
    [/anniversary/i, "Anniversary"],
    [/wedding/i, "Wedding"],
    [/funeral|sympathy|condolence/i, "Sympathy"],
    [/mother'?s?\s*day|mum'?s?\s*day/i, "Mother's Day"],
    [/valentine/i, "Valentine's Day"],
    [/corporate|client|office|event|dinner/i, "Corporate Event"],
    [/thank\s*you/i, "Thank You"],
    [/get\s*well/i, "Get Well"],
    [/new\s*baby|baby\s*shower/i, "New Baby"],
  ];
  for (const [re, label] of occasions) {
    if (re.test(lower)) {
      occasion = label;
      break;
    }
  }

  // Recipient
  let recipient = "Not specified";
  const recipientPatterns = [
    /for\s+(?:my\s+)?(mum|mom|mother|wife|husband|partner|girlfriend|boyfriend|friend|sister|brother|dad|father|nan|grandma|gran)/i,
    /(?:surprise|gift)\s+(?:for\s+)?(?:my\s+)?(wife|husband|partner|girlfriend|boyfriend)/i,
  ];
  for (const p of recipientPatterns) {
    const m = message.match(p);
    if (m) {
      recipient = m[1].charAt(0).toUpperCase() + m[1].slice(1);
      break;
    }
  }
  // Check for named recipient in email signatures
  const sigMatch = message.match(/(?:regards|thanks|cheers),?\s*\n\s*(\w+\s+\w+)/i);
  const isCorpSender = sigMatch ? sigMatch[1] : null;
  if (isCorpSender && occasion === "Corporate Event") {
    recipient = `Client of ${isCorpSender}`;
  }

  // Delivery
  const delivery =
    /deliver|delivery|drop\s*off|send\s*to|ship/i.test(lower) &&
    !/collect|pick\s*up|i'll\s*come/i.test(lower);

  // Vibe detection
  let bestVibe = "classic";
  let bestScore = 0;
  for (const [vibe, keywords] of Object.entries(VIBE_KEYWORDS)) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestVibe = vibe;
    }
  }

  // Notes — anything that doesn't fit elsewhere
  const notes: string[] = [];
  if (/collect|pick\s*up/i.test(lower)) notes.push("Customer will collect");
  if (/centrepiece|centerpiece|table/i.test(lower)) notes.push("Table centrepiece arrangement(s)");
  const qtyMatch = lower.match(/(\d+)\s*(?:table|centrepiece|arrangement|bouquet)/);
  if (qtyMatch) notes.push(`Quantity: ${qtyMatch[1]}`);
  const areaMatch = message.match(/(?:deliver\w*\s+to|to\s+)([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d?[A-Z]*|[\w\s]+(?:street|road|lane|avenue|drive|place))/i);
  if (areaMatch) notes.push(`Delivery area: ${areaMatch[1].trim()}`);

  return {
    recipient,
    occasion,
    date,
    budget,
    vibe: bestVibe,
    delivery,
    notes: notes.length > 0 ? notes.join("; ") : "None",
  };
}

// ─── Recipe Builder ──────────────────────────────────────────────────
export function buildRecipe(order: ExtractedOrder): FlowerRecipe {
  const budget = order.budget ?? 40; // default £40
  const deliveryFee = order.delivery ? 5.95 : 0;
  const stemBudget = (budget - deliveryFee) * 0.55; // ~55% goes to stems, rest is margin + wrapping

  // Score each flower by vibe match
  const scored = CURRENT_STOCK
    .filter((s) => s.available > 0)
    .map((s) => ({
      flower: s,
      score: s.vibes.filter((v) => v === order.vibe || VIBE_KEYWORDS[order.vibe]?.some(kw => s.vibes.includes(kw))).length,
    }))
    .sort((a, b) => b.score - a.score);

  // Pick top flowers, fill budget
  const stems: RecipeStem[] = [];
  let spent = 0;
  const usedNames = new Set<string>();

  // Hero flower — most expensive matching flower, 3-5 stems
  const hero = scored.find((s) => s.flower.pricePerStem >= 3 && s.score > 0);
  if (hero) {
    const qty = Math.min(
      Math.floor(stemBudget * 0.4 / hero.flower.pricePerStem),
      5,
      hero.flower.available
    );
    if (qty > 0) {
      stems.push({ flower: hero.flower, qty, cost: qty * hero.flower.pricePerStem });
      spent += qty * hero.flower.pricePerStem;
      usedNames.add(hero.flower.name + hero.flower.colour);
    }
  }

  // Supporting flowers — fill the rest
  for (const s of scored) {
    if (spent >= stemBudget) break;
    const key = s.flower.name + s.flower.colour;
    if (usedNames.has(key)) continue;
    if (s.score === 0 && stems.length >= 2) continue;

    const remaining = stemBudget - spent;
    const maxQty = Math.min(
      Math.floor(remaining / s.flower.pricePerStem),
      7,
      s.flower.available
    );
    if (maxQty >= 2) {
      const qty = Math.min(maxQty, s.flower.pricePerStem >= 3 ? 4 : 6);
      stems.push({ flower: s.flower, qty, cost: qty * s.flower.pricePerStem });
      spent += qty * s.flower.pricePerStem;
      usedNames.add(key);
    }
    if (stems.length >= 5) break;
  }

  // Always add a filler if budget allows
  const filler = CURRENT_STOCK.find(
    (s) => s.pricePerStem <= 1.5 && !usedNames.has(s.name + s.colour) && s.available > 0
  );
  if (filler && spent < stemBudget) {
    const qty = Math.min(Math.floor((stemBudget - spent) / filler.pricePerStem), 5);
    if (qty >= 2) {
      stems.push({ flower: filler, qty, cost: qty * filler.pricePerStem });
      spent += qty * filler.pricePerStem;
    }
  }

  // Pick greenery based on vibe
  const greeneryIdx =
    order.vibe === "wild" ? 2 :
    order.vibe === "modern" || order.vibe === "bold" ? 3 :
    order.vibe === "elegant" || order.vibe === "romantic" ? 4 : 1;
  const greenery = GREENERY_OPTIONS[greeneryIdx];

  const subtotal = parseFloat(spent.toFixed(2));
  const total = parseFloat((budget).toFixed(2));
  const margin = total - subtotal - deliveryFee;
  const marginPct = parseFloat(((margin / total) * 100).toFixed(1));

  return {
    stems,
    greenery,
    subtotal,
    delivery_fee: deliveryFee,
    total,
    margin_pct: Math.max(marginPct, 0),
  };
}

// ─── Email Drafter ───────────────────────────────────────────────────
export function draftEmail(order: ExtractedOrder, recipe: FlowerRecipe): string {
  const stemList = recipe.stems
    .map((s) => `  - ${s.qty}x ${s.flower.name} (${s.flower.colour})`)
    .join("\n");

  const dateStr = order.date !== "Not specified" ? ` for ${order.date}` : "";
  const deliveryStr = order.delivery
    ? `\nDelivery is included at £${recipe.delivery_fee.toFixed(2)}.`
    : "\nYou mentioned you'd like to collect — we'll have it ready and waiting for you.";

  return `Subject: Your Flower Order${dateStr} — Bloom Desk

Hi there!

Thank you so much for getting in touch! I'd love to put together something beautiful for you.

Based on what you've described, I'm thinking a ${order.vibe} ${order.occasion !== "Not specified" ? order.occasion.toLowerCase() + " " : ""}arrangement with:

${stemList}
  + ${recipe.greenery}

${order.occasion === "Corporate Event" ? "Each arrangement would" : "This would"} come to £${recipe.total.toFixed(2)}${order.delivery ? " including delivery" : ""}.${deliveryStr}

Here's your payment link to confirm the order:
🔗 [Pay £${recipe.total.toFixed(2)} — Bloom Desk](#payment-link)

Once payment is received, I'll get started right away${dateStr ? ` and have everything ready ${dateStr}` : ""}.

If you'd like any changes to the flowers or have any questions at all, just drop me a message!

Thanks so much,
[Your Name]
Bloom Desk
[Phone Number]`;
}

// ─── Process Full Pipeline ───────────────────────────────────────────
export function processDM(message: string): ProcessedResult {
  const extracted = extractOrder(message);
  const recipe = buildRecipe(extracted);
  const email_draft = draftEmail(extracted, recipe);
  return { extracted, recipe, email_draft };
}
