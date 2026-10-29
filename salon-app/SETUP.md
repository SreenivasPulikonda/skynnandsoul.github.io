# Put the salon app online

For the free GitHub Pages SAMPLE, use the repository-root `GITHUB-PAGES-BEGINNER-GUIDE.md`. The server setup below is separate and is not needed to publish that sample.

This needs one GitHub account, one Cloudflare account and Node.js 22 or newer on your computer. The production setup is configured for **Cloudflare Workers Paid**, with a 30-second CPU limit. Password hashing, encryption and whole-file imports need more CPU time than the Free plan's 10 ms request allowance. Check Cloudflare's current plan and pricing before enabling it. No subscription or live deployment has been made by the supplied files.

Your existing public GitHub repository holds the app code and sample demo. Your business records go into a separate **private** repository in the same GitHub account. Cloudflare stores the app's secrets and processes requests in memory; the app does not create a Cloudflare database, KV store or R2 bucket.

## 1. Add the supplied files

Copy the contents of the repository package into `SreenivasPulikonda/skynnandsoul.github.io`. Keep your existing root `index.html`.

GitHub Pages was disabled when this repository was checked. To publish the sample preview, open the repository Settings → Pages → Deploy from a branch → choose `master` and `/ (root)` → Save. Wait for GitHub to finish, then use the published site link shown there and add `/salon/` to its project path. The original root home page is preserved.

The demo is `salon/index.html`. This is a sample-data project preview. Never enter real customer data there. The live app will use the HTTPS address from Cloudflare, not this demo address.

Open a terminal inside `salon-app`:

```sh
npm ci
npm test
npm run build
npm run check
```

## 2. Create a private data repository

In your GitHub account, create a repository called `skynn-soul-private-data`.

- Select **Private**.
- Add a README so the `main` branch exists.
- Do not turn on GitHub Pages for it.
- Do not upload any starting data file. The first app save creates `data/salon.enc.json`.

The server checks that this repository is private and refuses to use a public one. You cannot use the current public Pages repository for customer records in this design.

## 3. Create the GitHub access token

In GitHub Settings, open Developer settings → Personal access tokens → Fine-grained tokens.

- Select your account as the resource owner.
- Select **only** `skynn-soul-private-data` as the repository.
- Grant Repository permissions → **Contents: Read and write**. Metadata read access is also needed.
- Set an expiry date you will remember to renew.
- Keep this token private. It belongs on the server, never in the HTML file or a GitHub commit.

## 4. Set the two passwords and keys

Run:

```sh
npm run setup
```

The script asks for the data repository name, owner password, manager password and GitHub token. Password and token entry is hidden. Use two different long passwords, at least 14 characters each; a password manager can generate stronger random passwords.

The script creates `secrets.local.json` on your computer. It contains:

- `GITHUB_TOKEN`: permission to read and update the private data repo.
- `DATA_KEY`: key for opening the encrypted salon records.
- `SESSION_SECRET`: key for signing login sessions.
- `OWNER_PASSWORD_HASH`: the owner password hash.
- `MANAGER_PASSWORD_HASH`: the manager password hash.

**Keep a secure backup of DATA_KEY. If you lose it, encrypted records and their Git history cannot be opened.** The script keeps an existing DATA_KEY when run again. Do not delete the old secrets file and rerun setup after records exist, unless you restore the same DATA_KEY first.

`secrets.local.json`, `.dev.vars` and environment files are ignored by Git. Do not upload them manually to GitHub. Store an encrypted backup in your own password manager or secure storage.

## 5. Deploy the server and web app

Run on your own computer:

```sh
npx wrangler login
npx wrangler secret bulk secrets.local.json
npm run deploy
```

Follow Cloudflare's login instructions. Confirm the Cloudflare account you want to use. If Wrangler says the Worker does not exist yet, allow it to create `skynn-soul-salon`; you can also run `npx wrangler deploy` once before `secret bulk`, then upload secrets and redeploy. Before secrets are set, the server fails closed and shows a setup message.

Wrangler prints an HTTPS `workers.dev` address. Open **that exact address** in the browser. Share it with your manager. You can later attach your own domain through Cloudflare.

