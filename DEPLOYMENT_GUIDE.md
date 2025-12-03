# 🚀 ASPRE Deployment Guide
## Cloudflare Pages + GitHub Complete Setup

---

## Prerequisites

Before you begin, make sure you have:

- ✅ GitHub account
- ✅ Cloudflare account (free tier works)
- ✅ Stripe account (for payments)
- ✅ PayPal Business account (optional)
- ✅ Email service account (SendGrid, Mailgun, or similar)
- ✅ Your project files ready with assets

---

## Part 1: GitHub Setup

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Repository settings:
   - **Name:** `ASPRE`
   - **Description:** "Vectric Aspire 12 E-Commerce Platform"
   - **Visibility:** Private (recommended) or Public
   - **Do NOT** initialize with README (you already have one)
4. Click **"Create repository"**

### Step 2: Upload Your Files

**Option A: Via Web Interface (Easiest)**
1. On your new repository page, click **"uploading an existing file"**
2. Drag and drop the entire ASPRE folder
3. Commit message: "Initial commit - Complete ASPRE platform"
4. Click **"Commit changes"**

**Option B: Via Git (if you install Git later)**
```bash
cd /Users/mac/Documents/antigravity/ASPRE
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ASPRE.git
git push -u origin main
```

---

## Part 2: Cloudflare Pages Setup

### Step 1: Connect GitHub to Cloudflare

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. Click **"Workers & Pages"** in the left sidebar
4. Click **"Create application"** → **"Pages"** tab
5. Click **"Connect to Git"**

### Step 2: Authorize GitHub

1. Click **"GitHub"**
2. Authorize Cloudflare Pages to access your GitHub
3. Select **"Only select repositories"**
4. Choose your **ASPRE** repository
5. Click **"Install & Authorize"**

### Step 3: Configure Build Settings

1. **Project name:** `aspre` (or your preferred subdomain)
2. **Production branch:** `main`
3. **Framework preset:** None
4. **Build command:** (leave empty)
5. **Build output directory:** `public`
6. **Root directory:** `/`

7. Click **"Save and Deploy"**

Wait 1-2 minutes for the initial deployment to complete.

---

## Part 3: Cloudflare KV Setup

### Step 1: Create KV Namespaces

1. In Cloudflare Dashboard, go to **"Workers & Pages"** → **"KV"**
2. Click **"Create namespace"**
3. Create these 4 namespaces:

   ```
   ASPRE_LICENSES
   ASPRE_ORDERS
   ASPRE_CUSTOMERS
   ASPRE_SETTINGS
   ```

### Step 2: Get Namespace IDs

1. Click on each namespace
2. Copy the **Namespace ID** (looks like: `a1b2c3d4e5f6...`)
3. Save these IDs - you'll need them next

### Step 3: Bind KV to Your Project

1. Go back to **"Workers & Pages"**
2. Click on your **aspre** project
3. Go to **"Settings"** → **"Functions"**
4. Scroll to **"KV namespace bindings"**
5. Click **"Add binding"** for each namespace:

   | Variable name | KV namespace |
   |---------------|--------------|
   | ASPRE_LICENSES | ASPRE_LICENSES |
   | ASPRE_ORDERS | ASPRE_ORDERS |
   | ASPRE_CUSTOMERS | ASPRE_CUSTOMERS |
   | ASPRE_SETTINGS | ASPRE_SETTINGS |

6. Click **"Save"**

### Step 4: Update wrangler.toml

1. Edit `/ASPRE/wrangler.toml`
2. Replace `YOUR_KV_NAMESPACE_ID_*` with your actual namespace IDs
3. Commit and push changes to GitHub
4. Cloudflare will auto-redeploy

---

## Part 4: Environment Variables

### Step 1: Set Environment Variables

1. In your aspre project, go to **"Settings"** → **"Environment variables"**
2. Add the following variables:

#### Production Environment:

| Variable name | Value | Notes |
|---------------|-------|-------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | From Stripe Dashboard |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | From Stripe Dashboard |
| `PAYPAL_CLIENT_ID` | Your PayPal ID | From PayPal Developer |
| `PAYPAL_SECRET` | Your PayPal Secret | From PayPal Developer |
| `EMAIL_API_KEY` | Your email API key | SendGrid/Mailgun |
| `ADMIN_PASSWORD` | Strong password | For admin panel access |

3. Click **"Save"**

### Step 2: Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **"Developers"** → **"API keys"**
3. Copy:
   - **Publishable key** (starts with `pk_live_` or `pk_test_`)
   - **Secret key** (starts with `sk_live_` or `sk_test_`)
4. Add to Cloudflare environment variables

### Step 3: Get PayPal Keys

