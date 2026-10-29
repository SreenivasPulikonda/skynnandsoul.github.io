# Skynn & Soul Salon Workspace

A browser app for salon billing, clients, bookings, stock, staff and owner reports. Designed for one salon and a small team. All business records are saved as encrypted data in a **private GitHub repository**. A Cloudflare Worker serves the live app and handles the two password logins.

**Status:** working source code, tested business rules and a working interactive demo. The production account, private repository, secrets and live deployment must be configured by the owner before real use. No live credentials or real customer data are included.

## Try the app

Open `dist/Skynn-Soul-Interactive-Demo.html` in a modern browser. Choose **Salon manager** or **Salon owner**, then open the demo. No password is needed. Changes are saved in that browser. Sign out and open the other role to see the same demo records.

The demo is for sample data only. It is not a secure production login, does not save to GitHub and cannot share records across different computers. Clearing browser storage resets it. Open the downloaded HTML in Chrome, Edge or Firefox if your file preview does not allow scripts.

## What is included

| Area | Functions |
|---|---|
| Billing | Service and retail selection, team member per item, discounts with reasons, tax, cash/UPI/card/bank, split payments, dues, printable receipts, owner cancellation and refund records |
| Customers | Contact details, preferences and follow-up notes, marketing consent, birthdays, membership expiry, visit history, current dues, CSV import |
| Appointments | Customer, service, staff, date, time, status, overlapping staff booking checks, convert appointment to bill |
| Inventory | Product master, opening stock, service consumption, retail deductions, stock receipt, adjustments with reasons, expiry, low-stock alerts, stock history |
| Purchases | Supplier, bill number, product, cost, payment and balance due, later supplier payments, small receipt attachments |
| Expenses | Category, description, payment method, payee, receipt number, small receipt attachments |
| Services | Prices, categories, duration, tax rate and linked stock consumption; owner editing and CSV upload |
| Staff | Staff details, daily attendance, leave records, assigned sales and earned incentives |
| Owner reports | Sales, tax, discounts, collections and refunds, service sales, staff performance, incentives, customer dues, stock planning, expenses, purchases, attendance, daily closing and change history |
| Day closing | Opening cash, cash received, cash spent, extra cash added, cash taken out, count, difference, note and lock; owner reopening with history |
| Export | Report CSV, browser print-to-PDF, full JSON backup and a guarded command-line restore tool |

The manager runs daily operations. The owner can do all daily work and also control prices, products, staff, tax settings, discount limits, cancellations, reopening and backups. These write restrictions are checked on the server, not only hidden in the screen. Managers can see the operational records needed for their work, including invoices, costs and customer contacts; this is not a system that hides all financial information from the manager.

## Your existing GitHub repository

Source destination: `SreenivasPulikonda/skynnandsoul.github.io`.

The existing root `index.html` is preserved. The additions use:

- `salon-app/`: app source, production server, tests, setup steps and templates.
- `salon/index.html`: sample-data demonstration for the GitHub Pages project.
- `.github/workflows/check.yml`: automatic checks.
- `.github/workflows/deploy-salon.yml`: optional manual Cloudflare deployment.

**GitHub Pages is not the live billing server.** It only serves static files, and its published usage limits prohibit using it as free hosting for an online business or commercial SaaS; it is also not intended for sensitive password transactions. The `/salon/` page is a clearly labelled software demonstration. Use the deployed Cloudflare HTTPS address for real work. Do not put real records, passwords, tokens or the unencrypted backup in this public repository.

## Start production

Follow [SETUP.md](SETUP.md). It explains the private GitHub data repository, two passwords, server secrets and deployment. The live app starts empty. Add staff, stock and prices as the owner before billing.

The live app refreshes shared records every 60 seconds while the tab is visible. Use the refresh button for an immediate update. Saving waits for GitHub confirmation; failures leave the form open. A retry of the same operation uses the same request ID, preventing duplicate bills. Concurrent saves use GitHub file SHAs and retry conflicts. Stale record edits are rejected.

## Development

Requires Node.js 22 or newer (tested with Node 24).

```sh
cd salon-app
npm ci
npm test
npm run build
npm run check
npm run dev
```

`npm run dev` serves the sample-data demo at the address shown in the terminal. It is not an authenticated production server. `npm run build` writes `public/index.html`, the standalone demo, and the production script hash used by the Content Security Policy.

To check the Worker bundle without deploying:

```sh
npx wrangler deploy --dry-run
```

## Important limits

- Internet access and the GitHub API are required for every live save. There is no offline billing queue.
- GitHub is being used as a small-salon data store, not a high-volume database. Each change creates a new encrypted snapshot and commit. Large volumes need an archive plan or a different database architecture.
- The state has a 12 million character guard. It stops new writes before silently losing history. Receipts count towards that size; keep them small. Plan archiving before reaching the limit. Automated archiving is not included.
- Each receipt must be a PNG, JPEG or PDF no larger than 250 KB. One purchase entry represents one product from a supplier bill.
- Separate stock batches with different expiry dates must have separate SKUs.
- Imports are CSV only, up to 500 new records and 2 MB per file. Existing prices can be edited in the service screen; imports do not overwrite existing records.
- A membership records its expiry date. It does not manage prepaid wallets, packages or automatic membership discounts. Apply approved discounts on the bill.
- Payments are records of money already collected or refunded. The app does not process card payments, generate payment links or send money.
- Incentives are earned calculations, not payroll. The app does not submit GST returns, create legal credit notes, connect to banks, read Google reviews or send automatic SMS/WhatsApp messages.
- Cancelled invoices remain in history but are excluded from historical sales reports. Refunds appear on the actual refund date. Use proper accounting software for statutory credit notes and tax filing.
- The “after stock & expenses” figure is sales before tax minus recorded product consumption cost and recorded operating expenses. It is not full accounting profit; it excludes unrecorded costs and accounting adjustments.
- The two logins identify roles, not individual people. Use one responsible manager login and one owner login. There is no MFA or per-employee login in this version.

See [docs/OPERATING-GUIDE.md](docs/OPERATING-GUIDE.md), [docs/SECURITY.md](docs/SECURITY.md) and [docs/VALIDATION.md](docs/VALIDATION.md).

## Official platform references

- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [GitHub repository contents API](https://docs.github.com/en/rest/repos/contents)
- [Cloudflare Worker static assets](https://developers.cloudflare.com/workers/static-assets/)
- [Cloudflare Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare Worker limits](https://developers.cloudflare.com/workers/platform/limits/)
