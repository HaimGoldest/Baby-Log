# CLAUDE.md

Project guidance for Claude Code in this repository. This file is the single source of truth for how code is written here; follow it in addition to any task instructions.

## Project context

Baby-Log is an Angular application (Angular Material, Firebase) with a Hebrew, right-to-left UI.

The project should follow modern Angular architecture, clean reusable component design, and maintainable feature-based structure.

When suggesting code, prefer practical production-ready Angular code over generic examples.

## Critical constraints

These override convenience every time.

- **Git discipline:** Never commit, amend, push, or create branches unless explicitly instructed. Leave all changes in the working tree.
- **Verification gates:** Verify every change with all three of these, and report the results. Each must finish with 0 errors:
  ```powershell
  npx tsc -p tsconfig.app.json --noEmit
  npx ng lint
  npx ng build
  ```
- **Virtual scroll fixed height:** The main events feed renders event cards in a `cdk-virtual-scroll-viewport` with a fixed item size. `BABY_EVENT_CARD_ITEM_SIZE` (exported from `baby-event-card.component.ts`) is both the viewport's `itemSize` and the card host's height. Never introduce variable-height event cards: every row in a card stays a single line (`white-space: nowrap; overflow: hidden; text-overflow: ellipsis`) or a fixed-size box, with no conditional rows that add height. The one exception is the note, clamped to two lines (`-webkit-line-clamp: 2` with `overflow-wrap: anywhere`) inside a budget that fits the slot; any other wrapping text needs the same clamp and a re-checked budget. The card host keeps `contain: inline-size`, so no text in a card can widen the feed. To change the slot height, change only that constant.
- **Mobile-first priority:** Design and verify every layout for narrow mobile viewports (360px wide) first, then add larger-breakpoint enhancements.

## Angular rules

- Use standalone components.
- Use Angular 20+ control flow syntax: `@if`, `@for`, and `@switch`.
- Prefer signals for local reactive state when appropriate.
- Use RxJS only when it is the better fit, especially for streams, HTTP, async flows, Firebase streams, and existing Observable-based APIs.
- Use explicit TypeScript types for method parameters and return values.
- Avoid the `any` type unless the existing project model already requires it.
- Use `private`, `protected`, and `public` visibility modifiers explicitly.
- Keep components small and focused.
- Move reusable logic to services, utilities, directives, pipes, or shared components.
- Prefer dependency injection with `inject()` when it fits the existing project style.
- Avoid unnecessary NgModules unless the existing project structure requires them.

## TypeScript rules

- Prefer `interface` or `type` models for structured data.
- Prefer string literal unions when the values are simple and no runtime enum object is needed.
- Use `enum` only when runtime enum behavior is useful or already used by the project.
- Avoid duplicated types.
- Avoid implicit return types on public methods.
- Prefer immutable updates when working with signals, arrays, or objects.
- Do not introduce complex abstractions unless they clearly reduce duplication or improve maintainability.

## UI and styling rules

- Use Angular Material only for UI components.
- Do not use Bootstrap.
- Do not use Tailwind.
- Use SCSS files for styling.
- Keep a clear visual hierarchy.
- Prefer accessible Angular Material components over custom HTML when possible.
- Ensure keyboard accessibility and visible focus states.
- Include loading, empty, and error states when relevant.
- Prefer semantic HTML where possible.
- Avoid inline styles unless there is a clear reason.

## Angular Material rules

- Prefer Angular Material components for forms, buttons, dialogs, cards, navigation, tooltips, icons, tables, and layout-related UI.
- Keep Material usage consistent across the project.
- Do not mix Angular Material with Bootstrap or Tailwind.
- Use Material form-field patterns consistently.
- Provide accessible labels, hints, and error messages for form controls.
- Use dialogs, snackbars, and tooltips only when they improve UX and are not overused.

## Design system and SCSS rules

Styling is global-first: a single design system in `src/styles.scss`, built on Angular Material 3 (`mat.theme()`) and CSS custom properties.

