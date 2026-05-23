# SEO/GEO Optimization Report — 3daspire.com
*Generated: 2026-05-23 | Tool: seo-geo from ReScienceLab/opc-skills*

---

## Executive Summary

| Category | Status | Score |
|---|---|---|
| Meta Tags | Partial | 5/10 |
| Schema Markup (JSON-LD) | ❌ Missing | 0/10 |
| robots.txt | ❌ Missing | 0/10 |
| sitemap.xml | ❌ Missing | 0/10 |
| AI Bot Access | ❌ Not configured | 0/10 |
| Open Graph / Twitter Cards | Partial | 4/10 |
| Heading Structure | ✅ Good | 8/10 |
| Content Quality (GEO) | Partial | 5/10 |
| **Overall** | **Needs Work** | **28/80** |

**Domain:** 3daspire.com  
**Platform:** Cloudflare Pages (static HTML)  
**Primary keyword:** "Vectric Aspire 12 license"

---

## Step 1 — Website Audit Results

### ✅ What's Working

- `<title>` tag is keyword-rich: *"Vectric Aspire 12 - Full Lifetime License | Save $1,876 Today"*
- `<meta name="description">` present with value proposition + social proof
- Open Graph `og:title`, `og:description`, `og:image`, `og:type` present
- Google Search Console verification tag present
- H1 is present and contains primary keyword
- Statistics on page (8,347+ customers, 98% satisfaction) — great for GEO
- FAQ section with 8 questions/answers — just needs JSON-LD
- Trustpilot social proof present

### ❌ Critical Issues Found

| Issue | Impact | Priority |
|---|---|---|
| No `robots.txt` | AI bots don't know what to crawl | 🔴 High |
| No `sitemap.xml` | Pages undiscoverable | 🔴 High |
| No JSON-LD schema | 0 AI/rich-result visibility | 🔴 High |
| No `<link rel="canonical">` | Duplicate content risk | 🔴 High |
| No Twitter Card meta tags | No preview on X/Twitter | 🟡 Medium |
| Missing `og:url` & `og:site_name` | Incomplete OG data | 🟡 Medium |
| contact.html has no meta description | Poor SERP snippet | 🟡 Medium |
| No AI bot allowlist | Claude, GPT, Perplexity blocked by default | 🔴 High |

---

## Step 2 — Keyword Analysis

### Primary Target Keywords

| Keyword | Intent | Difficulty |
|---|---|---|
| `vectric aspire 12 license` | Commercial | Medium |
| `buy vectric aspire 12` | Transactional | Medium |
| `aspire 12 cnc software` | Informational/Commercial | Low |
| `vectric aspire lifetime license` | Transactional | Low |
| `cheap vectric aspire 12` | Transactional | Low |

### Long-Tail Opportunities (Low Competition)

- `vectric aspire 12 license key instant delivery`
- `vectric aspire 12 full version download`
- `aspire 12 cnc software for woodworking`
- `vectric aspire 12 vs vcarve pro`
- `how to install vectric aspire 12`

### ⚠️ International Keyword Conflict

"Aspire" is a generic term with many meanings. The brand name "ASPIRE" competes with:
- Microsoft Surface/Acer laptop lines
- General "aspire to" search intent
- Other software products

**Recommendation:** Always pair "aspire" with "vectric", "cnc", or "12" in all meta tags and headings.

---

## Step 3 — GEO Analysis (AI Search Engine Visibility)

### Princeton GEO Method Scores

| Method | Current | Potential Boost |
|---|---|---|
| ✅ Statistics (8,347+ customers, 98%) | Present | +37% |
| ❌ Cite authoritative sources | Missing | +40% |
| ❌ Expert quotations/testimonials marked up | Not structured | +30% |
| ✅ Authoritative tone | Good | +25% |
| ✅ Easy-to-understand content | Good | +20% |
| ✅ Technical terminology (toolpath, rotary, G-code) | Present | +18% |
| ❌ FAQPage JSON-LD schema | Missing | +40% AI |
| ❌ Answer-first format | Not applied | +15% |

