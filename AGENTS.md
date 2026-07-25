# AGENTS.md — Playwright HeyMondo

## Commands

```bash
# Run all tests
npm test

# Run API tests
npm run test:api

# Run UI tests
npm run test:e2e

# Run a specific test file
npx playwright test tests/api/brands.spec.ts

# Run with headed browser (visible UI)
npm run test:headed

# Debug mode (Playwright Inspector)
npm run test:debug

# Run a single test by name (grep)
npx playwright test -g "should create a brand"

# Update snapshots
npx playwright test --update-snapshots

# View HTML report
npm run report
```

## Project Structure

- `tests/api/` — API tests (REST via Playwright `request`)
- `tests/e2e/` — UI tests (browser with Page Objects)
- `tests/auth.setup.ts` — global auth setup (runs before UI tests)
- `pages/` — Page Object Model classes (`LoginPage`, `ProductsPage`, `ProductDetailPage`, `CartPage`, `CheckoutPage`, `NavPage`, `RegisterPage`)
- `fixtures/` — custom Playwright fixtures (injects Page Objects into tests)
- `utils/` — helpers (`api-logger.ts`, `register-user.ts`)
- `playwright.config.ts` — main config (Chromium only, HTML reporter)
- `.github/workflows/playwright.yml` — CI/CD pipeline

## Conventions

- Use `data-test` selectors for UI elements
- API tests use `logAndParse(response)` from `utils/api-logger.ts` for logging
- Page Object methods return values, not assertions — assertions go in tests
- Import `test`, `expect` from `../../fixtures` (not `@playwright/test`) in UI tests
- Import `test`, `expect` from `@playwright/test` in API tests
- Clean up created test data in API tests (delete after test)
- `.env` is gitignored — never commit secrets

## CI Notes

- CI runs `npm ci`, `npx playwright install --with-deps`, then `npx playwright test`
- CI currently passes only `USER_EMAIL`/`USER_PASSWORD` — `ADMIN_EMAIL`/`ADMIN_PASSWORD` need to be added to GitHub secrets for admin tests to pass on CI
