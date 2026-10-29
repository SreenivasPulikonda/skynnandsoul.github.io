# Security and data design

## Where data lives

The public repository holds software and fictional demo data only. The live server uses a separate private repository and verifies its visibility before reading or writing. The complete salon state, including receipt bytes, is encrypted with AES-256-GCM and committed to `data/salon.enc.json`. Each encryption uses a fresh random nonce and authenticated format label.

Cloudflare runs the app and stores the GitHub token, encryption key, password hashes and session signing secret as Worker secrets. Business records are decrypted in memory for authenticated requests. There is no other persistent app database. The browser necessarily receives the records needed for the signed-in workspace, but the production app does not save them in localStorage and sends `Cache-Control: no-store`. Do not configure caching rules that override this.

The demo uses localStorage and role switching without security. It must never hold real customer details. Real sessions require HTTPS on the Worker address.

## Login and roles

Passwords are salted and hashed with PBKDF2-SHA256 at 100,000 iterations, using the native Worker Web Crypto implementation. Setup requires distinct passwords at least 14 characters long. Use randomly generated long passwords, keep hashes private and protect your Cloudflare account with MFA. This two-role app itself has no MFA.

The server signs an eight-hour session using HMAC-SHA256. Cookies are HttpOnly, Secure and SameSite=Strict. Mutations require the same Origin and the session's CSRF token. Server-side role checks protect owner controls. The login endpoint has per-IP and per-role rate-limit bindings; these are approximate per Cloudflare location, not a global account lockout. Write limits protect against accidental repeated requests.

Signing out clears this browser's cookie. A stolen copy of a stateless session remains usable until expiry unless SESSION_EPOCH or SESSION_SECRET is changed. Use those controls immediately when a credential or device is lost.

Managers receive operational records, including invoices, costs, clients and staff data. Owner reports are hidden from their navigation; audit history, operation keys, full backup access and owner-only write operations are restricted on the server. Do not treat hidden report navigation as an additional data-secrecy boundary.

## Save integrity

Prices, tax, stock use and totals are computed again on the server. Currency is in integer paise. Client-provided payment totals cannot overpay an invoice. Requests have unique IDs; retries do not duplicate bills. Record versions stop stale edits. The encrypted file SHA is required on update; conflicting writes are retried against the latest data. Multi-row imports and bill/stock changes commit as one snapshot.

Closed days reject money changes until an owner reopens them with a reason. Financial dates use Asia/Kolkata. Original invoices and audit records are retained, including cancellation history. This is an operational audit log, not a tamper-proof compliance ledger: repository administrators and people holding server secrets can alter it.

## Browser protections

The build computes the exact script hash for the production Content Security Policy. Inline event handlers and third-party scripts are not used. User text is HTML-escaped. CSV exports prefix possible formula cells. Receipt attachments have size and MIME restrictions and are downloaded as files, not rendered as executable HTML. Files from outside the salon still need normal caution when opened.

## Backup and retention

Owner JSON exports are unencrypted. Protect them as customer records. Git commits retain prior encrypted versions, including old customer details and deleted/reset snapshots. This app has no automatic retention purge. Agree on a data retention and privacy process for your business. Keep DATA_KEY backed up separately from the public repository. Do not rotate it without a planned decrypt/re-encrypt migration.

GitHub-only snapshot storage is intended for modest use. It creates history growth and API dependencies. Do not load-test the live repository or use it for many branches/salons. Monitor file size, request limits and Worker CPU as records grow.
