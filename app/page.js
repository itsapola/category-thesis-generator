"use client";

import { useState } from "react";

export default function Home() {
  const [product, setProduct] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theses, setTheses] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!product.trim()) {
      setError("Describe the product before running the audit.");
      return;
    }
    setError("");
    setLoading(true);
    setTheses(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, competitors, audience }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setTheses(data.theses || []);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <nav>
        <span className="brand">
          <a href="https://ashleypola.com">Ashley Pola</a>
        </span>
        <a className="navback" href="https://ashleypola.com/tools.html">
          ← All tools
        </a>
      </nav>

      <div className="wrap">
        <section className="hero">
          <span className="eyebrow">Category Thesis Generator</span>
          <h1>
            How should this <span className="hl">actually</span> be framed?
          </h1>
          <p className="lede">
            Give it a product and its closest competitors. It generates
            competing category theses — how the product could be framed,
            what each framing puts you up against, and the tradeoffs of
            each — as a starting point for the framing conversation, not a
            replacement for it.
          </p>
        </section>

        <div className="process">
          <div className="pstep">
            <div className="pn">01 / Frame</div>
            <h4>Read the product</h4>
            <p>
              Takes what the product actually does and who it's competing
              with today.
            </p>
          </div>
          <div className="pstep">
            <div className="pn">02 / Diverge</div>
            <h4>Generate theses</h4>
            <p>
              Produces two to three distinct ways to frame it — not
              variations on one idea.
            </p>
          </div>
          <div className="pstep">
            <div className="pn">03 / Choose</div>
            <h4>Weigh the tradeoffs</h4>
            <p>
              Each thesis comes with what it wins, what it costs, and who
              you're now compared to.
            </p>
          </div>
        </div>

        <form className="formcard" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="product">What does the product do?</label>
            <textarea
              id="product"
              rows={4}
              placeholder="e.g. AI software that listens to sales calls and auto-fills CRM fields, so reps stop doing data entry after every call."
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
            <div className="hint">
              Describe it plainly — what it does, not what you'd call it.
            </div>
          </div>

          <div className="field">
            <label htmlFor="competitors">
              Who do people compare it to today? (optional)
            </label>
            <textarea
              id="competitors"
              rows={2}
              placeholder="e.g. Gong, Chorus, plain CRM data entry, a sales ops hire"
              value={competitors}
              onChange={(e) => setCompetitors(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="audience">Primary buyer? (optional)</label>
            <input
              id="audience"
              type="text"
              placeholder="e.g. VP of Sales at a 50–200 person B2B SaaS company"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>

          <div className="formrow">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Generating…" : "Generate theses"}
            </button>
            {error && <span className="status err">{error}</span>}
            {loading && (
              <span className="status" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <svg className="spinner-star" viewBox="0 0 20 20" aria-hidden="true"><line x1="10" y1="1" x2="10" y2="19" /><line x1="1" y1="10" x2="19" y2="10" /><line x1="3.6" y1="3.6" x2="16.4" y2="16.4" /><line x1="16.4" y1="3.6" x2="3.6" y2="16.4" /></svg>
                Reading the product, drafting distinct framings…
              </span>
            )}
          </div>
        </form>

        {theses && theses.length > 0 && (
          <section className="results">
            <div className="kicker">
              <span>Category theses</span>
              <span className="ln"></span>
              <span>{theses.length} generated</span>
            </div>

            {theses.map((t, i) => (
              <article
                key={i}
                className={`thesis${t.recommended ? " recommended" : ""}`}
              >
                {t.recommended && (
                  <span className="rec-flag">Recommended</span>
                )}
                <div className="tnum">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3>{t.name}</h3>
                <p className="statement">{t.statement}</p>

                <div className="deflist">
                  <div className="dfrow">
                    <div className="dt">Positions against</div>
                    <div className="dd">{t.positionsAgainst}</div>
                  </div>
                  <div className="dfrow">
                    <div className="dt">What it wins</div>
                    <div className="dd">{t.wins}</div>
                  </div>
                  <div className="dfrow">
                    <div className="dt">What it costs</div>
                    <div className="dd">{t.costs}</div>
                  </div>
                  <div className="dfrow">
                    <div className="dt">Best if</div>
                    <div className="dd">{t.bestIf}</div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      <footer>
        <svg className="orbit-mark" viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="20" rx="18" ry="7" transform="rotate(-20 20 20)" /><ellipse cx="20" cy="20" rx="18" ry="7" transform="rotate(40 20 20)" /><circle cx="20" cy="20" r="2.5" /></svg>
        <span>Ashley Pola © 2026</span>
        <span>
          Homepage content only. Strategic conclusions require human
          review.
        </span>
      </footer>
    </>
  );
}
