# GEO Vault Reclassification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Safely reclassify 116 GEO articles into the approved 11 categories, normalize 99 titles, synchronize Markdown metadata and links, and prove that no article or resource was lost.

**Architecture:** A Node.js migration utility reads the two approved Markdown specs, inventories the Obsidian vault, constructs a one-to-one manifest, and refuses to write when a source is missing or a target collides. It prepares all Markdown transforms before mutation, moves articles through a temporary staging directory, then runs a complete terminal-only audit.

**Tech Stack:** Node.js standard library, `node:test`, POSIX filesystem operations, Markdown text parsing, `xmllint` when available, Obsidian WikiLinks, Git.

## Global Constraints

- Vault: `/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO`.
- One source image remains one independent article; no merge or split.
- Every article root contains only `全文.md`, `产品经理版.md`, and `资源/`.
- Resource filenames and bytes do not change.
- Final titles use one core object and one document type; no “A 与 B” or “A 和 B”.
- Product manager content is not regenerated during migration.
- No quality-report file is created.
- Any missing source, ambiguous mapping, target collision, broken resource, or invalid transform stops execution before mutation.
- Category spec: `docs/superpowers/specs/2026-07-24-geo-knowledge-category-redesign.md`.
- Title spec: `docs/superpowers/specs/2026-07-24-geo-article-title-redesign.md`.

---

### Task 1: Build the manifest validator

**Files:**
- Create: `scripts/geo-knowledge/migrate-vault.mjs`
- Create: `scripts/geo-knowledge/migrate-vault.test.mjs`
- Read: `docs/superpowers/specs/2026-07-24-geo-knowledge-category-redesign.md`
- Read: `docs/superpowers/specs/2026-07-24-geo-article-title-redesign.md`

**Interfaces:**
- Consumes: vault path, category spec, title spec, and `--dry-run`, `--apply`, or `--verify`.
- Produces: `ArticlePlan[]` with `{ sourceRoot, oldTitle, targetCategory, newTitle, sourceDir, targetDir }`.
- Exports: `loadInventory`, `parseTitleMap`, `parseCategoryMap`, `buildMigrationPlan`, `validateMigrationPlan`.

- [ ] **Step 1: Write failing manifest tests**

```js
test('maps every article to one unique target', () => {
  const plan = buildMigrationPlan(inventory, titleMap, categoryMap)
  assert.equal(plan.length, 116)
  assert.equal(new Set(plan.map(x => x.sourceDir)).size, 116)
  assert.equal(new Set(plan.map(x => x.targetDir)).size, 116)
})

test('rejects forbidden parallel titles', () => {
  assert.throws(() => validateMigrationPlan([
    { newTitle: '诊断与优化', sourceDir: '/a', targetDir: '/b' }
  ]), /forbidden conjunction/)
})

test('keeps duplicate old titles as separate articles', () => {
  const items = plan.filter(x => x.oldTitle === '向量检索召回方案')
  assert.deepEqual(items.map(x => x.newTitle).sort(), ['向量召回产品架构', '向量检索技术架构'])
})
```

- [ ] **Step 2: Verify the tests fail before implementation**

Run: `node --test scripts/geo-knowledge/migrate-vault.test.mjs`

Expected: FAIL because the parser and validator exports do not exist.

- [ ] **Step 3: Implement strict manifest parsing**

```js
export function validateMigrationPlan(plan) {
  if (plan.length !== 116) throw new Error(`expected 116 articles, received ${plan.length}`)
  const sources = new Set()
  const targets = new Set()
  for (const item of plan) {
    if (/[与和]/u.test(item.newTitle)) throw new Error(`forbidden conjunction: ${item.newTitle}`)
    if (sources.has(item.sourceDir)) throw new Error(`duplicate source: ${item.sourceDir}`)
    if (targets.has(item.targetDir)) throw new Error(`target collision: ${item.targetDir}`)
    sources.add(item.sourceDir)
    targets.add(item.targetDir)
  }
  return plan
}
```

The category parser resolves ordinary names against one inventory entry. It resolves the two `向量检索召回方案` entries using their source qualifiers. Zero matches or multiple matches throw.

- [ ] **Step 4: Run the tests**

