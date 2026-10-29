# Playwright Practice Software Testing

[![Playwright Tests](https://github.com/stqlopera-ai/playwright-heymondo/actions/workflows/playwright.yml/badge.svg)](https://github.com/stqlopera-ai/playwright-heymondo/actions/workflows/playwright.yml)

Automated test suite for [Practice Software Testing](https://practicesoftwaretesting.com) — a demo e-commerce platform — built with [Playwright](https://playwright.dev/).

Covers both **REST API** and **UI (End-to-End)** testing, with role-based access control validation (user vs admin).

## Tech Stack

| Technology | Purpose |
| ---------- | ------- |
| Node.js / TypeScript | Language & runtime |
| Playwright v1.60 | Test framework & browser automation |
| dotenv | Environment variable management |
| GitHub Actions | CI/CD pipeline |

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
git clone <repo-url>
cd playwright-heymondo
npm install
npx playwright install --with-deps
```

## Configuration

Copy the environment file and fill in your credentials:

Create a `.env` file in the root directory with the required variables (e.g., copy from your local environment or set them directly):

```bash
BASE_URL=https://practicesoftwaretesting.com
API_URL=https://api.practicesoftwaretesting.com
USER_EMAIL=your_email@example.com
USER_PASSWORD=your_password
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

| Variable | Description |
| -------- | ----------- |
| `BASE_URL` | Web application URL (`https://practicesoftwaretesting.com`) |
| `API_URL` | REST API URL (`https://api.practicesoftwaretesting.com`) |
| `USER_EMAIL` | Regular user email |
| `USER_PASSWORD` | Regular user password |
| `ADMIN_EMAIL` | Admin user email |
| `ADMIN_PASSWORD` | Admin user password |

## Running Tests

```bash
# Run all tests
npm test

# Run API tests only
npm run test:api

# Run UI tests only
npm run test:e2e

# Run with visible browser
npm run test:headed

# Debug mode (Playwright Inspector)
npm run test:debug

# Run a single test file
npx playwright test tests/api/auth.spec.ts

# Run a single test by name
npx playwright test -g "should create a brand"
```

### View Reports

```bash
npm run report
```

## Project Structure

```
├── fixtures/               # Custom Playwright fixtures (Page Object injection)
├── pages/                  # Page Object Model classes
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── ProductDetailPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── NavPage.ts
│   └── RegisterPage.ts
├── playwright/             # Auth state storage
├── tests/
│   ├── api/                # API tests (auth, brands, categories, products, reports, users)
│   ├── e2e/                # UI tests (login, products, cart, navigation, product-detail, register, full-journey)
│   └── auth.setup.ts       # Global authentication setup
├── utils/
│   ├── api-logger.ts       # Response logging helper
│   └── register-user.ts    # Dynamic user registration
├── .github/workflows/      # CI/CD pipeline
└── playwright.config.ts
```

## Test Coverage

### API Tests (6 spec files)

- **Authentication** — login, token validation, protected endpoints, invalid credentials
- **Products** — CRUD, pagination, search, category filter, admin-only deletion
- **Categories** — CRUD, subcategory hierarchy, admin-only deletion
- **Brands** — CRUD, search, admin-only deletion
- **Reports** — 7 admin-only report endpoints with role-based access
- **Users** — profile, user list (admin), invoices, messages, registration

### UI Tests (8 spec files)

- **Login** — valid login redirect, invalid credentials error
- **Products** — product listing, search by text, category filter
- **Cart** — add to cart from detail page, cart redirect without auth
- **Navigation** — home, contact, category nav, sign-in, language switch, categories dropdown
- **Product Detail** — product info, price format, specs, add-to-cart, quantity, out-of-stock
- **Register** — valid registration, duplicate email error, form field presence
- **Full Journey** — complete flow: register (API) → login (UI) → browse → cart → checkout → payment
- **Flaky Demo** — intentionally flaky test (~50% failure rate)

## CI/CD

The GitHub Actions workflow (`playwright.yml`) runs on every push and pull request to `main`/`master`:

- Installs dependencies and Playwright browsers
- Runs the full test suite
- Uploads the HTML report as an artifact (retained 30 days)

Required repository secrets and variables:

- `USER_EMAIL`, `USER_PASSWORD` (secrets)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` (secrets)
- `BASE_URL`, `API_URL` (variables)

## VS Code Debugging

Launch configuration included (`.vscode/launch.json`). Use the **Debug Playwright** configuration to run tests with the Playwright Inspector.
