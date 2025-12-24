# 🛒 ASPRE Checkout Modal - Complete Setup Guide

## 📋 Overview
This guide will help you set up the new email-collection checkout popup that:
1. ✅ Collects customer email
2. ✅ Sends email to Google Sheets
3. ✅ Redirects to Stripe with email prefilled
4. ✅ Matches the design you uploaded

---

## 🎯 STEP 1: Set Up Google Sheets

### 1.1 Create Your Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"Aspire 12 - Checkout Emails"**

### 1.2 Add Column Headers
In Row 1, add these headers:
- **A1**: `Timestamp`
- **B1**: `Email`
- **C1**: `Product`
- **D1**: `Source URL`

### 1.3 Create Google Apps Script
1. In your spreadsheet, go to **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    // Get the active sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Add row to sheet with data
    sheet.appendRow([
      new Date(),                    // Timestamp
      data.email || '',              // Email
      data.product || 'Aspire 12',   // Product
      data.source || ''              // Source URL
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'success',
        'message': 'Email saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'error', 
        'error': error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 1.4 Deploy the Script
1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: `Checkout Email Collector`
   - **Execute as**: `Me (your@email.com)`
   - **Who has access**: `Anyone`
5. Click **Deploy**
6. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)
7. Click **Done**

### 1.5 Test the Script
1. Click **Deploy** → **Test deployments**
2. Copy the test URL
3. You can test it with curl:

```bash
curl -L -X POST \
  'YOUR_SCRIPT_URL' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","product":"Aspire 12"}'
```

---

## 🎨 STEP 2: Update Your Website

### 2.1 Add the New JavaScript File

Add this line in your `index.html` **BEFORE** the closing `</body>` tag (around line 1629):

```html
<script src="js/checkout-integration.js"></script>
```

### 2.2 Configure the Google Sheets URL

Open `/public/js/checkout-integration.js` and update line 11:

```javascript
googleSheetsUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',
```

Replace with your actual URL from Step 1.4.

### 2.3 Replace the Checkout Modal HTML

**Find this section** in `index.html` (starts around line 1409):

```html
<!-- Checkout Popup Modal -->
<div id="checkoutModal" class="checkout-modal-backdrop"
```

**Replace the entire modal** (from line 1409 to line 1551) with the content from:
`NEW_CHECKOUT_MODAL.html`

> **TIP**: The new modal HTML is provided in the `NEW_CHECKOUT_MODAL.html` file in your ASPRE directory.

### 2.4 Update the JavaScript

**Find this section** in `index.html` (starts around line 1576):

```html
<script>
    const stripeUrl = 'https://buy.stripe.com/...';
    
    function openCheckoutModal() {
```

**REMOVE** the entire script block (lines 1576-1625).

The new `checkout-integration.js` file handles everything!

---

## 🧪 STEP 3: Test Everything

### 3.1 Test Locally
1. Open your website
2. Click any **"Buy Now"** button
3. The modal should open with the new design
4. Enter a test email: `test@example.com`
5. Check the privacy policy checkbox
6. Click **"Proceed to Checkout"**

### 3.2 Verify Google Sheets
1. Go to your Google Sheet
2. You should see a new row with:
   - Timestamp
   - Your test email
   - Product name
   - Source URL

### 3.3 Verify Stripe Redirect
- You should be redirected to Stripe
- The email field should be pre-filled with your test email

---

## 📁 File Structure

After setup, your files should look like this:

```
ASPRE/
├── public/
│   ├── index.html (updated)
│   ├── js/
│   │   ├── checkout-integration.js ✅ NEW
│   │   ├── main.js
│   │   └── geo-currency.js
│   └── ...
├── NEW_CHECKOUT_MODAL.html (reference)
├── CHECKOUT_INTEGRATION_GUIDE.html (reference)
└── THIS_FILE.md
```

---

## 🎯 Quick Reference

### Key Files to Edit:
1. ✅ `/public/js/checkout-integration.js` - Add your Google Sheets URL
2. ✅ `/public/index.html` - Replace checkout modal HTML
3. ✅ `/public/index.html` - Add script tag for checkout-integration.js

### URLs You Need:
- **Google Sheets URL**: From Step 1.4
- **Stripe URL**: Already configured (`https://buy.stripe.com/bJecN7frL2v38C3an5aAw01`)

---

## 🐛 Troubleshooting

### Modal doesn't open
- Check browser console for errors
- Verify `checkout-integration.js` is loaded
- Check that buy buttons have the correct event listeners

### Email not saving to Google Sheets
- Verify the Apps Script deployment URL is correct
- Check that the script is deployed as "Anyone" can access
- Look at the browser Network tab for failed requests

### Stripe redirect not working
- Check that the Stripe URL is correct
- Verify email is properly encoded in the URL

### Form validation issues
- Ensure email format is correct
- Checkbox must be checked
- All required fields must be filled

---

## 📞 Support

If you encounter any issues:
1. Check the browser console (F12) for errors
2. Verify all URLs are correctly configured
3. Test the Google Script directly using curl
4. Make sure all files are properly uploaded

---

## ✅ Checklist

Before going live, verify:

- [ ] Google Sheet is created with correct headers
- [ ] Apps Script is deployed and URL is copied
- [ ] `checkout-integration.js` has the correct Google Sheets URL
- [ ] New checkout modal HTML is in place
- [ ] Old JavaScript code is removed
- [ ] Script tag for `checkout-integration.js` is added
- [ ] Test email submission works
- [ ] Google Sheet receives the email
- [ ] Stripe redirect works with pre-filled email
- [ ] Privacy Policy and Terms links work
- [ ] Modal closes correctly

---

**🎉 You're all set! Your new checkout system is ready to collect emails and process orders!**
