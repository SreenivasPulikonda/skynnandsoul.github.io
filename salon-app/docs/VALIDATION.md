# Validation record

Prepared on 29 October 2026.

## Automated checks

`npm test`: 26 passing tests covering:

- Integer-paise billing, tax, discount allocation, split payments and dues.
- Inclusive tax, service-linked stock deductions and staff incentives.
- Owner-only operations and manager discount limits.
- Duplicate request replay, stale edits and stock shortage/expiry.
- Overpayment, unnamed customer dues and future financial dates.
- Cancellation, actual refund confirmation and stock-return choice.
- Purchase weighted cost and supplier payments on their actual dates.
- Cash closing, differences, day locks and owner reopening.
- Appointment conflicts and duplicate appointment billing.
- Atomic CSV import, duplicate records, invalid dates and CSV escaping.
- Protection against a price change during checkout.
- AES-GCM encryption, wrong-key/tamper rejection and private-repo enforcement.
- Signed sessions, expiry, revocation, password checks and secure cookie flags.
- GitHub SHA conflict retry, idempotency and unconfirmed write failures.
- Large-file retrieval by exact blob SHA.
- HTTP login, CSRF, shared manager/owner records, backup access and rate limits.

GitHub and rate-limit services in these tests are mocked; these are not live account tests.

`npm run build` and `npm run check`: production and demo built successfully; scripts parse; production CSP matches its actual script; production excludes fictional seed data.

`npx wrangler deploy --dry-run`: Worker bundle, static assets and bindings validated locally using Wrangler 4.155.0. This does not deploy the app or validate account permissions and production quotas.

## Browser checks

Checked the actual desktop browser UI, including:

- Manager and owner demo entry and navigation.
- Creating a customer from the bill screen.
- Creating a paid service invoice, assigning staff and viewing the receipt.
- Signing out and opening the owner role to see the manager's bill.
- Searching invoices and switching owner report types.
- Stock consumption shown in the owner stock-planning report.
- Saving an expense and receiving stock with an unpaid supplier balance.

The design includes responsive layouts and mobile navigation. Desktop UI was inspected visually. No claim is made of exhaustive device, accessibility, penetration or load testing.

## Before real use

The owner must still verify the deployed Cloudflare runtime, the private repository/token, separate-device sharing, receipt printing, tax configuration and their actual service prices. The live GitHub/Cloudflare integration was not exercised with the owner's production credentials. No real salon records or credentials were supplied or used.
