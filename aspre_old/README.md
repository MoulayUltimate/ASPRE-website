# ASPRE - Vectric Aspire 12 E-Commerce Platform

🚀 **Professional full-stack e-commerce website for selling Vectric Aspire 12 software licenses**

## 📁 Project Structure

```
ASPRE/
├── public/                      # Frontend files
│   ├── index.html              # Landing page
│   ├── product.html            # Product details
│   ├── features.html           # Features showcase
│   ├── testimonials.html       # Customer reviews
│   ├── faq.html                # FAQ page
│   ├── checkout.html           # Purchase page
│   ├── support.html            # Support/Contact
│   ├── terms.html              # Terms & Conditions
│   ├── privacy.html            # Privacy Policy
│   ├── blog.html               # Blog template
│   ├── thank-you.html          # Post-purchase page
│   ├── admin/                  # Admin panel
│   │   └── index.html          # Admin dashboard
│   ├── css/
│   │   ├── main.css            # Core design system
│   │   └── admin.css           # Admin styles
│   ├── js/
│   │   ├── main.js             # Frontend logic
│   │   ├── checkout.js         # Payment handling
│   │   └── admin.js            # Admin panel logic
│   └── assets/
│       ├── images/             # Product images (you'll add)
│       ├── videos/             # Demo videos (you'll add)
│       └── icons/              # UI icons
├── functions/                   # Cloudflare Workers/Functions
│   ├── api/
│   │   ├── create-order.js     # Process orders
│   │   ├── assign-license.js   # Auto-assign license keys
│   │   ├── send-email.js       # Email delivery
│   │   ├── validate-payment.js # Payment validation
│   │   └── admin-api.js        # Admin endpoints
│   └── _middleware.js          # CORS, auth, etc.
├── database/                    # Cloudflare KV structure docs
│   └── schema.md               # Database schema
├── wrangler.toml               # Cloudflare configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🚀 Deployment Instructions

### Prerequisites
- GitHub account
- Cloudflare account
- Stripe account (for payments)
- PayPal Business account (optional)

### Step 1: GitHub Setup
1. Push this repository to GitHub
2. Go to your GitHub repository settings

### Step 2: Cloudflare Pages Setup
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Pages** → **Create a project**
3. Connect your GitHub repository (ASPRE)
4. Build settings:
   - **Build command:** `npm run build` (or leave empty for static)
   - **Build output directory:** `public`
   - **Root directory:** `/`
5. Click **Save and Deploy**

### Step 3: Cloudflare Functions Setup
1. Install Wrangler CLI: `npm install -g wrangler`
2. Login: `wrangler login`
3. Deploy functions: `wrangler publish`

### Step 4: Environment Variables
Set these in Cloudflare Pages → Settings → Environment variables:
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `PAYPAL_CLIENT_ID` - PayPal client ID
- `PAYPAL_SECRET` - PayPal secret
- `EMAIL_API_KEY` - Email service API key (SendGrid/Mailgun)
- `ADMIN_PASSWORD` - Admin panel password

### Step 5: Cloudflare KV Setup
1. Create KV namespaces:
   - `ASPRE_LICENSES` - License key storage
   - `ASPRE_ORDERS` - Order data
   - `ASPRE_CUSTOMERS` - Customer info
   - `ASPRE_SETTINGS` - Site settings

2. Bind KV namespaces in `wrangler.toml`

## 📦 Adding Your Content

### Images
Place your images in `public/assets/images/`:
- `hero-image.jpg` - Hero section background
- `product-screenshot-*.jpg` - Product screenshots
- `feature-*.jpg` - Feature illustrations
- `testimonial-*.jpg` - Customer photos
- `logo.png` - Your logo

### Videos
Place your videos in `public/assets/videos/`:
- `hero-video.mp4` - Hero section video
- `installation-guide.mp4` - Installation tutorial
- `features-demo.mp4` - Features demonstration

### License Keys
Upload license keys via Admin Panel → License Manager

### Pricing & Content
Edit settings via Admin Panel or directly in:
- `public/js/config.js` - Site configuration

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Test Cloudflare Functions locally
wrangler dev
```

## 📧 Email Templates

Email templates are located in the admin panel. Customize:
- Order confirmation email
- License delivery email
- Support request auto-reply

## 🛡️ Security Features

- ✅ Secure payment processing (Stripe/PayPal)
- ✅ HTTPS enforced
- ✅ Admin password protection
- ✅ Rate limiting on APIs
- ✅ Input validation
- ✅ XSS protection

## 📊 Analytics

Integrate Google Analytics or Cloudflare Analytics:
- Add tracking code to `public/index.html`
- Monitor conversions via admin dashboard

## 💰 Payment Flow

1. Customer clicks "Buy Now"
2. Redirected to checkout page
3. Payment processed via Stripe/PayPal
4. Order created in database
5. License key auto-assigned
6. Confirmation email sent with license + download link
7. Customer redirected to thank-you page

## 🎨 Customization

Edit colors, fonts, and styles in:
- `public/css/main.css` - CSS variables at top

## 📞 Support

For issues or questions, contact: [your-email@example.com]

## 📝 License

All rights reserved. Commercial use only for Vectric Aspire 12 license sales.

---

**Built with ❤️ for professional CNC software sales**
