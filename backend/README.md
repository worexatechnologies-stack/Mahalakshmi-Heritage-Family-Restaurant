# Mahalakshmi Spice Heritage - PHP Mail Backend

This directory contains the production-ready PHP mail backend for the Mahalakshmi Spice Heritage family restaurant website.

## Files
- `config.php`: Central configuration for destination email, sender info, and SMTP credentials.
- `send-mail.php`: Core mailer script supporting JSON/form POST requests, royal HTML email generation, and dispatching via SMTP or native PHP `mail()`.
- `mail_logs/`: Local audit directory where every reservation email is safely logged as formatted HTML for verification and backup.

---

## Destination Email
By default, all table reservations and customer inquiries are configured to be sent to:
**`mshfamilyrestaurant@gmail.com`**

You can change this email anytime in:
1. `backend/config.php` (change `'recipient_email' => '...'`), or
2. Via environment variable `RECIPIENT_EMAIL`.

---

## Live Deployment Options

### Option 1: Shared Hosting / cPanel / Apache / Nginx
1. Upload the `backend/` folder (or `public/api/send-mail.php`) to your web hosting.
2. Ensure PHP 7.4+ or 8.x is active on the server.
3. Native PHP `mail()` will automatically send emails on Linux/cPanel hosts.
4. If your host requires SMTP (or if you want 100% inbox delivery via Gmail), set `'enabled' => true` in `backend/config.php` under `'smtp'`.

### Option 2: Using Gmail SMTP for Guaranteed Delivery
1. Log into your Google Account for `mshfamilyrestaurant@gmail.com`.
2. Go to **Security** &rarr; Enable **2-Step Verification**.
3. Go to **App Passwords** (`https://myaccount.google.com/apppasswords`).
4. Generate an App Password for "Mail" (16 characters, e.g. `abcd efgh ijkl mnop`).
5. In `backend/config.php`, update:
   ```php
   'smtp' => [
       'enabled'  => true,
       'host'     => 'smtp.gmail.com',
       'port'     => 587,
       'secure'   => 'tls',
       'username' => 'mshfamilyrestaurant@gmail.com',
       'password' => 'your-16-char-app-password',
   ]
   ```

---

## Local Development (Next.js)
The Next.js route `/api/send-mail` automatically connects the frontend reservation form directly to `backend/send-mail.php` using your local PHP runtime. Every booking is processed, returned to the UI, and logged to `backend/mail_logs/`.
