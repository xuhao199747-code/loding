# AlphaRank GEO Competitive Analysis Design

## Purpose

Create a Feishu document for a launch-grade competitive analysis of AlphaRank's AIGC text generation, GEO, AI search visibility, content optimization, and domestic Agent direction.

The report must not be a simple list of competitor features. It should answer:

- How should AlphaRank position itself in the domestic GEO / AI Search Visibility / content optimization Agent market?
- Which competitor capabilities should AlphaRank learn from, avoid, or differentiate against?
- Which gaps are must-fix, which opportunities can become advantages, and which areas should be deferred?
- What evidence supports each judgment?

## Delivery Format

The final artifact will be written into the user's Feishu document:

`https://my.feishu.cn/docx/KpXTdwyH6ox6uMxTpBrcWFnjn8e`

The delivery style is A + B:

- A complete strategic report.
- Horizontal comparison matrices for company background, operations, functions, metrics, pricing, strengths, weaknesses, screenshots, and AlphaRank recommendations.

## Product Scope

Primary focus:

- AIGC text generation.
- GEO / Generative Engine Optimization.
- AI Search Visibility.
- Text content optimization.
- Domestic AI Agent execution workflows.

Out of scope as primary tracks:

- Image generation.
- Video generation.
- Voice or music generation.
- Digital humans.
- 3D generation.

These out-of-scope tracks may be mentioned only briefly if needed to explain why the current report is focused on text/GEO/Agent.

## Competitive Set

### Baseline

| Product | Role | Treatment |
|---|---|---|
| AlphaRank | Our baseline product | Full baseline analysis |

### Deep-Dive Competitors

| Product | Role | Why Included |
|---|---|---|
| AIDSO GEO | Domestic direct competitor | Represents a growth-oriented domestic GEO platform with real-time search, brand diagnosis, citation source display, and content optimization workflow |
| ImpetaAI | Domestic direct or near-direct competitor | Represents brand GEO monitoring, competitor comparison, source tracing, sentiment, and ToB data analysis |
| Profound | Overseas benchmark | Represents mature enterprise-grade AI visibility / answer engine optimization product patterns |

### Light-Scan References

| Product | Role | Treatment |
|---|---|---|
| Writesonic | Indirect / overseas AI SEO and content generation reference | Light scan |
| Otterly.AI | Overseas AI search monitoring reference | Light scan |
| Toujing GEO / TIMUS.AI | Domestic GEO reference | Light scan / verify |
| Sougeo / 搜极星 | Domestic GEO reference | Light scan / verify |

## Report Architecture

1. Conclusion Summary
   - AlphaRank positioning.
   - How AlphaRank can win.
   - Highest-priority capability gaps.
   - Key risks and non-goals.

2. Analysis Objective and Scope
   - Why this analysis is being done.
   - What product decisions it should support.
   - Definitions of GEO, AI Search Visibility, AIGC text generation, AI SEO/AEO, and Agent workflows.

3. Competitor Selection Logic and Layering
   - Why each product is included.
   - Direct competitor vs overseas benchmark vs indirect reference.
   - What each competitor is expected to teach AlphaRank.

4. Market and Category Judgment
   - Domestic vs overseas differences.
   - Why GEO is emerging as a separate product category.
   - Relationship among GEO monitoring, AI visibility, content optimization, SEO/AEO, and Agent execution.

5. User and Buying Decision Chain
   - SMB owner / founder.
   - Marketing lead.
   - SEO / GEO operator.
   - Content operator.
   - ToB sales / growth team.
   - Distinguish decision maker, daily user, and report consumer.

6. Company and Commercial Background Matrix
   - Company owner.
   - Country / region.
   - Founded date.
   - Financing status.
   - Team background.
   - Business model.
   - Target customers.
   - Market signals.
   - Public source confidence.

7. Acquisition Entry and Conversion Path Matrix
   - Homepage value proposition.
   - Free diagnosis / free tool entry.
   - Demo / trial / report download.
   - Sales consultation.
   - Where the user sees enough pain to consider paying.

8. Operation Logic Diagrams / User Flow Maps
   - Each deep-dive product needs one operation logic flow.
   - Prefer horizontal comparison when possible.
   - Also include a product-specific flow diagram when the workflow is complex.

   Example AlphaRank flow:

   ```mermaid
   flowchart LR
     A["Create brand project"] --> B["Configure brand, website, competitors, keywords"]
     B --> C["Generate question / keyword / scenario library"]
     C --> D["Monitor domestic AI platforms"]
     D --> E["Analyze mentions, rankings, citations, sentiment"]
     E --> F["Identify content opportunities"]
     F --> G["Create Agent tasks and reports"]
     G --> H["Review trend and prove optimization impact"]
   ```

9. Core Function Matrix
   - Use horizontal tables. Do not stack one competitor after another unless a single-product explanation is necessary.
   - Include evidence screenshot IDs.
   - Include "best reference" and "AlphaRank recommendation" columns.

   Function dimensions:

   - Brand diagnosis entry.
   - Website diagnosis.
   - Project setup.
   - Question / keyword / scenario library.
   - AI platform coverage.
   - Brand mention rate.
   - Average mention rank.
   - Citation source analysis.
   - Competitor comparison.
   - Sentiment analysis.
   - Content opportunity discovery.
   - Content generation / optimization.
   - Agent task system.
   - Scheduled monitoring.
   - Report export.
   - API / automation.
   - Team collaboration.

10. Metric System and Data Credibility Matrix
    - GEO score.
    - Brand visibility.
    - Share of Voice.
    - Prompt coverage.
    - Citation share.
    - Average mention rank.
    - Sentiment.
    - Content opportunity.
    - Optimization impact.
    - Data collection method.
    - Platform, device, region, and time coverage.
    - Reproducibility and explainability.