- Take every visual value from a design token:
  - `--app-*` for app semantics: surfaces, borders, shadows, text, brand, font, status pairs (`--app-success`, `--app-info`, `--app-warning`, `--app-danger`, each with a `-bg`), and the derived `--app-surface-overlay`, `--app-state-hover` and `--app-shadow-bar`.
  - `--mat-sys-*` for Material system roles: type (`font: var(--mat-sys-title-medium)`) and shape (`var(--mat-sys-corner-large)`).
- Never put color literals (`#hex`, `rgb()`/`rgba()`, named colors) in component SCSS. If no token fits, add one to `src/styles.scss` rather than hardcoding a value. Derive tints with `color-mix()` over tokens when needed.
- Theme values live only in the `:root[data-theme='…']` blocks and the `$_theme-key-colors` and `$_category-color-palette` maps in `src/styles.scss`. To add a theme: add an `{ id, label }` entry to `APP_THEMES` in `src/app/core/theme/app-themes.ts` (label in `app-themes.strings.ts`), add its background and primary to `$_theme-key-colors`, and give it a matching `:root[data-theme='<id>']` block. The theme picker and its swatch then pick it up automatically.
- Restyle Material components with token overrides (`mat.<component>-overrides()` in `src/styles.scss`), not by targeting their internal classes. App-wide card, toolbar and FAB looks are already defined there.
- Do not use `!important` or `::ng-deep`. To let a parent adjust a child component, give the child a CSS custom property hook (as `AlertMessageComponent` does with `--alert-elevation`).
- Established patterns — reuse them rather than restyling locally:
  - **Cards:** content cards are `<mat-card appearance="outlined">` (surface, hairline border, soft shadow); the default elevated card is for tonal surfaces such as alerts.
  - **Buttons:** the primary action is `mat-flat-button`; secondary actions are `mat-button` or `mat-stroked-button`. Add `app-danger-action` or `app-success-action` to any Material button, icon button or menu item to color it by meaning.
  - **Do not use the M2 `color="primary|accent|warn"` attribute** — it has no effect in this theme.
  - **Event categories:** show a category's icon with `<app-category-icon [category]>` (size it with `--category-icon-size`). By default every category takes the active theme's container pair (`--app-primary-container` / `--app-on-primary-container`), so a new category needs no styling. Users can give a category one of the 20 `CATEGORY_COLOR_PALETTE` colours (`src/app/core/theme/category-colors.ts`, labels in `category-colors.strings.ts`) from the "בחר צבע קטגוריה" menu on each favorite card in the preferences page; the choices are saved sparsely in `User.categoryColors`, with no entry for a category on the default. `<app-category-icon>` applies them by itself (pass `[colorOverride]` to preview an unsaved choice); anything else resolves the colour id with `resolveCategoryColor(sessionStore.categoryColors(), categoryId)` and binds it to `data-category-color` (as the event card's pill does).
  - **Category colour tokens:** each palette colour has `--app-cat-palette-<id>-bg` / `-fg` tokens (light values on `:root`, glare-free values in the `dark` block, every pair ≥ 5:1), and `default` maps to the theme's container pair. An element with `data-category-color="<id>"` exposes the chosen pair as `--app-cat-bg` / `--app-cat-fg`, plus `--app-cat-accent` for preview swatches; read them with a fallback, e.g. `var(--app-cat-bg, var(--app-primary-container))`. To add a colour: add an `{ id, label }` entry to `CATEGORY_COLOR_PALETTE` and a row to `$_category-color-palette`. Ids are stored in user profiles, so never rename or remove one; retune its values in `styles.scss` instead.
  - **Themes:** never write `data-theme` or the theme cache directly. `ThemeService.preview()` shows a theme on screen only, and `cancelPreview()` returns to the saved one (the preferences page calls it on cancel and in `ngOnDestroy`). A theme is saved with the rest of the preferences in one `SessionStore.updatePreferences()` write, followed by `ThemeService.confirmSaved()`, which caches it. To preview a theme that is not active, put `data-theme-swatch="<id>"` on an element and read `--app-swatch-bg` / `--app-swatch-primary` (as `ThemePickerComponent` does).
  - **Pages** scroll themselves (`:host { flex: 1; min-height: 0; overflow-y: auto; }`), because the app shell's `main` hides overflow.
  - **Settings sections:** the preferences page groups settings in `mat-expansion-panel`s that start collapsed. Top-level panels (`.app-preferences-panel` inside a plain `.app-preferences-panels` container, not a `mat-accordion`, which would square their corners) look like outlined cards; sub-panels go in `<mat-accordion multi displayMode="flat" class="app-preferences-subpanels">` with `.app-preferences-subpanel`. Their looks live in section 7 of `src/styles.scss`. A new settings area is one more top-level panel.
- Keep component SCSS focused on layout: display, flex/grid, gap, sizing, positioning, and responsive breakpoints.
- Use CSS logical properties (`margin-inline-start`, `padding-inline`, `inset-inline`, `border-block-end`) rather than left/right, so layouts hold in RTL.
- Use clear class names and simple, readable selectors; avoid deep nesting.
- Write mobile-first styles, then add larger breakpoint overrides.
- Keep text contrast at WCAG AA (4.5:1 for text, 3:1 for UI boundaries) in every theme, including `dark`.

## Hebrew and RTL rules

- When creating Hebrew UI, use proper RTL layout. The document is `dir="rtl"`; rely on it rather than per-component direction.
- Do not hard-code left/right assumptions when start/end is more appropriate.
- Never add letter-spacing to Hebrew text.
- Support mixed Hebrew and English content carefully.
- Keep Hebrew user-facing text natural and concise, and keep it in the feature's `*.strings.ts` file.
- Comments in code must still be in English only.
- Avoid layout choices that break in RTL.

## Code style

- Write comments only in English.
- Add documentation for classes, methods, or complex logic when useful.
- Do not add obvious comments.
- Keep naming clear and consistent.
- Prefer readable code over clever code.
- Avoid duplicated logic.
- Avoid large methods.
- Avoid mixing unrelated responsibilities in the same component or service.
- Preserve the existing code style when editing existing files.

## Architecture

- Prefer a clear folder structure:
  - `core` for singleton services, guards, interceptors, app-wide providers, Firebase setup, and application-level infrastructure.
  - `features` for feature-specific pages, components, services, and state.
  - `shared` for reusable UI components, pipes, directives, utilities, and common models.
  - `models` for interfaces, DTOs, enums, and types when they are shared or domain-level.
- Keep feature logic inside the relevant feature when it is not reused elsewhere.
- Do not introduce new libraries unless there is a clear reason.
- Prefer small reusable services over large god services.
- Keep Firebase access behind services instead of calling Firebase directly from components.
- Components should focus on presentation and user interaction.
- Services should handle data access, persistence, and business logic.

## State management

- Prefer Angular signals for simple local component state.
- Prefer services with signals for lightweight shared state.
- Use RxJS when dealing with streams, Firebase Observables, HTTP flows, subscriptions, or async composition.
- Avoid unnecessary state libraries unless explicitly requested.
- Avoid memory leaks.
- Use `takeUntilDestroyed`, `DestroyRef`, `async` pipe, or signals interop where appropriate.
- Do not manually subscribe in components unless there is a clear reason and cleanup is handled.

## Firebase rules

- Prefer the modular Firebase SDK.
- Avoid Firebase compat APIs unless the existing project still depends on them.
- Keep Firebase initialization centralized.
- Keep Auth, Firestore, Storage, Hosting, and emulator configuration separated clearly.
- Do not access Firestore directly from Angular components.
- Use dedicated services for Firebase operations.
- Use explicit models for Firestore documents and client DTOs when appropriate.
- Handle loading, success, and error states for Firebase operations.
- Handle authentication state carefully.
- Avoid exposing sensitive configuration or secrets.
- Use Firebase emulators for local development when relevant.
- When writing Firebase code, consider offline behavior, permission errors, security rules, and typed data mapping.

### Firebase Authentication

- Keep authentication logic in a dedicated auth service.
- Handle login, logout, auth state, current user, and provider-specific logic in one clear place.
- Do not duplicate auth state logic across components.
- Prefer a single source of truth for the authenticated user.
- Handle unauthenticated states explicitly.
- Avoid assuming a user is available synchronously unless the code guarantees it.
- Keep route guards simple and readable.

### Firestore

- Use clear collection and document naming.
- Use typed models for Firestore data.
- Avoid duplicating Firestore path strings across the project.
- Prefer helper methods/constants for collection paths when paths are reused.
- Handle missing documents explicitly.
- Handle permission-denied and not-found cases clearly.
- Avoid unnecessary reads.
- Avoid deeply nested Firestore access logic inside UI components.
- Use converters or mapping functions when they improve type safety and consistency.

### Firebase Hosting

- Keep hosting configuration clear and minimal.
- Use rewrites intentionally, especially for Angular SPA routing.
- Do not change hosting configuration without explaining the effect.
- Consider production build output paths before editing `firebase.json`.

## Agent skills and Firebase guidance

This project includes local skill/reference folders under `.agents/skills`. When working on a task they cover, check and follow the relevant skill before proposing or editing code:

- `.agents/skills/firebase-auth-basics` for Firebase Authentication, login, logout, auth state, providers, and user session logic.
- `.agents/skills/firebase-basics` for general Firebase initialization, configuration, SDK usage, and emulator-related setup.
- `.agents/skills/firebase-firestore-standard` for Firestore collections, documents, CRUD, queries, converters, and data modeling.
- `.agents/skills/firebase-hosting-basics` for Firebase Hosting, deployment, rewrites, and hosting configuration.
- `.agents/skills/hebrew-rtl-best-practices` for Hebrew UI, RTL layout, directionality, text alignment, forms, navigation, and accessibility.

To refresh the Firebase agent skills and plugin, use Claude Code's native plugin manager instead of `npx`:

```bash
claude plugin update firebase@firebase
```

The project rules in this file take priority over skill guidance:

- Angular Material only.
- SCSS only.
- Mobile-first design.
- Standalone Angular components.
- Angular 20+ `@if`, `@for`, and `@switch`.
- Comments in English only.

## UI/UX Pro Max usage

When working on UI, UX, page layout, visual hierarchy, accessibility, design systems, dashboards, forms, cards, navigation, or responsive behavior:

- Use the UI/UX Pro Max prompt files in `.github/prompts/ui-ux-pro-max` when relevant.
- Also check `.agents/skills/hebrew-rtl-best-practices` when the UI contains Hebrew, RTL layout, Israeli user-facing text, forms, navigation, or mixed Hebrew/English content.
- Follow the project rules above even when UI/UX Pro Max suggests a different styling approach.
- Angular Material, SCSS, and mobile-first design take priority over generic UI suggestions.
- Prefer calm, clean, accessible, and practical UI over flashy design.
- Include loading, empty, error, and disabled states when relevant.
- Keep forms clear, readable, and accessible.
- Keep spacing and hierarchy consistent.
- Avoid unnecessary animations.

## Testing and generated files

- Do not create `.spec.ts` files unless explicitly requested.
- Do not add test scaffolding unless explicitly requested.
- Do not modify test configuration unless explicitly requested.
- If tests are requested, use clear Arrange/Act/Assert structure.
- Prefer focused unit tests over broad fragile tests.
- Do not create extra files unless they are necessary.
- When generating Angular components, include only the files requested or required by the project conventions.
- Keep generated code aligned with the existing folder structure.
- Do not introduce demo-only placeholder code unless clearly marked and requested.

## Response expectations

- Explain important changes briefly.
- When editing existing code, preserve existing behavior unless a change is requested.
- Point out potential risks or assumptions.
- Prefer step-by-step implementation when the task is large.
- Do not suggest installing new packages unless there is a clear benefit.
- When suggesting commands, prefer Windows PowerShell-compatible commands.
