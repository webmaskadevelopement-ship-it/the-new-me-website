# Implementation Brief

## 1. Project Goal
[Describe the target website and business goal.]

## 2. Design Intent
[Primary intent, secondary intent, user feeling, brand perception.]

## 3. Design System
Reference the token files rather than duplicating values.

## 4. Page Architecture
For each page:
- Purpose
- Section order
- Section purpose
- Content intent
- CTA hierarchy
- Components
- Assets
- Responsive transformations

## 5. Component Architecture
Use reusable components and variants. Avoid one-off styling when a token/component already exists.

## 6. Responsive Behavior
Describe structural transformations first. Exact breakpoints are implementation decisions unless evidenced.

## 7. Interaction & Motion
Use only purposeful motion. Respect reduced-motion preferences.

## 8. Accessibility
Use semantic HTML, logical heading hierarchy, keyboard access, visible focus, sufficient contrast, useful alt text, accessible forms, and reduced-motion support.

## 9. SEO
Define page title, meta description, search intent, headings, structured data where appropriate, internal links, and image metadata.

## 10. Content Safety
Never invent testimonials, credentials, statistics, scientific/medical claims, awards, logos, pricing, or product facts.

## 11. Asset Strategy
Every visual asset must be classified as USER_PROVIDED, GENERATE, PLACEHOLDER, SOURCE, or UNKNOWN.

## 12. Acceptance Criteria
The implementation must satisfy:
- visual hierarchy matches the inferred system
- tokens are reused
- responsive transformations are implemented
- accessibility requirements pass
- no unsupported factual content is introduced
- visual QA issues are resolved
