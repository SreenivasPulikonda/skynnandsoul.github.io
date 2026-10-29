# Skynn & Soul: free GitHub Pages sample app

This guide uses only your existing public GitHub repository and GitHub Pages. No Cloudflare account, paid plan, Node.js installation, command line or GitHub access token is needed to open this sample app.

## Understand what you are publishing

This is an interactive software demonstration, not a live shared salon billing system.

- You can try billing, inventory, appointments, customers and reports using fictional information.
- Both demo roles share changes only in the SAME browser profile on the SAME device and site address.
- The GitHub repository stores the software files. Records entered into the demo are stored in the browser, NOT in GitHub.
- Opening the link on a second device does not show the first device's changes.
- Clearing browser storage can remove your demo changes.
- The usernames and passwords below are public sample access codes. A visitor can read them or bypass the check. They do not protect customer or business information.
- Never enter real customer details, real payment information or private business records into this sample.

GitHub Pages serves static website files; it does not run this project's secure server. GitHub's published usage limits also restrict commercial transaction/SaaS hosting and warn against sensitive password transactions. Therefore this Pages version is explicitly a sample-data demonstration. The original requirement for secure manager/owner accounts with automatically shared records is not fulfilled by this version.

## Public demo login details

| Choose this role | Demo username | Demo password |
|---|---|---|
| Salon manager | manager | ManagerDemo2026! |
| Salon owner | owner | OwnerDemo2026! |

Copy the password exactly, including capital letters and the exclamation mark. Do not reuse these public passwords for any real account. These are not GitHub account credentials.

## Step 1: open your repository

Sign in to your existing GitHub account and open:

https://github.com/SreenivasPulikonda/skynnandsoul.github.io

The app files have already been added. You do not need to upload the ZIP or paste code.

## Step 2: open Settings

Click **Settings** in the repository's top row. If it is hidden on a small screen, open the menu containing the extra tabs. Use a laptop if possible.

## Step 3: open Pages

In the left menu, find **Pages**, under **Code and automation**.

## Step 4: choose how to publish

Under **Build and deployment**, set **Source** to **Deploy from a branch**.

## Step 5: choose the branch and folder

Select:

- Branch: **master**
- Folder: **/ (root)**

Then click **Save**.

Do not choose `main`: this existing repository uses `master`. The separate private data repository from the older production instructions is not needed for this demo.

## Step 6: wait for GitHub to finish

Wait a few minutes. GitHub says changes can take up to 10 minutes to publish. Refresh the Pages settings screen.

When GitHub shows **Your site is live at...**, click **Visit site**. If it has not published, open **Actions** in the repository and look for the Pages build and deployment run. A green tick means it completed successfully. The separate **Check salon app** run checks the code; it does not activate Pages by itself.

## Step 7: open your app

With the default github.io domain and no custom domain, the expected project URL is:

https://sreenivaspulikonda.github.io/skynnandsoul.github.io/

Use the exact link GitHub shows in Settings → Pages as the authority. The repository name contains `.github.io`, but your GitHub username is `SreenivasPulikonda`, so this is a PROJECT site, not `https://skynnandsoul.github.io`.

The root page opens the app at the `salon/` subfolder. If you are using the default domain, the direct app URL is:

https://sreenivaspulikonda.github.io/skynnandsoul.github.io/salon/

These URLs work only after Pages has been enabled and the deployment succeeds. Enabling Pages has not been performed by adding the source files alone.

## Step 8: sign in to the sample

For the manager screen:

1. Choose **Salon manager**.
2. Leave the demo username as `manager`.
3. Type `ManagerDemo2026!`.
4. Click **Open manager demo**.

For the owner screen:

1. Sign out.
2. Choose **Salon owner**.
3. Leave the demo username as `owner`.
4. Type `OwnerDemo2026!`.
5. Click **Open owner demo**.

The password box checks only a public demo code in the browser. It is not a secure online account.

## Step 9: try a complete example

1. Open the manager demo.
2. Add a customer called `TEST CUSTOMER`. Do not use a real phone number.
3. Make a sample bill and select a service.
4. Select **All cash** and save the sample bill. This does not collect real money.
5. Sign out and open the owner demo IN THE SAME BROWSER.
6. Check **Invoices & dues** and **Reports**. The sample bill appears there.

A second computer will have its own separate sample records. Sharing the link does not share records.

## Step 10: bookmark the app

Bookmark the published link. No installation or ongoing cloud subscription is needed for this static sample. You can use the **Reset sample data** button to remove your sample changes and start again.

## Common beginner problems

| Problem | What to do |
|---|---|
| 404 / page not found | Check Pages is enabled, the branch is `master`, the folder is `/ (root)`, and the Pages deployment has finished. |
| Old home page appears | Open the direct `salon/` link, then refresh. On Windows, try Ctrl+F5; on Mac, Command+Shift+R. |
| Wrong website | Use the link displayed by GitHub in this repository's Pages settings, not a guessed domain. |
| Password not accepted | Choose the matching role. Copy the username and password exactly; passwords are case-sensitive. |
| Owner on another device cannot see a bill | Expected for this demo. Browser storage is not shared across devices. |
| Demo data disappeared | Browser storage may have been cleared, a private browsing session ended, or you used another browser/site address. |
| Setup is not complete / asks for server setup | You opened `salon-app/public/index.html`, the server version. Use the root Pages link or `salon/index.html` instead. |

## Files and older instructions

- `index.html`: opens the sample app from the main project link.
- `salon/index.html`: the complete static sample app.
- `.nojekyll`: tells GitHub to serve these static files without a Jekyll build.
- `previous-homepage/index.html`: preserved copy of the old home page.
- `salon-app/`: source code, tests and the separate server-based implementation.

Ignore the Cloudflare deployment instructions and the **Deploy salon app to Cloudflare** workflow when following this guide. That workflow is manual and will not run just because Pages is enabled.

## Official explanations

- What GitHub Pages is: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Publishing from a branch: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Pages usage limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
