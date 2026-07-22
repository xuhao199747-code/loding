# AlphaRank GEO Knowledge Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Parse all 119 images in the target Figma node, synthesize an AI product manager GEO knowledge guide, redraw supported architectures as editable Feishu whiteboards, and publish the verified result to the target Feishu document.

**Architecture:** Keep an auditable local evidence layer (`manifest.json`, downloaded images, and per-image analysis) separate from the reader-facing synthesis. Build the document from evidence-backed topic chapters, then insert Mermaid-based Feishu whiteboards at the relevant points and verify both image coverage and remote document structure.

**Tech Stack:** Figma MCP, local image inspection/OCR utilities, JSON/Markdown evidence files, `lark-cli docs`, Feishu editable whiteboards with Mermaid.

## Global Constraints

- The source scope is exactly Figma file `QvBLFrsXZkH4uKEwpqr19t`, node `40006180:649`.
- All 119 image nodes must appear exactly once in the analysis manifest.
- Do not insert any original Figma screenshot into Feishu.
- Do not infer AlphaRank internals beyond visible evidence; label general industry explanations separately from product evidence.
- Redrawn architecture diagrams must be Feishu-editable whiteboards, not flattened images.
- Preserve unrelated Feishu content; the target document is currently empty, so build it incrementally with append/insert operations.

---

### Task 1: Build the Figma image manifest and evidence store

**Files:**
- Create: `evidence/figma/manifest.json`
- Create: `evidence/figma/images/`

**Interfaces:**
- Consumes: Figma metadata for node `40006180:649`.
- Produces: 119 manifest entries with `index`, `nodeId`, `name`, `width`, `height`, `localPath`, and `downloadStatus`.

- [ ] Export or download each image node at readable source quality.
- [ ] Store assets as `image-001` through `image-119` without changing their content.
- [ ] Validate that manifest indices are continuous, node IDs are unique, paths exist, and no download failed.
- [ ] Record file dimensions and hashes so duplicate images can be detected without skipping their individual analysis records.

### Task 2: Produce one evidence-backed analysis record per image

**Files:**
- Create: `evidence/figma/analysis.json`
- Create: `reports/image-analysis.md`

**Interfaces:**
- Consumes: `evidence/figma/manifest.json` and downloaded images.
- Produces: 119 records with `imageType`, `visibleText`, `objects`, `relationships`, `geoMeaning`, `pmTakeaway`, `chapter`, `redrawCandidate`, and `confidence`.

- [ ] Inspect every image at sufficient resolution; use OCR only as an aid and confirm important labels visually.
- [ ] Describe visible evidence before interpretation.
- [ ] Translate technical content into the problem solved, working principle, product implication, metric, and risk.
- [ ] Flag unreadable or ambiguous images as low confidence and re-export them at higher resolution for a second inspection.
- [ ] Validate that every manifest entry has exactly one analysis record.

### Task 3: Create the topic synthesis and diagram specifications

**Files:**
- Create: `reports/alpharank-geo-ai-pm-guide.md`
- Create: `diagrams/diagram-specs.md`
- Create: `diagrams/*.mmd`

**Interfaces:**
- Consumes: `evidence/figma/analysis.json`.
- Produces: the final chapter copy, image-to-chapter coverage appendix, and Mermaid definitions for every justified architecture diagram.

- [ ] Cluster records into the approved nine-part knowledge structure.
- [ ] Remove repetition while retaining an appendix row for each of the 119 source images.
- [ ] Separate product evidence, industry mechanism, and product-manager recommendation in the prose.
- [ ] For each architecture candidate, identify semantic nodes and edges, then redesign it around one clear reader question.
- [ ] Check every diagram for terminology consistency with the prose and avoid unsupported internal-system claims.

### Task 4: Publish the knowledge guide to Feishu

**Files:**
- Create: `deliverables/feishu-sections.xml`
- Modify remote: Feishu document `XQdOdqvtcoq5bgx6bOxclhYonra`

**Interfaces:**
- Consumes: final guide and diagram specifications.
- Produces: structured Feishu chapters and newly created editable whiteboard blocks.

- [ ] Append the title, reading guide, and chapters in bounded XML batches.
- [ ] After each batch, fetch the new section and verify heading levels, tables, lists, and prose order.
- [ ] Insert one blank/Mermaid whiteboard at each approved diagram location.
- [ ] Populate each whiteboard from its Mermaid source and verify that its token remains editable.
- [ ] Append the 119-row coverage appendix without embedding original images.

### Task 5: Verify completeness and remote delivery

**Files:**
- Create: `reports/final-verification.md`

**Interfaces:**
- Consumes: local manifests, final guide, and fetched Feishu document.
- Produces: a pass/fail checklist with concrete counts and any residual limitations.

- [ ] Assert source image count = manifest count = analysis count = appendix row count = 119.
- [ ] Confirm every redrawn diagram has an editable Feishu whiteboard token and explanatory surrounding text.
- [ ] Fetch the complete Feishu document and check title hierarchy, chapter order, diagram placement, and absence of original Figma screenshots.
- [ ] Scan for unsupported claims, duplicated sections, placeholder language, and broken XML remnants.
- [ ] Record final Feishu revision ID and the list of created whiteboard tokens.