Run: `node --test scripts/geo-knowledge/migrate-vault.test.mjs`

Expected: `pass 3`, `fail 0`, or a larger passing count when edge-case tests are included.

- [ ] **Step 5: Commit**

```bash
git add scripts/geo-knowledge/migrate-vault.mjs scripts/geo-knowledge/migrate-vault.test.mjs
git commit -m "feat: add GEO vault migration validator"
```

### Task 2: Add Markdown synchronization

**Files:**
- Modify: `scripts/geo-knowledge/migrate-vault.mjs`
- Modify: `scripts/geo-knowledge/migrate-vault.test.mjs`

**Interfaces:**
- Consumes: `ArticlePlan[]` and both Markdown files in every article.
- Produces: `PreparedArticle[]` with transformed and original Markdown buffers.
- Exports: `replacePrimaryHeading`, `updateFrontmatter`, `rewriteInternalLinks`, `prepareMarkdown`, `validatePreparedArticles`.

- [ ] **Step 1: Write failing transformation tests**

```js
test('synchronizes article headings', () => {
  assert.match(replacePrimaryHeading('# 全文\n', 'RAG架构设计'), /^# RAG架构设计$/m)
  assert.match(replacePrimaryHeading('# 产品经理版\n', 'RAG架构设计｜产品经理版'), /^# RAG架构设计｜产品经理版$/m)
})

test('updates metadata but preserves derived_from', () => {
  const result = updateFrontmatter(source, { article_title: 'RAG架构设计', category: '数据与知识库' })
  assert.match(result, /article_title: RAG架构设计/)
  assert.match(result, /category: 数据与知识库/)
  assert.match(result, /derived_from: 全文\.md/)
})

test('rewrites links without replacing prose', () => {
  const text = '参见 [[RAG检索方案-22/全文]]。正文提到 RAG检索方案-22。'
  assert.equal(rewriteInternalLinks(text, pathMap), '参见 [[数据与知识库/RAG架构设计/全文]]。正文提到 RAG检索方案-22。')
})
```

- [ ] **Step 2: Verify the new tests fail**

Run: `node --test scripts/geo-knowledge/migrate-vault.test.mjs`

Expected: FAIL on missing Markdown transformation functions.

- [ ] **Step 3: Implement deterministic transforms**

```text
全文.md H1              -> # <newTitle>
产品经理版.md H1        -> # <newTitle>｜产品经理版
article_title           -> <newTitle>
existing category field -> <targetCategory>
title: 产品经理版       -> unchanged
derived_from: 全文.md   -> unchanged
resource embeds         -> unchanged
ordinary prose          -> unchanged outside H1, frontmatter, and link spans
```

Missing H1, malformed frontmatter, or an unresolved rewritten link throws before filesystem mutation.

- [ ] **Step 4: Run all tests**

Run: `node --test scripts/geo-knowledge/migrate-vault.test.mjs`

Expected: `fail 0`.

- [ ] **Step 5: Commit**

```bash
git add scripts/geo-knowledge/migrate-vault.mjs scripts/geo-knowledge/migrate-vault.test.mjs
git commit -m "feat: synchronize GEO titles and links"
```

### Task 3: Dry-run the live vault

**Files:**
- Read: `/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO/**`
- Read: `/Users/mac/Desktop/GEO图/**`
- Do not modify the vault in this task.

**Interfaces:**
- Consumes: live vault plus approved mappings.
- Produces: terminal-only validation output.

- [ ] **Step 1: Run tests**

Run: `node --test scripts/geo-knowledge/migrate-vault.test.mjs`

Expected: `fail 0`.

- [ ] **Step 2: Run dry-run**

```bash
node scripts/geo-knowledge/migrate-vault.mjs \
  --vault '/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO' \
  --category-spec 'docs/superpowers/specs/2026-07-24-geo-knowledge-category-redesign.md' \
  --title-spec 'docs/superpowers/specs/2026-07-24-geo-article-title-redesign.md' \
  --dry-run
```

Expected:

```text
articles=116 renamed=99 unchanged=17 categories=11
target_collisions=0 missing_sources=0 broken_links_before_write=0
DRY_RUN_OK
```

- [ ] **Step 3: Confirm pre-migration invariants**

