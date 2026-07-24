import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const EXPECTED_CATEGORIES = new Map([
  ['GEO 产品 Agent 方案', 23],
  ['品牌诊断', 9],
  ['网页诊断与 SEO', 9],
  ['指标与评测', 8],
  ['Prompt 与关键词', 7],
  ['内容生成与优化', 7],
  ['数据与知识库', 14],
  ['电商与行业场景', 5],
  ['产品规划与商业化', 9],
  ['算法与模型', 19],
  ['工程、接口与运维', 6],
])

const OLD_ROOTS = new Set(['GEO 产品 Agent 方案', '产品功能', '工程与运维'])

function readUtf8(file) {
  const buffer = fs.readFileSync(file)
  return new TextDecoder('utf-8', { fatal: true }).decode(buffer)
}

function directories(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.geo-migration-staging-'))
    .map(entry => entry.name)
    .sort((a, b) => a.localeCompare(b, 'zh-CN'))
}

export function loadInventory(vaultPath) {
  const items = []
  for (const sourceRoot of directories(vaultPath)) {
    const rootPath = path.join(vaultPath, sourceRoot)
    for (const oldTitle of directories(rootPath)) {
      const sourceDir = path.join(rootPath, oldTitle)
      if (!fs.existsSync(path.join(sourceDir, '全文.md'))) continue
      items.push({ sourceRoot, oldTitle, sourceDir })
    }
  }
  return items
}

function parseMarkdownTableRow(line) {
  const match = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/u)
  return match ? match.slice(1).map(value => value.trim()) : null
}

export function parseTitleMap(specPath) {
  const result = new Map()
  for (const line of readUtf8(specPath).split(/\r?\n/u)) {
    const row = parseMarkdownTableRow(line)
    if (!row || row[0] === '来源目录' || row[0] === '---') continue
    const [sourceRoot, oldTitle, newTitle] = row
    const key = `${sourceRoot}\0${oldTitle}`
    if (result.has(key)) throw new Error(`duplicate title mapping: ${sourceRoot}/${oldTitle}`)
    result.set(key, newTitle)
  }
  return result
}

function stripSourceQualifier(title) {
  const product = title.match(/^(.*)（原位于产品功能）$/u)
  if (product) return { title: product[1], sourceRoot: '产品功能' }
  const agent = title.match(/^(.*)（原位于GEO 产品 Agent 方案）$/u)
  if (agent) return { title: agent[1], sourceRoot: 'GEO 产品 Agent 方案' }
  return { title, sourceRoot: null }
}

export function parseCategoryMap(specPath, inventory) {
  const lines = readUtf8(specPath).split(/\r?\n/u)
  const result = new Map()
  let inMapping = false
  let category = null
  for (const line of lines) {
    if (line === '## 文章迁移映射') { inMapping = true; continue }
    if (line === '## 迁移方法') break
    if (!inMapping) continue
    const heading = line.match(/^### (.+?)｜\d+ 篇$/u)
    if (heading) { category = heading[1]; continue }
    const bullet = line.match(/^- (.+)$/u)
    if (!bullet || !category) continue
    const parsed = stripSourceQualifier(bullet[1])
    let matches = inventory.filter(item => item.oldTitle === parsed.title)
    if (parsed.sourceRoot) matches = matches.filter(item => item.sourceRoot === parsed.sourceRoot)
    if (matches.length !== 1) {
      throw new Error(`category mapping is ambiguous: ${category}/${bullet[1]} matches=${matches.length}`)
    }
    const key = `${matches[0].sourceRoot}\0${matches[0].oldTitle}`
    if (result.has(key)) throw new Error(`duplicate category mapping: ${key.replace('\0', '/')}`)
    result.set(key, category)
  }
  return result
}

export function buildMigrationPlan(inventory, titleMap, categoryMap, vaultPath = null) {
  const vault = vaultPath || (inventory[0] ? path.dirname(path.dirname(inventory[0].sourceDir)) : '')
  const plan = inventory.map(item => {
    const key = `${item.sourceRoot}\0${item.oldTitle}`
    const targetCategory = categoryMap.get(key)
    if (!targetCategory) throw new Error(`missing category mapping: ${item.sourceRoot}/${item.oldTitle}`)
    const newTitle = titleMap.get(key) || item.oldTitle
    return {
      ...item,
      targetCategory,
      newTitle,
      targetDir: path.join(vault, targetCategory, newTitle),
    }
  })
  return validateMigrationPlan(plan)
}

export function validateMigrationPlan(plan) {
  const sources = new Set()
  const targets = new Set()
  const categoryCounts = new Map()
  for (const item of plan) {
    if (/[与和]/u.test(item.newTitle)) throw new Error(`forbidden conjunction: ${item.newTitle}`)
    if (sources.has(item.sourceDir)) throw new Error(`duplicate source: ${item.sourceDir}`)
    if (targets.has(item.targetDir)) throw new Error(`target collision: ${item.targetDir}`)
    sources.add(item.sourceDir)
    targets.add(item.targetDir)
    categoryCounts.set(item.targetCategory, (categoryCounts.get(item.targetCategory) || 0) + 1)
  }
  if (plan.length !== 116) throw new Error(`expected 116 articles, received ${plan.length}`)
  for (const [category, count] of EXPECTED_CATEGORIES) {
    if (categoryCounts.get(category) !== count) {
      throw new Error(`category count mismatch: ${category} expected=${count} actual=${categoryCounts.get(category) || 0}`)
    }
  }
  return plan
}

export function replacePrimaryHeading(markdown, heading) {
  let replaced = false
  const result = markdown.replace(/^# .+$/mu, () => {
    replaced = true
    return `# ${heading}`
  })
  if (!replaced) throw new Error(`missing H1 for ${heading}`)
  return result
}

