import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  buildMigrationPlan,
  findBrokenResourceLinks,
  loadInventory,
  parseCategoryMap,
  parseTitleMap,
  replacePrimaryHeading,
  rewriteInternalLinks,
  updateFrontmatter,
  validateMigrationPlan,
} from './migrate-vault.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, '../..')
const vault = '/Users/mac/Documents/Obsidian/大威天龙/wiki/GEO'
const categorySpec = path.join(repo, 'docs/superpowers/specs/2026-07-24-geo-knowledge-category-redesign.md')
const titleSpec = path.join(repo, 'docs/superpowers/specs/2026-07-24-geo-article-title-redesign.md')

function livePlan() {
  const inventory = loadInventory(vault)
  const titleMap = parseTitleMap(titleSpec)
  const categoryMap = parseCategoryMap(categorySpec, inventory)
  return buildMigrationPlan(inventory, titleMap, categoryMap)
}

test('maps every article to one unique target', () => {
  const plan = livePlan()
  assert.equal(plan.length, 116)
  assert.equal(new Set(plan.map(item => item.sourceDir)).size, 116)
  assert.equal(new Set(plan.map(item => item.targetDir)).size, 116)
})

test('rejects forbidden parallel titles', () => {
  assert.throws(() => validateMigrationPlan([
    { newTitle: '诊断与优化', sourceDir: '/a', targetDir: '/b' },
  ]), /forbidden conjunction/)
})

test('keeps duplicate old titles as separate articles', () => {
  const items = livePlan().filter(item => item.oldTitle === '向量检索召回方案')
  assert.deepEqual(items.map(item => item.newTitle).sort(), ['向量召回产品架构', '向量检索技术架构'])
})

test('synchronizes article headings', () => {
  assert.match(replacePrimaryHeading('# 全文\n', 'RAG架构设计'), /^# RAG架构设计$/m)
  assert.match(replacePrimaryHeading('# 产品经理版\n', 'RAG架构设计｜产品经理版'), /^# RAG架构设计｜产品经理版$/m)
})

test('updates metadata but preserves derived_from', () => {
  const source = '---\narticle_title: 旧标题\ncategory: 旧分类\nderived_from: 全文.md\n---\n# 旧标题\n'
  const result = updateFrontmatter(source, { article_title: 'RAG架构设计', category: '数据与知识库' })
  assert.match(result, /article_title: RAG架构设计/)
  assert.match(result, /category: 数据与知识库/)
  assert.match(result, /derived_from: 全文\.md/)
})

test('rewrites links without replacing prose', () => {
  const source = '参见 [[RAG检索方案-22/全文]]。正文提到 RAG检索方案-22。'
  const pathMap = new Map([['RAG检索方案-22/全文', '数据与知识库/RAG架构设计/全文']])
  assert.equal(rewriteInternalLinks(source, pathMap), '参见 [[数据与知识库/RAG架构设计/全文]]。正文提到 RAG检索方案-22。')
})

test('ignores illustrative links inside fenced code blocks', () => {
  const source = '```markdown\n![示例](img_1 "iPhone 14")\n```\n'
  assert.deepEqual(findBrokenResourceLinks('/tmp/article', source), [])
})