1. Go to [PayPal Developer](https://developer.paypal.com)
2. Go to **"My Apps & Credentials"**
3. Create a new app or use existing
4. Copy **Client ID** and **Secret**
5. Add to Cloudflare environment variables

---

## Part 5: Upload License Keys

### Step 1: Prepare License Keys

1. Create a text file with one license key per line:
   ```
   ASPIRE-XXXX-XXXX-XXXX-XXXX
   ASPIRE-YYYY-YYYY-YYYY-YYYY
   ASPIRE-ZZZZ-ZZZZ-ZZZZ-ZZZZ
   ```

### Step 2: Upload via KV

1. Go to **KV** → **ASPRE_LICENSES**
2. Click **"Add entry"**
3. **Key:** `licenses:available`
4. **Value:** 
   ```json
   ["ASPIRE-XXXX-XXXX-XXXX-XXXX", "ASPIRE-YYYY-YYYY-YYYY-YYYY", ...]
   ```
5. Click **"Add entry"**

Or use Wrangler CLI:
```bash
wrangler kv:key put --namespace-id=YOUR_NAMESPACE_ID "licenses:available" '[...]'
```

---

## Part 6: Configure Payment Processors

### Stripe Setup

1. **Test Mode First:**
   - Use test keys (`pk_test_` and `sk_test_`)
   - Test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

2. **Enable Payment Methods:**
   - Go to Stripe Dashboard → **Settings** → **Payment methods**
   - Enable: Cards, Apple Pay, Google Pay

3. **Webhooks (Optional but Recommended):**
   - Add webhook endpoint: `https://aspre.pages.dev/api/stripe-webhook`
   - Select events: `payment_intent.succeeded`, `charge.failed`

### PayPal Setup

1. Create **REST API app** in PayPal Developer
2. Enable **"Accept payments"**
3. Add return URL: `https://aspre.pages.dev/thank-you.html`
4. Add cancel URL: `https://aspre.pages.dev/checkout.html`

---

## Part 7: Email Service Setup

### Option A: SendGrid

1. Sign up at [SendGrid](https://sendgrid.com)
2. Create API key with **"Mail Send"** permission
3. Add sender: `noreply@your-domain.com`
4. Verify sender email
5. Add API key to Cloudflare env variables

### Option B: Mailgun

1. Sign up at [Mailgun](https://mailgun.com)
2. Add your domain
3. Verify domain (add DNS records)
4. Get API key from **Settings** → **API Keys**
5. Add to Cloudflare env variables

---

## Part 8: Custom Domain (Optional)

### Step 1: Add Custom Domain

1. In your aspre project, go to **"Custom domains"**
2. Click **"Set up a custom domain"**
3. Enter your domain: `aspire-software.com`
4. Click **"Continue"**

### Step 2: Configure DNS

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Update DNS records as shown by Cloudflare
3. Wait for DNS propagation (up to 24 hours)

### Step 3: Enable HTTPS

- HTTPS is automatic with Cloudflare
- SSL certificate is automatically provisioned

---

## Part 9: Testing

### Test Checklist:

- [ ] Visit your site: `https://aspre.pages.dev`
- [ ] Navigate all pages
- [ ] Submit FAQ accordion
- [ ] Test contact form
- [ ] **Test checkout with Stripe test card**
- [ ] Verify email delivery
- [ ] Check license key assignment
- [ ] Test mobile responsiveness
- [ ] Test on different browsers

### Test Payment Flow:

1. Click **"Buy Now"**
2. Fill in customer details
3. Use test card: `4242 4242 4242 4242`
4. Complete purchase
5. Verify:
   - Order created in KV
   - License assigned
   - Email received
   - Thank you page displays

---

## Part 10: Go Live!

### Final Checklist:

- [ ] All assets uploaded (images, videos)
- [ ] Pricing updated
- [ ] Contact info updated
- [ ] License keys uploaded
- [ ] Download links configured
- [ ] Switch Stripe to **LIVE** keys
- [ ] Switch PayPal to **LIVE** mode
- [ ] Test complete purchase flow
- [ ] Monitor first few orders closely

### Launch Day:

1. Switch to live payment keys
2. Upload real license keys
3. Test one more time with real purchase
4. Announce launch!
5. Monitor Cloudflare Analytics

---

## Troubleshooting

### Issue: Payments not processing
- Check Stripe/PayPal keys in environment variables
- Verify keys are LIVE (not test) keys
- Check browser console for errors

### Issue: Emails not sending
- Verify email API key
- Check sender email is verified
- Look at email service logs

### Issue: License keys not assigning
- Check KV namespace bindings
- Verify `licenses:available` key exists
- Ensure licenses array is valid JSON

### Issue: Functions not working
- Check Functions are enabled in Cloudflare
- Verify KV bindings are correct
- Look at Function logs in Cloudflare Dashboard

---

## Support & Maintenance

### Regular Tasks:

1. **Monitor orders:** Check Cloudflare KV → ASPRE_ORDERS daily
2. **Refill license keys:** Add more to KV when running low
3. **Check analytics:** Monitor conversion rates
4. **Update pricing:** Via CONFIG in main.js
5. **Backup data:** Export KV data regularly

### Getting Help:

- Cloudflare Docs: https://developers.cloudflare.com/pages
- Stripe Docs: https://stripe.com/docs
- PayPal Docs: https://developer.paypal.com/docs

---

## 🎉 Congratulations!

Your ASPRE platform is now live and ready to sell Vectric Aspire 12 licenses!

**Your site:** `https://aspre.pages.dev` (or your custom domain)

**Next steps:**
- Drive traffic to your site
- Monitor conversions
- Optimize based on analytics
- Scale as needed!

---

*For questions or issues, refer to the main README.md or Cloudflare documentation.*
