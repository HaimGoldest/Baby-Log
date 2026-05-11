# Copilot Instructions

## Project context

This is an Angular project.

The project should follow modern Angular architecture, clean reusable component design, and maintainable feature-based structure.

When suggesting code, prefer practical production-ready Angular code over generic examples.

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
- Use mobile-first responsive design.
- Keep a clear visual hierarchy.
- Prefer accessible Angular Material components over custom HTML when possible.
- Ensure keyboard accessibility and visible focus states.
- Include loading, empty, and error states when relevant.
- Keep layouts responsive and usable on small screens first.
- Prefer semantic HTML where possible.
- Avoid inline styles unless there is a clear reason.

## Angular Material rules

- Prefer Angular Material components for forms, buttons, dialogs, cards, navigation, tooltips, icons, tables, and layout-related UI.
- Keep Material usage consistent across the project.
- Do not mix Angular Material with Bootstrap or Tailwind.
- Use Material form-field patterns consistently.
- Provide accessible labels, hints, and error messages for form controls.
- Use dialogs, snackbars, and tooltips only when they improve UX and are not overused.

## SCSS rules

- Use component SCSS files.
- Use clear class names.
- Prefer simple, readable selectors.
- Avoid deeply nested SCSS.
- Use mobile-first styles first, then add larger breakpoint overrides.
- Keep spacing, typography, and layout rules consistent.
- Avoid global styles unless the styling is truly app-wide.

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

## Firebase Authentication rules

- Keep authentication logic in a dedicated auth service.
- Handle login, logout, auth state, current user, and provider-specific logic in one clear place.
- Do not duplicate auth state logic across components.
- Prefer a single source of truth for the authenticated user.
- Handle unauthenticated states explicitly.
- Avoid assuming a user is available synchronously unless the code guarantees it.
- Keep route guards simple and readable.

## Firestore rules

- Use clear collection and document naming.
- Use typed models for Firestore data.
- Avoid duplicating Firestore path strings across the project.
- Prefer helper methods/constants for collection paths when paths are reused.
- Handle missing documents explicitly.
- Handle permission-denied and not-found cases clearly.
- Avoid unnecessary reads.
- Avoid deeply nested Firestore access logic inside UI components.
- Use converters or mapping functions when they improve type safety and consistency.

## Firebase Hosting rules

- Keep hosting configuration clear and minimal.
- Use rewrites intentionally, especially for Angular SPA routing.
- Do not change hosting configuration without explaining the effect.
- Consider production build output paths before editing `firebase.json`.

## Agent skills and Firebase guidance

This project includes local AI skill/reference folders under `.agents/skills`.

When working on Firebase-related tasks, always check and follow the relevant skill folder before proposing or editing code:

- `.agents/skills/firebase-auth-basics` for Firebase Authentication, login, logout, auth state, providers, and user session logic.
- `.agents/skills/firebase-basics` for general Firebase initialization, configuration, SDK usage, and emulator-related setup.
- `.agents/skills/firebase-firestore-standard` for Firestore collections, documents, CRUD, queries, converters, and data modeling.
- `.agents/skills/firebase-hosting-basics` for Firebase Hosting, deployment, rewrites, and hosting configuration.
- `.agents/skills/hebrew-rtl-best-practices` for Hebrew UI, RTL layout, directionality, text alignment, forms, navigation, and accessibility.

If a task touches Firebase or Hebrew/RTL UI, use these folders as project-specific guidance in addition to the general project rules.

The project rules in this file still take priority:

- Angular Material only.
- SCSS only.
- Mobile-first design.
- Standalone Angular components.
- Angular 20+ `@if`, `@for`, and `@switch`.
- Comments in English only.

## Hebrew and RTL rules

- When creating Hebrew UI, use proper RTL layout.
- Use `dir="rtl"` or Angular CDK directionality where appropriate.
- Do not hard-code left/right assumptions when start/end is more appropriate.
- Prefer logical CSS properties when relevant, such as `margin-inline-start`, `padding-inline-end`, and `text-align`.
- Support mixed Hebrew and English content carefully.
- Keep Hebrew user-facing text natural and concise.
- Comments in code must still be in English only.
- Avoid layout choices that break in RTL.

## UI/UX Pro Max usage

When working on UI, UX, page layout, visual hierarchy, accessibility, design systems, dashboards, forms, cards, navigation, or responsive behavior:

- Use the existing UI/UX Pro Max prompt files from `.github/prompts` when relevant.
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

## File generation rules

- Do not create extra files unless they are necessary.
- When generating Angular components, include only the files requested or required by the project conventions.
- Do not create `.spec.ts` files unless explicitly requested.
- Keep generated code aligned with the existing folder structure.
- Do not introduce demo-only placeholder code unless clearly marked and requested.

## Response expectations

- Explain important changes briefly.
- When editing existing code, preserve existing behavior unless a change is requested.
- Point out potential risks or assumptions.
- Prefer step-by-step implementation when the task is large.
- Do not suggest installing new packages unless there is a clear benefit.
- When suggesting commands, prefer Windows PowerShell-compatible commands.