Both roles use the same address. Choose the correct role and enter its password. Do not share the owner password with the manager. A login lasts up to eight hours.

## 6. First setup in the app

Sign in as owner:

1. Open Settings and enter your salon name, address and phone.
2. Ask your accountant about tax settings. The initial rate is 0%; no GST rate is assumed.
3. Set the manager's maximum discount.
4. Add team members and their incentive rates.
5. Add products, units, opening stock, cost and reorder levels, or import the product CSV.
6. Add services and prices, or import the service CSV.
7. Edit each service and enter the products used for one service. Use the correct stock units.
8. Import customers after checking their details and contact consent.

Do not import the sample rows unchanged into a real business account.

## 7. Check sharing before the first real bill

Use test records clearly named TEST and no real personal data.

- On the manager's device, add a test customer and save a test bill.
- On the owner's device, click Refresh and check the same customer, bill and payment.
- Check that stock dropped by the correct quantity.
- Download the receipt as PDF from the browser print dialog.
- Check a split payment and a due payment.
- As owner, cancel the test bill. Only mark a refund as paid if test money was actually recorded as paid; no real transfer is performed by the app.
- Confirm your tax and invoice format with your accountant before live billing.

The test records remain in audit history. A clean new data repository can be used for the final go-live after verifying the setup; update the server repository setting accordingly.

## 8. Backups and recovery

Owner → Settings → Download full backup. The exported JSON contains private details in readable form. Keep it safe and never commit it to the public source repository.

To restore a verified backup:

1. Stop all use of the app and sign staff out.
2. Download a fresh backup of current records first.
3. Keep the correct `secrets.local.json` and `wrangler.jsonc` in `salon-app`.
4. Run `node scripts/restore.mjs /full/path/to/backup.json`.
5. Check the target repository, record count and revisions printed by the script.
6. Type `RESTORE` only when you are sure. A file-SHA conflict stops the restore if someone changed data in the meantime.
7. Refresh all app screens and check the totals.

The restore tool checks basic structure. It is not a repair tool for an edited or damaged backup. Preserve original backups.

## 9. Change passwords or renew the token

Keep your existing secrets file. Run `npm run setup` again to create new password hashes and a new session signing key while preserving DATA_KEY. Upload the new secrets using `npx wrangler secret bulk secrets.local.json`, then deploy. The script also increases SESSION_EPOCH, so old logins stop working.

For a simple token renewal, replace only `GITHUB_TOKEN` in Cloudflare's Worker secrets. Do not change DATA_KEY to renew a token.

## 10. Optional deployment from GitHub Actions

First complete a deployment from your computer and set the Worker secrets. In the public source repository, create a GitHub Actions environment called `salon-production`.

Add these environment secrets:

- `CLOUDFLARE_API_TOKEN`: a Cloudflare token allowed to deploy this account's Worker.
- `CLOUDFLARE_ACCOUNT_ID`: your Cloudflare account ID.

Keep GITHUB_TOKEN, DATA_KEY and the password hashes in the Worker secrets; the deployment workflow does not need copies in the public source repository.

Commit your non-secret `wrangler.jsonc` repository settings. Run **Deploy salon app to Cloudflare** from Actions when you want a release. It runs checks before deployment. Enable environment approval in GitHub if you want to review each release.

## If something fails

| Message | What to check |
|---|---|
| Setup is not complete | All five Worker secrets were uploaded; repository settings are correct |
| Use a PRIVATE repository | The data repository is private, not the public Pages repository |
| Data branch is missing | Create the repository with a README; check `main` versus `master` |
| Cannot access the data repository | Token expiry, selected repository and Contents read/write permission |
| Saved data could not be opened | Correct DATA_KEY; do not overwrite the data file |
| GitHub did not confirm this save | Keep the form open and retry the same action. Check token and GitHub availability |
| Record changed on another device | Refresh, review the updated record and apply your change again |
| This day is closed | Ask the owner to reopen the day with a reason |
| Worker exceeded resource limits | Use Workers Paid as configured, and check CPU limits and file size |
| Data file near its size limit | Export a backup and arrange developer-led archiving before continuing |

After a failed save, do not assume the payment or bill is recorded. Check the invoice list and refresh. The same pending request is safe to retry while its form remains unchanged.
