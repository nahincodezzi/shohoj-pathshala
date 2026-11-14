# Sohoj Pathshala (সহজ পাঠশালা) Rules

## Core Principles
1. **Multi-Tenant Isolation:**
   - Every single school (`school_id` / `slug`) is strictly isolated.
   - Never leak data across schools.
   - Platform Owner (`/owner`) is always in Indigo theme with bilingual support (Bangla/English).
   - School portals (`/:slug/admin`) and public portals (`/:slug`) operate independently.

2. **Design System & Tokens:**
   - Default Mode: Dark mode. Light mode toggleable via `mode-dark` / `mode-light` classes.
   - Default Theme: Emerald (`theme-emerald`), with option for Indigo (`theme-indigo`).
   - All colors must use CSS variables (`var(--primary)`, `var(--bg)`, `var(--surface)`, etc.).
   - No hardcoded hex color codes in JSX components.

3. **No External Database Dependencies:**
   - The platform operates self-contained in client-side robust mock storage (`TenantRepository` in `tenantStorage.js`) or local DB, preventing broken production builds or external Supabase connection errors.
   - Seed data for `bdhs` and `bahs` must remain fully intact.

4. **Zero Brand Relics:**
   - No mentions of "SchoolNet", "স্কুলনেট", "SN", or "Campus OS". Always "সহজ পাঠশালা" / "Sohoj Pathshala".

5. **Professional UX:**
   - Silky micro-animations (`animate-fade-in`, `animate-scale-in`).
   - Clean grouped dropdowns on desktop (`আমাদের সম্পর্কে ▾`, `একাডেমিক ▾`).
   - Mobile Sticky 4-tab bottom navigation bar (`হোম`, `নোটিশ`, `ভর্তি`, `রেজাল্ট`).
   - Accessible touch targets (≥ 44×44px).
   - Print engine (`@media print`): black text on pure white paper with official watermarks and signatures.

