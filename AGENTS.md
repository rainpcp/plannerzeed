# AGENTS.md - PlannerZeed Development Guide

## Tech Stack
- **Framework**: Next.js (App Router)
- **Package Manager**: Bun
- **Styling**: Tailwind CSS
- **Icons**: Material Symbols Outlined
- **Fonts**: Plus Jakarta Sans (headings), Inter (body)

## Design System (from ux-ui-pages/)

### Color Palette
```
primary: #85adff
primary-dim: #699cff
primary-container: #6e9fff
primary-fixed: #6e9fff
primary-fixed-dim: #5391ff
on-primary: #002c66
on-primary-container: #002150

secondary: #ac8aff
secondary-dim: #8455ef
secondary-container: #5516be
secondary-fixed: #dac9ff
secondary-fixed-dim: #ceb9ff
on-secondary: #280067
on-secondary-container: #d9c8ff

tertiary: #8ce7ff
tertiary-dim: #40ceed
tertiary-container: #53ddfc
tertiary-fixed: #53ddfc
tertiary-fixed-dim: #40ceed
on-tertiary: #005464
on-tertiary-container: #004b58

surface: #060e20
surface-dim: #060e20
surface-bright: #1f2b49
surface-container: #0f1930
surface-container-low: #091328
surface-container-lowest: #000000
surface-container-high: #141f38
surface-container-highest: #192540
surface-variant: #192540

background: #060e20
on-background: #dee5ff
on-surface: #dee5ff
on-surface-variant: #a3aac4
inverse-surface: #faf8ff
inverse-on-surface: #4d556b
inverse-primary: #005bc4

outline: #6d758c
outline-variant: #40485d

error: #ff716c
error-dim: #d7383b
error-container: #9f0519
on-error: #490006
on-error-container: #ffa8a3
```

### Border Radius
```
DEFAULT: 1rem
lg: 2rem
xl: 3rem
full: 9999px
```

### Fonts
```
headline: Plus Jakarta Sans (weights: 400, 500, 600, 700, 800)
body: Inter (weights: 300, 400, 500, 600)
label: Inter
```

### Key UI Patterns
- **Glass Panel**: `background: rgba(25, 37, 64, 0.6); backdrop-filter: blur(12px);`
- **Gradient Background**: `linear-gradient(135deg, #85adff 0%, #ac8aff 100%)`
- **Dark Mode**: Always dark theme (`class="dark"`)
- **Sidebar**: Fixed left, 72px (md:ml-72), backdrop blur
- **Mobile Nav**: Fixed bottom, glass effect, rounded pill style
- **FAB**: Bottom right, gradient bg, shadow

## Project Structure (from ux-ui-pages/)

### Pages to Create
| HTML File | Next.js Route | Thai Name | English Name |
|-----------|---------------|-----------|--------------|
| dashboard.html | `/` | ภาพรวมวันนี้ | Today Overview |
| calender.html | `/calendar` | ปฏิทิน | Calendar |
| tasks.html | `/tasks` | รายการงาน | Tasks |
| notes.html | `/notes` | บันทึก | Notes |
| setting.html | `/settings` | ตั้งค่า | Settings |

### Shared Components
- `Sidebar` - Desktop side navigation (fixed left, w-72)
- `TopNavBar` - Header with search, notifications
- `BottomNavBar` - Mobile bottom navigation
- `FAB` - Floating action button (add new)

## Setup Instructions

### 1. Initialize Project
```bash
bun create next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

### 2. Install Dependencies
```bash
bun add @fontsource/plus-jakarta-sans @fontsource/inter
```

### 3. Configure Tailwind (tailwind.config.ts)
Add the full color palette, border radius, and font families as defined above.

### 4. Add Global Styles (app/globals.css)
```css
@import "@fontsource/plus-jakarta-sans/400.css";
@import "@fontsource/plus-jakarta-sans/500.css";
@import "@fontsource/plus-jakarta-sans/600.css";
@import "@fontsource/plus-jakarta-sans/700.css";
@import "@fontsource/plus-jakarta-sans/800.css";
@import "@fontsource/inter/300.css";
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/500.css";
@import "@fontsource/inter/600.css";

@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

body {
  background-color: #060e20;
  color: #dee5ff;
  font-family: 'Inter', sans-serif;
}

.font-headline { font-family: 'Plus Jakarta Sans', sans-serif; }

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.glass-panel {
  background: rgba(25, 37, 64, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.main-gradient-bg {
  background: linear-gradient(135deg, #85adff 0%, #ac8aff 100%);
}
```

### 5. Layout Structure
```
app/
  layout.tsx          # Root layout with fonts, metadata
  page.tsx            # Dashboard (from dashboard.html)
  calendar/
    page.tsx          # Calendar (from calender.html)
  tasks/
    page.tsx          # Tasks (from tasks.html)
  notes/
    page.tsx          # Notes (from notes.html)
  settings/
    page.tsx          # Settings (from setting.html)
  components/
    sidebar.tsx       # Shared sidebar component
    top-navbar.tsx    # Shared top navigation bar
    bottom-nav.tsx    # Shared mobile bottom navigation
    fab.tsx           # Floating action button
```

## Conversion Guidelines

1. **Convert HTML to JSX**: Change `class` to `className`, `for` to `htmlFor`, close self-closing tags
2. **Extract shared components**: Sidebar, TopNavBar, BottomNavBar are repeated across pages - extract to components
3. **Use Next.js Image**: Replace `<img>` with `next/image` component
4. **Use Next.js Link**: Replace `<a href>` with `<Link>` from `next/link`
5. **Keep all Tailwind classes**: Preserve the exact styling from the HTML files
6. **Thai language**: Keep all Thai text as-is in the UI
7. **Dark mode**: The app is always dark mode, no light mode toggle needed

## Development Commands

```bash
bun dev        # Start development server
bun build      # Build for production
bun start      # Start production server
bun lint       # Run ESLint
```