**GEO Score: 3/8 methods applied**

### AI Platform-Specific Issues

#### ChatGPT (OpenAI)
- ❌ No content updated in last 30 days (stale = 3.2x fewer citations)
- ❌ Low backlink profile (needs >350K referring domains for high citation rate)
- ✅ Branded domain (3daspire.com) helps citation rate by +11%

#### Perplexity
- ❌ No `PerplexityBot` allowed in robots.txt (file missing)
- ❌ No FAQPage schema (highest citation driver for Perplexity)
- ❌ No PDF documentation hosted (Perplexity prioritizes PDFs)

#### Google AI Overview (SGE)
- ❌ No E-E-A-T signals (no author bio, no expert citations, no about page schema)
- ❌ No structured data / schema markup at all
- ❌ No topical authority cluster (no blog, no supporting articles)

#### Microsoft Copilot / Bing
- ❌ Not Bing-indexed (likely, as no sitemap submitted)
- ❌ Page speed unknown (must be <2s for Copilot citations)
- ❌ No clear entity definition for "3daspire.com"

#### Claude AI
- ❌ Brave Search indexing status unknown (Claude uses Brave)
- ✅ High factual density — good (pricing, specs, compatibility info)
- ✅ Clear structural clarity — good (headings are logical)

---

## Step 4 — Fixes Applied

The following files have been created/updated:

### New Files Created
- `public/robots.txt` — allows all AI bots, blocks admin paths
- `public/sitemap.xml` — indexes all 6 public pages

### Files Updated
- `public/index.html` — added canonical, Twitter cards, og:url, og:site_name, FAQPage JSON-LD, Product JSON-LD, Organization JSON-LD, WebSite JSON-LD with SearchAction
- `public/contact.html` — added meta description, canonical

---

## Step 5 — Recommendations Backlog

### 🔴 High Priority (Do Now)
1. **Submit sitemap** to Google Search Console: `https://search.google.com/search-console` → Sitemaps → `https://3daspire.com/sitemap.xml`
2. **Submit to Bing Webmaster Tools**: `https://www.bing.com/webmasters` for Copilot indexing
3. **Add a blog/articles section** — topical authority cluster (e.g., "How to use Aspire 12 for 3D carving", "Aspire 12 vs VCarve Pro comparison")
4. **Add customer review schema** (ReviewAggregate) to index.html — your Trustpilot 98% score is a gold mine

### 🟡 Medium Priority
5. **Add video schema** (VideoObject JSON-LD) for your tutorial video section
6. **Create an /about page** with Organization schema + E-E-A-T signals (founding story, expertise)
7. **Add breadcrumb schema** to all inner pages
8. **Host a PDF spec sheet** for Aspire 12 — Perplexity prioritizes PDFs
9. **Update content regularly** — ChatGPT cites pages updated within 30 days 3.2x more

### 🟢 Low Priority
10. **Target featured snippets**: rewrite FAQ answers to lead with a 1-sentence direct answer
11. **Add HowTo schema** for installation guide
12. **LinkedIn/GitHub mentions** — signals for Microsoft Copilot
13. **Get backlinks** from CNC forums (CNCzone.com, ShopBot community, V&V Creative forum)

---

## Validation Checklist

After deploying changes:
- [ ] Google Rich Results Test: `https://search.google.com/test/rich-results?url=https://3daspire.com`
- [ ] Schema.org Validator: `https://validator.schema.org/?url=https://3daspire.com`
- [ ] Google site: check: `https://www.google.com/search?q=site:3daspire.com`
- [ ] Bing site: check: `https://www.bing.com/search?q=site:3daspire.com`
- [ ] Verify robots.txt: `https://3daspire.com/robots.txt`
- [ ] Verify sitemap: `https://3daspire.com/sitemap.xml`
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools

---

*Report generated using seo-geo skill v1.0.0 from [ReScienceLab/opc-skills](https://github.com/ReScienceLab/opc-skills)*
