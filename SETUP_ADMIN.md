# Admin Dashboard Setup Guide

This guide explains how to set up the secure admin dashboard for your Aspire store.

## 1. Cloudflare KV Setup

The admin dashboard requires two KV Namespaces to store settings and authentication data.

1.  Open your terminal in the project directory.
2.  Run the following commands to create the namespaces:
    ```bash
    npx wrangler kv:namespace create ASPRE_SETTINGS
    npx wrangler kv:namespace create ASPRE_AUTH
    ```
3.  Copy the `id` values output by these commands.
4.  Open `wrangler.toml` and replace `YOUR_KV_ID_HERE` with the actual IDs.

## 2. Initial Admin Login

Since there is no registration page (for security), the system allows a default login **only if the database is empty**.

1.  Deploy your site or run locally:
    ```bash
    npx wrangler pages dev public
    ```
2.  Navigate to `/admin/login.html`.
3.  Use the default credentials:
    *   **Username**: `admin`
    *   **Password**: `admin123`
4.  **IMMEDIATELY** go to the "Security" tab and change your password.
    *   Once you change your password, the default credentials will be permanently disabled.

## 3. Features

### Payments (Stripe)
*   Update your Stripe Publishable and Secret keys.
*   Toggle between Test Mode and Live Mode.
*   Update the direct payment links for USD and GBP.

### Pricing
*   Update the displayed price and retail price.
*   Changes are reflected on the frontend immediately (via `config-loader.js`).

### Marketing
*   Add or update Google Ads, GA4, and GTM IDs.
*   Scripts are automatically injected into the page header.

## 4. Security Notes
*   **Sessions**: Admin sessions expire automatically after 24 hours.
*   **Cookies**: Uses Secure, HttpOnly, SameSite=Strict cookies.
*   **Hashing**: Passwords are hashed using SHA-256 with a unique salt.
*   **Protection**: The admin API endpoints verify the session cookie on every request.