Expected terminal values:

```text
全文.md=116 产品经理版.md=116 OCR=116 original_images=116 SVG>=126
article_root_shape_errors=0 source_image_hash_mismatches=0
```

Any mismatch blocks `--apply`.

### Task 4: Back up and apply the migration

**Files:**
- Modify: `/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO/**`
- Modify: `docs/superpowers/specs/2026-07-24-geo-knowledge-category-redesign.md`

**Interfaces:**
- Consumes: validated `PreparedArticle[]`.
- Produces: 11 final category directories and 116 unique article directories.

- [ ] **Step 1: Create a recoverable temporary backup**

```bash
backup_dir=$(mktemp -d /tmp/geo-vault-backup.XXXXXX)
cp -a '/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO/.' "$backup_dir/"
test "$(find "$backup_dir" -mindepth 2 -maxdepth 2 -type d | wc -l | tr -d ' ')" = '116'
```

Expected: the final `test` exits 0. Preserve the exact backup path until post-migration verification passes.

- [ ] **Step 2: Apply the transaction**

```bash
node scripts/geo-knowledge/migrate-vault.mjs \
  --vault '/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO' \
  --category-spec 'docs/superpowers/specs/2026-07-24-geo-knowledge-category-redesign.md' \
  --title-spec 'docs/superpowers/specs/2026-07-24-geo-article-title-redesign.md' \
  --apply
```

Expected: `MIGRATION_OK articles=116 categories=11`.

The utility moves all sources to unique staging paths before creating final targets. It then writes prevalidated Markdown transforms and removes the empty staging directory. A caught failure reverses completed moves and restores original Markdown buffers.

- [ ] **Step 3: Align the category spec with final titles**

Replace old article names with approved final names while preserving exact counts:

```text
23, 9, 9, 8, 7, 7, 14, 5, 9, 19, 6
```

- [ ] **Step 4: Commit the finalized mapping**

```bash
git add docs/superpowers/specs/2026-07-24-geo-knowledge-category-redesign.md
git commit -m "docs: align GEO categories with normalized titles"
```

### Task 5: Run the complete post-migration audit

**Files:**
- Read: `/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO/**`
- Read: `/Users/mac/Desktop/GEO图/**`
- Modify only the exact affected file when a migration defect is found.

**Interfaces:**
- Consumes: migrated vault.
- Produces: terminal-only audit results; no report document.

- [ ] **Step 1: Run structural verification**

```bash
node scripts/geo-knowledge/migrate-vault.mjs \
  --vault '/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO' \
  --category-spec 'docs/superpowers/specs/2026-07-24-geo-knowledge-category-redesign.md' \
  --title-spec 'docs/superpowers/specs/2026-07-24-geo-article-title-redesign.md' \
  --verify
```

Expected:

```text
articles=116 categories=11 duplicate_titles=0 forbidden_title_patterns=0
article_root_shape_errors=0 heading_mismatches=0 frontmatter_mismatches=0
```

- [ ] **Step 2: Verify resources**

Expected:

```text
全文.md=116 产品经理版.md=116 OCR=116 original_images=116
source_image_hash_mismatches=0 missing_resource_links=0 invalid_svg=0
```

Parse every SVG using `xmllint --noout` when installed, otherwise the available XML runtime. Any parse failure blocks completion.

- [ ] **Step 3: Verify Markdown and links**

Expected:

```text
broken_wikilinks=0 broken_markdown_links=0 unbalanced_code_fences=0
malformed_tables=0 invalid_utf8=0 old_category_directories=0 staging_directories=0
```

- [ ] **Step 4: Re-run tests and inspect Git scope**

```bash
node --test scripts/geo-knowledge/migrate-vault.test.mjs
git diff --check
git status --short
```

Expected: tests report `fail 0`; `git diff --check` exits 0. Stage only migration-owned files and leave unrelated user changes untouched.

- [ ] **Step 5: Commit only if the utility required corrections**

```bash
git add scripts/geo-knowledge/migrate-vault.mjs scripts/geo-knowledge/migrate-vault.test.mjs
git commit -m "fix: complete GEO vault migration checks"
```

Skip this commit when no correction was needed. Keep the backup until the verified final result and backup path have been reported to the user.