export function updateFrontmatter(markdown, fields) {
  if (!markdown.startsWith('---\n')) return markdown
  const end = markdown.indexOf('\n---\n', 4)
  if (end < 0) throw new Error('malformed frontmatter')
  const block = markdown.slice(4, end)
  const rest = markdown.slice(end + 5)
  const lines = block.split('\n')
  const seen = new Set()
  const updated = lines.map(line => {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):/u)
    if (!match || !(match[1] in fields)) return line
    seen.add(match[1])
    return `${match[1]}: ${fields[match[1]]}`
  })
  for (const [key, value] of Object.entries(fields)) {
    if (!seen.has(key) && key === 'article_title') updated.push(`${key}: ${value}`)
  }
  return `---\n${updated.join('\n')}\n---\n${rest}`
}

export function rewriteInternalLinks(markdown, pathMap) {
  return markdown.replace(/\[\[([^\]|#]+)(#[^\]|]+)?(\|[^\]]+)?\]\]/gu, (full, rawTarget, anchor = '', alias = '') => {
    const target = rawTarget.trim()
    const replacement = pathMap.get(target)
    if (!replacement) return full
    return `[[${replacement}${anchor}${alias}]]`
  })
}

function buildLinkMap(plan) {
  const map = new Map()
  for (const item of plan) {
    const newBase = `${item.targetCategory}/${item.newTitle}`
    const oldBases = [item.oldTitle, `${item.sourceRoot}/${item.oldTitle}`]
    for (const oldBase of oldBases) {
      map.set(oldBase, newBase)
      map.set(`${oldBase}/全文`, `${newBase}/全文`)
      map.set(`${oldBase}/产品经理版`, `${newBase}/产品经理版`)
    }
  }
  return map
}

export function prepareMarkdown(plan) {
  const linkMap = buildLinkMap(plan)
  return plan.map(item => {
    const fullPath = path.join(item.sourceDir, '全文.md')
    const pmPath = path.join(item.sourceDir, '产品经理版.md')
    const originalFullText = readUtf8(fullPath)
    const originalPmText = readUtf8(pmPath)
    let fullText = replacePrimaryHeading(originalFullText, item.newTitle)
    let pmText = replacePrimaryHeading(originalPmText, `${item.newTitle}｜产品经理版`)
    fullText = updateFrontmatter(fullText, { article_title: item.newTitle, category: item.targetCategory })
    pmText = updateFrontmatter(pmText, { article_title: item.newTitle, category: item.targetCategory })
    fullText = rewriteInternalLinks(fullText, linkMap)
    pmText = rewriteInternalLinks(pmText, linkMap)
    return { ...item, originalFullText, originalPmText, fullText, pmText }
  })
}

function allFiles(dir) {
  const output = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) output.push(...allFiles(full))
    else if (entry.isFile()) output.push(full)
  }
  return output
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
}

