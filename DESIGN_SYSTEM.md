# DESIGN SYSTEM: SKILLFORGE

This document defines the Design System for **SkillForge**. It contains design tokens, CSS variables, typography rules, component blueprints, and interaction specs.

---

## 1. Design Aesthetics & Values

The SkillForge visual identity is built on three core pillars:
1. **Editorial Sophistication**: Clean editorial layouts, strong typography hierarchy, wide margins, and purposeful whitespace. We treat learning content like a high-end publication.
2. **Technical Mastery (Code404)**: Minimalist indicators, precise details, monospaced utilities, and sub-pixel details that speak directly to engineers.
3. **Subtle Craftsmanship**: A deep charcoal canvas accented by warm gold (forging / skill development) and muted technical greens (compilation / progress). Avoid random purple/blue SaaS gradients or excessive neon glows.

---

## 2. Color Palette (Dark Theme First)

We use an custom-tailored dark color palette. Instead of harsh `#000000` or generic gray cards, we employ slate-charcoals with precise golden accents.

| Token | CSS Variable | Hex Value | Application |
| :--- | :--- | :--- | :--- |
| **Deep Canvas** | `--color-bg-base` | `#0A0C0E` | Main application background |
| **Surface Muted** | `--color-bg-surface` | `#111418` | Content panels, card backdrops |
| **Surface Elev** | `--color-bg-elevated`| `#171B21` | Popovers, active elements, hovers |
| **Forge Amber** | `--color-primary` | `#F59E0B` | Primary call-to-actions, brand accents |
| **Forge Muted** | `--color-primary-dim`| `#D97706` | Secondary active states, hover anchors |
| **Code Green** | `--color-success` | `#10B981` | Success states, correct codes, progress |
| **Text Primary** | `--color-text-main` | `#F9FAFB` | Headings, high-contrast texts |
| **Text Muted** | `--color-text-dim` | `#9CA3AF` | Supporting text, body descriptions |
| **Text Sub** | `--color-text-sub` | `#6B7280` | Placeholders, inactive links |
| **Border Sharp** | `--color-border` | `#1E252D` | Structure lines, separating elements |

---

## 3. Typography & Hierarchy

We import **Outfit** (for sharp, clean, geometric headings) and **Inter** (for high-readability body copy).

- **Heading Font Family**: `Outfit, sans-serif`
- **Body Font Family**: `Inter, sans-serif`
- **Monospace Font Family**: `JetBrains Mono, monospace`

### Typography Scales
- **Display Hero**: `4rem / 64px` | Line height `1.1` | Heavy tracking
- **H1 (Page Title)**: `2.5rem / 40px` | Line height `1.2`
- **H2 (Section Header)**: `1.875rem / 30px` | Line height `1.3`
- **H3 (Sub-section)**: `1.25rem / 20px` | Line height `1.4`
- **Body (Regular)**: `1rem / 16px` | Line height `1.6`
- **Body (Small/Muted)**: `0.875rem / 14px` | Line height `1.5`
- **Utility / Code**: `0.8125rem / 13px` | Line height `1.5`

---

## 4. Spacing System

We use a strict 8px/4px layout grid to ensure consistent alignment.
- **xs**: `4px`
- **sm**: `8px`
- **md**: `16px`
- **lg**: `24px`
- **xl**: `32px`
- **xxl**: `64px`
- **xxxl**: `128px`

---

## 5. Interaction & Animation Principles

1. **Micro-Interactions Only**: Hover states should be snappy and direct. A subtle scale increase (`scale: 1.01`) or text color shifts.
2. **Transition Speeds**:
   - Fast (Hover / Feedback): `120ms cubic-bezier(0.16, 1, 0.3, 1)`
   - Medium (Page slide / collapse): `300ms cubic-bezier(0.16, 1, 0.3, 1)`
3. **Purposeful Loading Transitions**: When data loads, use smooth opacity fades (`fade-in`) rather than bouncy layout shifts.

---

## 6. Component Blueprint Specifications

### 6.1. Navigation Bar (Editorial Layout)
- Minimal height: `72px`.
- Semi-transparent background with blur (`backdrop-filter: blur(12px)`), but no excessive borders. A single horizontal border at the bottom: `1px solid var(--color-border)`.
- Brand alignment: "SkillForge" in strong text, with a clean monospace label `by Code404` at `10px` height.

### 6.2. Buttons (Sizing & Visual Weight)
- **Primary Forge**: Filled with `var(--color-primary)` text `#0A0C0E`. Hover swaps color slightly, maintaining flat shapes (no neon shadows).
- **Secondary Code**: Transparent background, border `1px solid var(--color-border)`. Text `var(--color-text-main)`. Hover darkens the background to `var(--color-bg-surface)`.
- **Text Link**: No border, no background. Underline appears on hover.

### 6.3. Content Cards
- Background `var(--color-bg-surface)`.
- Border `1px solid var(--color-border)`.
- No rounded corners greater than `8px` (keep borders sharp, corporate, and editorial).
- Padding: `24px` (large padding keeps layouts clean and premium).
