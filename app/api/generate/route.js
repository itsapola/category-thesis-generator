import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a senior brand and narrative strategist who specializes in category creation for technical, complex, or regulated products.

Given a product description, its named competitors, and its primary buyer, generate 2-3 DISTINCT possible category theses for how the product could be framed to the market.

Each thesis must be a genuinely different strategic bet, not a rewording of the same idea. Vary things like: which existing category it borrows credibility from vs. which one it rejects, whether it competes against a tool, a headcount, or a status quo behavior, and how ambitious vs. defensible the framing is.

For each thesis, provide:
- "name": a short (2-5 word) name for the category framing itself, not the product name
- "statement": one sharp sentence stating the thesis, written the way a strategist would say it out loud
- "positionsAgainst": what this framing puts the product in competition with (be specific)
- "wins": the concrete strategic advantage of this framing (1-2 sentences)
- "costs": the real tradeoff or risk of this framing, stated honestly (1-2 sentences) — every thesis has a cost, never write "none"
- "bestIf": the condition under which this is the right call (1 sentence)
- "recommended": boolean, true for exactly ONE thesis that is the strongest overall bet given what was provided

WRITING RULES (apply to every field):
- Never use contrast-by-negation. No "not X but Y", "X, not Y", "isn't X. It's Y", "I'm not selling X, I'm selling Y", or "not just X". State the claim directly and positively.
- No AI-sounding constructions: no "it's not about", no "in a world where", no rhetorical triplets, no filler words like "truly", "genuinely", "seamless", "powerful", "game-changing".
- Write the way a senior strategist talks in a board meeting: plain, specific, confident, short sentences.

Respond with ONLY valid JSON in this exact shape, no markdown fences, no preamble:
{"theses": [{"name": "...", "statement": "...", "positionsAgainst": "...", "wins": "...", "costs": "...", "bestIf": "...", "recommended": false}]}`;

export async function POST(req) {
  try {
    const { product, competitors, audience } = await req.json();

    if (!product || !product.trim()) {
      return NextResponse.json(
        { error: "Product description is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Server is missing ANTHROPIC_API_KEY. Add it in your Vercel project's Environment Variables.",
        },
        { status: 500 }
      );
    }

    const userMessage = [
      `Product: ${product.trim()}`,
      competitors && competitors.trim()
        ? `Named competitors / current comparisons: ${competitors.trim()}`
        : `Named competitors / current comparisons: not provided — infer likely ones.`,
      audience && audience.trim()
        ? `Primary buyer: ${audience.trim()}`
        : `Primary buyer: not provided — infer a likely one.`,
    ].join("\n");

    const messages = [{ role: "user", content: userMessage }];
    let parsed;
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-5",
          max_tokens: 2000,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        return NextResponse.json(
          { error: `Anthropic API error (${response.status}): ${errText}` },
          { status: 502 }
        );
      }

      const data = await response.json();
      const textBlock = (data.content || []).find((b) => b.type === "text");
      const raw = textBlock ? textBlock.text : "";
      const cleaned = raw.replace(/```json|```/g, "").trim();

      try {
        parsed = JSON.parse(cleaned);
      } catch {
        return NextResponse.json(
          { error: "Model response wasn't valid JSON. Try again." },
          { status: 502 }
        );
      }

      const offenders = findContrastNegation(parsed);
      if (offenders.length === 0 || attempt === 1) break;
      messages.push({ role: "assistant", content: raw });
      messages.push({
        role: "user",
        content: `Rewrite your answer. These lines use contrast-by-negation, which the writing rules forbid: ${offenders
          .map((o) => `"${o}"`)
          .join("; ")}. State each claim directly. Return the full JSON again in the same shape.`,
      });
    }

    if (!parsed.theses || !Array.isArray(parsed.theses)) {
      return NextResponse.json(
        { error: "Model response was missing the expected data." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Unexpected server error." },
      { status: 500 }
    );
  }
}

const CONTRAST_PATTERNS = [
  /\bnot\b[^.;:!?]{0,80}?,?\s*\bbut\b/i,
  /\bnot just\b/i,
  /\b(isn't|is not|aren't|wasn't|don't|doesn't)\b[^.!?]{0,80}[.;:]\s*(it's|it is|they're|that's)\b/i,
  /\bI'm not\b[^.!?]{0,60},\s*I'm\b/i,
  /,\s*not\s+[a-z][^.,;]{0,40}[.;]/i,
  /\b(don't|doesn't|isn't|aren't|wasn't)\b[^.!?]{0,60},\s*(they|it|we|you|he|she)\b/i,
];

function findContrastNegation(obj) {
  const hits = [];
  const walk = (v) => {
    if (typeof v === "string") {
      if (CONTRAST_PATTERNS.some((re) => re.test(v))) hits.push(v);
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(obj);
  return hits;
}
