# ASPRE - Asset Placement Guide

## 📁 Directory Structure

Place your assets in the following directories:

### `/public/assets/images/`
Add all images with these exact filenames:

#### **Hero & Branding**
- `logo.png` - Your ASPRE logo (recommended: 200x60px, transparent background)
- `favicon.png` - Browser favicon (32x32px or 64x64px)
- `hero-image.jpg` - Hero section background/product shot (1920x1080px recommended)
- `og-image.jpg` - Social media sharing image (1200x630px)

#### **Features & Product**
- `feature-1.jpg` through `feature-12.jpg` - Feature illustration images
- `product-screenshot-1.jpg` through `product-screenshot-10.jpg` - Aspire 12 screenshots
- `why-choose-us.jpg` - Benefits section image (800x1000px)

#### **Testimonials**
- `testimonial-1.jpg` through `testimonial-6.jpg` - Customer photos (square, 200x200px minimum)

#### **Other**
- `payment-methods.png` - Stripe/PayPal logos (transparent, ~300x60px)

### `/public/assets/videos/`
Add video files:

- `hero-video.mp4` - Hero section demonstration video (1920x1080, 10-30 seconds, optimized for web)
- `installation-guide.mp4` - Installation tutorial video
- `features-demo.mp4` - Features walkthrough video

**Video Requirements:**
- Format: MP4 (H.264 codec)
- Max file size: 10MB for hero video, 50MB for tutorials
- Resolution: 1920x1080 or 1280x720
- Frame rate: 30fps
- Bitrate: 2-5 Mbps

### `/public/assets/icons/`
Optional custom icons (if not using Font Awesome):

- Feature icons
- UI elements
- Custom graphics

---

## 🎨 Image Guidelines

### **Recommended Sizes:**
| Image Type | Dimensions | Format | Notes |
|------------|------------|---------|-------|
| Hero Image | 1920x1080px | JPG | High quality, optimized |
| Feature Cards | 800x600px | JPG/PNG | Can have transparency |
| Testimonials | 200x200px | JPG | Square, professional headshots |
| Logo | 200x60px | PNG | Transparent background |
| Screenshots | 1920x1080px | JPG/PNG | Clear, high-res |

### **Optimization:**
- Compress all images before upload
- Use JPG for photos, PNG for graphics with transparency
- Recommended tools: TinyPNG, ImageOptim, Squoosh
- Target: <500KB for large images, <100KB for thumbnails

---

## 🎬 Video Placement Examples

### Hero Video:
```html
<video autoplay muted loop playsinline poster="/assets/images/hero-image.jpg">
    <source src="/assets/videos/hero-video.mp4" type="video/mp4">
</video>
```

### Installation Guide:
```html
<video controls poster="/assets/images/installation-thumbnail.jpg">
    <source src="/assets/videos/installation-guide.mp4" type="video/mp4">
</video>
```

---

## 📝 Content to Prepare

### **License Keys**
- Upload via Admin Panel once deployed
- Format: Plain text file, one key per line
- Example: `ASPIRE-XXXX-XXXX-XXXX-XXXX`

### **Download Links**
- Update in `functions/api/create-order.js` (line ~150)
- Replace `YOUR_DOWNLOAD_LINK` with actual Aspire 12 installer URL

### **Pricing**
- Edit in `public/js/main.js` → CONFIG object
- Current: $119
- Original: $1,995

### **Contact Info**
- Update email addresses
- Update support phone number
- Update social media links

---

## ✅ Checklist Before Launch

- [ ] All images uploaded
- [ ] Videos optimized and uploaded
- [ ] Logo and favicon in place
- [ ] License keys prepared
- [ ] Download links configured
- [ ] Pricing verified
- [ ] Contact information updated
- [ ] Testing email delivery
- [ ] Payment gateways connected (Stripe/PayPal)
- [ ] Domain configured in Cloudflare

---

## 🚀 Quick Start

1. **Add your logo first:**
   ```
   /public/assets/images/logo.png
   ```

2. **Add hero image/video:**
   ```
   /public/assets/images/hero-image.jpg
   /public/assets/videos/hero-video.mp4
   ```

3. **Add product screenshots** (at least 5-10)

4. **Add testimonial photos**

5. **Test locally** before deploying

---

For questions, see main README.md