11. Key Page Screenshot Evidence
    - Each deep-dive product should include key screenshots.
    - Each screenshot must prove a specific product capability or claim.
    - Screenshots should be referenced by ID in matrices.
    - Body sections should include only the most important screenshots; the full evidence library belongs in the appendix.

    Screenshot ID examples:

    | Prefix | Product |
    |---|---|
    | AR-IMG | AlphaRank |
    | AIDSO-IMG | AIDSO |
    | IMP-IMG | ImpetaAI |
    | PRO-IMG | Profound |

12. Strengths, Weaknesses, and Learnability Matrix
    - What each product does well.
    - What each product does poorly.
    - What AlphaRank should learn.
    - What AlphaRank should not copy.
    - What open opportunity remains.

13. Pricing and Business Model Analysis
    - Free tier / free diagnosis.
    - Subscription pricing.
    - Usage limits: brands, prompts, platforms, seats, reports, API.
    - Enterprise plan.
    - Service / consulting packaging.
    - Whether pricing supports SMB, agency, or enterprise customers.

14. Agent Capability Breakdown
    Each deep-dive product must include a structured Agent analysis, not just a maturity score. The goal is to determine whether the product is only using "Agent" as marketing language or actually supports executable workflows.

    Required Agent dimensions:

    - Agent entry: where the user enters the Agent experience.
    - Agent role: analyst, strategist, content writer, report generator, task executor, or mixed role.
    - Trigger method: manual chat, template command, scheduled task, workflow automation, or event-based trigger.
    - Input context: brand project, question library, keywords, competitors, website pages, uploaded knowledge, historical monitoring data.
    - Tool calling: whether the Agent can call diagnosis, monitoring, content generation, report, export, or external tools.
    - Output type: insight, report, task, content draft, optimization roadmap, dashboard explanation, or alert.
    - Task system: whether the Agent can create, assign, track, and rerun tasks.
    - Knowledge system: personal knowledge, project knowledge, brand knowledge base, competitor knowledge, or document upload.
    - Scheduling and recurrence: whether the Agent supports timed monitoring, recurring reports, or periodic optimization.
    - Human collaboration: approvals, comments, handoff to team members, sales/customer report handoff.
    - Closed-loop ability: whether the Agent connects diagnosis, recommendation, execution, monitoring, and review.
    - Evidence: screenshot ID, official source, or "to verify" label.

    Horizontal table columns should include AlphaRank, AIDSO, ImpetaAI, and Profound, plus "best reference" and "AlphaRank recommendation".

15. Agent Maturity Assessment
    Evaluate each product using these levels:

    | Level | Meaning |
    |---|---|
    | L0 | Data display only |
    | L1 | Provides diagnostic suggestions |
    | L2 | Generates content or reports |
    | L3 | Creates tasks and runs scheduled workflows |
    | L4 | Connects multiple tools and continuously optimizes outcomes |

16. AlphaRank Gap, Opportunity, and Risk Analysis
    - Must-fill gaps.
    - Potential leading advantages.
    - Deferred features.
    - Long-term moats.
    - Risks and non-goals.

17. AlphaRank Next-Stage Product Priorities
    This is not a detailed engineering plan. It is a product priority recommendation section.

    Required table columns:

    - Priority: P0 / P1 / P2.
    - Capability.
    - User value.
    - Competitor reference.
    - Implementation difficulty.
    - Commercial value.
    - Acceptance criteria.

18. Appendix
    - Source list.
    - Source confidence grading.
    - Screenshot evidence library.
    - Light-scan competitor notes.
    - Open questions and items requiring product login or sales call verification.

## Layout Rules

- Prefer horizontal tables for multi-competitor comparison.
- Use competitors as columns where possible: AlphaRank, AIDSO, ImpetaAI, Profound.
- Avoid stacking "Competitor A, then Competitor B, then Competitor C" for every section.
- Use single-product subsections only when describing a product-specific workflow, screenshot group, or nuanced judgment.
- Keep screenshot-heavy material in a dedicated evidence section or appendix to avoid bloating the main narrative.
- Every claim that depends on product capability, pricing, financing, or company background should have either a source link, screenshot ID, or "to verify" label.

## Source Confidence Rules

| Level | Source Type | Usage Rule |
|---|---|---|
| A | Official website, product page, official docs, actual product screenshots, official pricing page | Can support direct claims |
| B | Company announcement, credible media report, financing database, listed company disclosure | Can support company and financing claims |
| C | Third-party review, blog post, social media, industry article | Use as supporting context |
| D | Inference or unverified information | Mark as "to verify"; do not present as confirmed fact |

## Evidence Rules

- Screenshots must be captured for AlphaRank, AIDSO, ImpetaAI, and Profound where accessible.
- If a page requires login, mark whether the screenshot is from logged-in product access or public page access.
- If a capability cannot be verified through public pages or available access, write "to verify" instead of assuming.
- For financing and company ownership, use public records and clearly label dates.
- For pricing, use current official pricing pages when available; if pricing is sales-led or unavailable, mark "not publicly disclosed".

## Final Feishu Writing Style

- Write in Chinese.
- Use conclusion-first structure.
- Use plain strategic language suitable for product, founder, marketing, and growth readers.
- Use tables for comparisons and evidence.
- Avoid overusing callouts, colors, or decorative formatting.
- Keep the report analytical, not promotional.

## Approved Direction

The user approved this architecture on 2026-07-07 and asked for the report to be comprehensive, evidence-based, include screenshots, include product operation logic diagrams, compare competitors horizontally, and identify what each product does well and poorly.