function countPreMigrationResources(plan, sourceImageDir) {
  let full = 0, pm = 0, ocr = 0, originals = 0, svg = 0, shapeErrors = 0
  const originalFiles = []
  for (const item of plan) {
    const entries = fs.readdirSync(item.sourceDir).sort()
    if (entries.join('\0') !== ['产品经理版.md', '全文.md', '资源'].sort().join('\0')) shapeErrors++
    if (fs.existsSync(path.join(item.sourceDir, '全文.md'))) full++
    if (fs.existsSync(path.join(item.sourceDir, '产品经理版.md'))) pm++
    const resources = allFiles(path.join(item.sourceDir, '资源'))
    ocr += resources.filter(file => path.basename(file).startsWith('OCR｜')).length
    const originalsHere = resources.filter(file => path.basename(file).startsWith('原图｜'))
    originals += originalsHere.length
    originalFiles.push(...originalsHere)
    svg += resources.filter(file => path.extname(file).toLowerCase() === '.svg').length
  }
  const sourceHashes = new Set(allFiles(sourceImageDir).map(sha256))
  const hashMismatches = originalFiles.filter(file => !sourceHashes.has(sha256(file))).length
  return { full, pm, ocr, originals, svg, shapeErrors, hashMismatches }
}

export function findBrokenResourceLinks(articleDir, markdown) {
  const broken = []
  const visibleMarkdown = markdown.replace(/```[\s\S]*?```/gu, '')
  for (const match of visibleMarkdown.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/gu)) {
    const target = decodeURIComponent(match[1].trim())
    if (!target.startsWith('资源/')) continue
    if (!fs.existsSync(path.join(articleDir, target))) broken.push(target)
  }
  for (const match of visibleMarkdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/gu)) {
    const target = decodeURIComponent(match[1].trim().replace(/^<|>$/gu, ''))
    if (/^(?:https?:|mailto:|#|data:)/u.test(target)) continue
    if (!fs.existsSync(path.resolve(articleDir, target))) broken.push(target)
  }
  return broken
}

export function validateTables(markdown) {
  let inFence = false
  let expected = null
  for (const line of markdown.split(/\r?\n/u)) {
    if (/^```/u.test(line.trim())) { inFence = !inFence; expected = null; continue }
    if (inFence) continue
    if (/^\s*\|.*\|\s*$/u.test(line)) {
      const cells = line.replace(/\\\|/gu, '').split('|').length - 2
      if (expected === null) expected = cells
      else if (cells !== expected) return false
    } else expected = null
  }
  return true
}

function categorySummary(plan) {
  const counts = new Map()
  for (const item of plan) counts.set(item.targetCategory, (counts.get(item.targetCategory) || 0) + 1)
  return counts
}

function dryRun(vault, categorySpec, titleSpec) {
  const inventory = loadInventory(vault)
  const plan = buildMigrationPlan(inventory, parseTitleMap(titleSpec), parseCategoryMap(categorySpec, inventory), vault)
  const prepared = prepareMarkdown(plan)
  let brokenResources = 0
  for (const item of prepared) {
    brokenResources += findBrokenResourceLinks(item.sourceDir, item.fullText).length
    brokenResources += findBrokenResourceLinks(item.sourceDir, item.pmText).length
  }
  const resources = countPreMigrationResources(plan, '/Users/mac/Desktop/GEO图')
  const renamed = plan.filter(item => item.oldTitle !== item.newTitle).length
  console.log(`articles=${plan.length} renamed=${renamed} unchanged=${plan.length - renamed} categories=${categorySummary(plan).size}`)
  console.log(`target_collisions=0 missing_sources=0 broken_links_before_write=${brokenResources}`)
  console.log(`全文.md=${resources.full} 产品经理版.md=${resources.pm} OCR=${resources.ocr} original_images=${resources.originals} SVG=${resources.svg}`)
  console.log(`article_root_shape_errors=${resources.shapeErrors} source_image_hash_mismatches=${resources.hashMismatches}`)
  if (brokenResources || resources.full !== 116 || resources.pm !== 116 || resources.ocr !== 116 || resources.originals !== 116 || resources.svg < 126 || resources.shapeErrors || resources.hashMismatches) {
    throw new Error('dry-run invariants failed')
  }
  console.log('DRY_RUN_OK')
}

function applyMigration(vault, categorySpec, titleSpec) {
  const inventory = loadInventory(vault)
  const plan = buildMigrationPlan(inventory, parseTitleMap(titleSpec), parseCategoryMap(categorySpec, inventory), vault)
  const prepared = prepareMarkdown(plan)
  const staging = path.join(vault, `.geo-migration-staging-${process.pid}`)
  if (fs.existsSync(staging)) throw new Error(`staging exists: ${staging}`)
  for (const item of plan) if (!fs.existsSync(item.sourceDir)) throw new Error(`source missing: ${item.sourceDir}`)
  for (const item of plan) {
    if (item.targetDir !== item.sourceDir && fs.existsSync(item.targetDir) && !OLD_ROOTS.has(item.targetCategory)) {
      throw new Error(`target already exists: ${item.targetDir}`)
    }
  }
  fs.mkdirSync(staging)
  const locations = new Map()
  try {
    prepared.forEach((item, index) => {
      const staged = path.join(staging, String(index).padStart(3, '0'))
      fs.renameSync(item.sourceDir, staged)
      locations.set(item.sourceDir, staged)
    })
    for (const category of EXPECTED_CATEGORIES.keys()) fs.mkdirSync(path.join(vault, category), { recursive: true })
    for (const item of prepared) {
      const staged = locations.get(item.sourceDir)
      if (fs.existsSync(item.targetDir)) throw new Error(`target collision during apply: ${item.targetDir}`)
      fs.renameSync(staged, item.targetDir)
      locations.set(item.sourceDir, item.targetDir)
      fs.writeFileSync(path.join(item.targetDir, '全文.md'), item.fullText)
      fs.writeFileSync(path.join(item.targetDir, '产品经理版.md'), item.pmText)
    }
    for (const oldRoot of OLD_ROOTS) {
      const oldPath = path.join(vault, oldRoot)
      if (fs.existsSync(oldPath) && fs.readdirSync(oldPath).length === 0) fs.rmdirSync(oldPath)
    }
    fs.rmdirSync(staging)
    console.log(`MIGRATION_OK articles=${prepared.length} categories=${EXPECTED_CATEGORIES.size}`)
  } catch (error) {
    for (const item of [...prepared].reverse()) {
      const current = locations.get(item.sourceDir)
      if (!current || !fs.existsSync(current)) continue
      fs.mkdirSync(path.dirname(item.sourceDir), { recursive: true })
      if (fs.existsSync(item.sourceDir)) throw new Error(`rollback blocked by existing source: ${item.sourceDir}; original error: ${error.message}`)
      fs.renameSync(current, item.sourceDir)
      fs.writeFileSync(path.join(item.sourceDir, '全文.md'), item.originalFullText)
      fs.writeFileSync(path.join(item.sourceDir, '产品经理版.md'), item.originalPmText)
    }
    if (fs.existsSync(staging) && fs.readdirSync(staging).length === 0) fs.rmdirSync(staging)
    throw error
  }
}

function firstH1(markdown) {
  return markdown.match(/^# (.+)$/mu)?.[1] || null
}

function frontmatterValue(markdown, key) {
  if (!markdown.startsWith('---\n')) return null
  const end = markdown.indexOf('\n---\n', 4)
  if (end < 0) return '__MALFORMED__'
  return markdown.slice(4, end).match(new RegExp(`^${key}:\\s*(.+)$`, 'mu'))?.[1]?.trim() || null
}

function verifyVault(vault) {
  const inventory = loadInventory(vault)
  const roots = directories(vault)
  let shapeErrors = 0, headings = 0, metadata = 0, brokenResources = 0
  let fullCount = 0, pmCount = 0, ocr = 0, originals = 0, svg = 0
  let invalidSvg = 0, fenceErrors = 0, tableErrors = 0, invalidUtf8 = 0
  const originalFiles = []
  const titles = new Set()
  let duplicates = 0, forbidden = 0
  const xmllint = spawnSync('sh', ['-c', 'command -v xmllint'], { encoding: 'utf8' }).status === 0
  for (const item of inventory) {
    if (titles.has(item.oldTitle)) duplicates++
    titles.add(item.oldTitle)
    if (/[与和]/u.test(item.oldTitle)) forbidden++
    const entries = fs.readdirSync(item.sourceDir).sort()
    if (entries.join('\0') !== ['产品经理版.md', '全文.md', '资源'].sort().join('\0')) shapeErrors++
    let fullText, pmText
    try {
      fullText = readUtf8(path.join(item.sourceDir, '全文.md')); fullCount++
      pmText = readUtf8(path.join(item.sourceDir, '产品经理版.md')); pmCount++
    } catch { invalidUtf8++; continue }
    if (firstH1(fullText) !== item.oldTitle) headings++
    if (firstH1(pmText) !== `${item.oldTitle}｜产品经理版`) headings++
    for (const text of [fullText, pmText]) {
      const articleTitle = frontmatterValue(text, 'article_title')
      const category = frontmatterValue(text, 'category')
      if (articleTitle && articleTitle !== item.oldTitle) metadata++
      if (category && category !== item.sourceRoot) metadata++
      brokenResources += findBrokenResourceLinks(item.sourceDir, text).length
      if ((text.match(/^```/gmu) || []).length % 2) fenceErrors++
      if (!validateTables(text)) tableErrors++
    }
    const resources = allFiles(path.join(item.sourceDir, '资源'))
    ocr += resources.filter(file => path.basename(file).startsWith('OCR｜')).length
    const originalsHere = resources.filter(file => path.basename(file).startsWith('原图｜'))
    originals += originalsHere.length
    originalFiles.push(...originalsHere)
    const svgs = resources.filter(file => path.extname(file).toLowerCase() === '.svg')
    svg += svgs.length
    if (xmllint) {
      for (const file of svgs) if (spawnSync('xmllint', ['--noout', file]).status !== 0) invalidSvg++
    } else {
      for (const file of svgs) {
        const text = readUtf8(file)
        if (!/<svg[\s>]/u.test(text) || !/<\/svg>/u.test(text)) invalidSvg++
      }
    }
  }
  const sourceHashes = new Set(allFiles('/Users/mac/Desktop/GEO图').map(sha256))
  const hashMismatches = originalFiles.filter(file => !sourceHashes.has(sha256(file))).length
  const categoryCounts = new Map(roots.map(root => [root, directories(path.join(vault, root)).filter(name => fs.existsSync(path.join(vault, root, name, '全文.md'))).length]))
  let categoryErrors = roots.length === EXPECTED_CATEGORIES.size ? 0 : 1
  for (const [root, count] of EXPECTED_CATEGORIES) if (categoryCounts.get(root) !== count) categoryErrors++
  const oldCategoryDirectories = ['产品功能', '工程与运维'].filter(root => fs.existsSync(path.join(vault, root))).length
  const stagingDirectories = fs.readdirSync(vault).filter(name => name.startsWith('.geo-migration-staging-')).length
  console.log(`articles=${inventory.length} categories=${roots.length} duplicate_titles=${duplicates} forbidden_title_patterns=${forbidden}`)
  console.log(`article_root_shape_errors=${shapeErrors} heading_mismatches=${headings} frontmatter_mismatches=${metadata}`)
  console.log(`全文.md=${fullCount} 产品经理版.md=${pmCount} OCR=${ocr} original_images=${originals} SVG=${svg}`)
  console.log(`source_image_hash_mismatches=${hashMismatches} missing_resource_links=${brokenResources} invalid_svg=${invalidSvg}`)
  console.log(`unbalanced_code_fences=${fenceErrors} malformed_tables=${tableErrors} invalid_utf8=${invalidUtf8}`)
  console.log(`old_category_directories=${oldCategoryDirectories} staging_directories=${stagingDirectories} category_count_errors=${categoryErrors}`)
  const errors = [inventory.length !== 116, roots.length !== 11, duplicates, forbidden, shapeErrors, headings, metadata, fullCount !== 116, pmCount !== 116, ocr !== 116, originals !== 116, svg < 126, hashMismatches, brokenResources, invalidSvg, fenceErrors, tableErrors, invalidUtf8, oldCategoryDirectories, stagingDirectories, categoryErrors].filter(Boolean)
  if (errors.length) throw new Error(`verification failed: ${errors.length} check groups`)
  console.log('VERIFY_OK')
}

function parseArgs(argv) {
  const args = new Map()
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      if (['--dry-run', '--apply', '--verify'].includes(arg)) args.set(arg, true)
      else args.set(arg, argv[++i])
    }
  }
  return args
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
if (isMain) {
  try {
    const args = parseArgs(process.argv.slice(2))
    const vault = args.get('--vault')
    if (!vault) throw new Error('--vault is required')
    if (args.get('--verify')) verifyVault(vault)
    else {
      const categorySpec = args.get('--category-spec')
      const titleSpec = args.get('--title-spec')
      if (!categorySpec || !titleSpec) throw new Error('--category-spec and --title-spec are required')
      if (args.get('--dry-run')) dryRun(vault, categorySpec, titleSpec)
      else if (args.get('--apply')) applyMigration(vault, categorySpec, titleSpec)
      else throw new Error('choose --dry-run, --apply, or --verify')
    }
  } catch (error) {
    console.error(`ERROR ${error.message}`)
    process.exitCode = 1
  }
}
