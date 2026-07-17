# Category Thesis Generator

Give it a product and its closest competitors. It generates 2–3 distinct category theses — how the product could be framed, what each framing puts it up against, and the tradeoffs of each.

**Live:** (add your Vercel URL here once deployed)

## What it does

1. **Frame** — takes a plain description of what the product does, who it's currently compared to, and its primary buyer.
2. **Diverge** — generates genuinely distinct framings, not variations on one idea: different category borrows, different competitive sets, different levels of ambition.
3. **Choose** — each thesis comes back with what it wins, what it costs, and the condition under which it's the right call. One is flagged as the recommended bet.

This encodes the category-creation process I use in client work (see the CalmWave case study at [ashleypola.com](https://ashleypola.com)) into a repeatable tool — a generate-side complement to the [Brand Intelligence Toolkit](https://brand-analyst.vercel.app/), which audits.

## Stack

- Next.js 14 (App Router)
- Anthropic API (`claude-sonnet-5`), called server-side from a route handler — the API key never reaches the browser
- No database — stateless, one request in, one JSON response out

## Running locally

```bash
npm install
cp .env.example .env.local
# edit .env.local and add your real ANTHROPIC_API_KEY
npm run dev
```

Visit `http://localhost:3000`.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project**, import the repo.
3. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` — your key from [console.anthropic.com](https://console.anthropic.com/settings/keys)
4. Deploy. No other config needed — Vercel auto-detects Next.js.

If you rotate or add the key after the first deploy, redeploy for it to take effect.

## Notes

- The API key is a **server-side** env var (not `NEXT_PUBLIC_`) on purpose — it's only ever read inside `app/api/generate/route.js`, never shipped to the client.
- Output is meant as a starting point for the framing conversation, not a finished decision — the model is prompted to always state a real cost for every thesis, not just the upside.

---

Built by [Ashley Pola](https://ashleypola.com) — brand and narrative strategist.
