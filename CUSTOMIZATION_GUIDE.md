# Currency Conversion - Customization Guide

## Adding New Currencies

If you want to add more currencies (e.g., Japanese Yen, Swiss Franc), here's how:

### 1. Add Currency Configuration

Edit `/public/js/geo-currency.js` and add to `CURRENCY_CONFIG`:

```javascript
'JPY': {
    symbol: '¥',
    code: 'JPY',
    rate: 150,  // 1 USD = 150 JPY (approximate)
    position: 'before',
    prices: {
        main: 17850,           // 119 USD × 150
        retail: 299250,        // 1995 USD × 150
        discount: 281400,      // 1876 USD × 150
        trainingLibrary: 64050,
        designFiles: 38850,
        installationSupport: 22350,
        lifetimeUpdates: 500550,
        totalDiscount: 482700,
        fullPackageRetail: 518550
    }
},
```

### 2. Add Country Mappings

In the same file, add to `COUNTRY_TO_CURRENCY`:

```javascript
// Japanese Yen
'JP': 'JPY',  // Japan
```

### 3. Add to Widget Selector

Find the `addCurrencyIndicator()` function and add:

```javascript
<option value="JPY">🇯🇵 JPY (¥)</option>
```

---

## Changing Exchange Rates

To update exchange rates, edit the `prices` object for each currency:

**Example:** If GBP rate changes from 0.79 to 0.75:

```javascript
'GBP': {
    symbol: '£',
    code: 'GBP',
    rate: 0.75,  // Updated rate
    position: 'before',
    prices: {
        main: 89,      // Recalculate: 119 × 0.75 = 89.25 ≈ 89
        retail: 1496,  // Recalculate: 1995 × 0.75 = 1496.25 ≈ 1496
        // ... update all other prices
    }
}
```

**Pro Tip:** Use this formula for each price:
```
New Price = USD Price × New Exchange Rate (rounded)
```

---

## Customizing the Widget

### Change Widget Position

In `addCurrencyIndicator()`, modify the `cssText`:

```javascript
// Original (bottom-right)
bottom: 20px;
right: 20px;

// Change to bottom-left
bottom: 20px;
left: 20px;
right: auto;

// Change to top-right
top: 20px;
right: 20px;
bottom: auto;
```

### Change Widget Colors

```javascript
// Background color
background: white;           // Change to any color
background: #f0f0f0;        // Light gray
background: #1a1a1a;        // Dark mode

// Text color
color: #333;                // Change to match background
color: white;               // For dark backgrounds

// Border
border: 2px solid #0066cc; // Add a border
```

### Change Auto-Fade Timing

```javascript
// Original (10 seconds)
setTimeout(() => {
    indicator.style.opacity = '0.7';
}, 10000);

// Change to 5 seconds
setTimeout(() => {
    indicator.style.opacity = '0.7';
}, 5000);

// Disable auto-fade (stays visible)
// Just comment out the setTimeout block
```

### Make Widget Completely Hidden Until Hover

```javascript
// After creating the indicator, add:
indicator.style.opacity = '0.4';  // Very subtle

// Or make it slide in from the side:
indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: -300px;  // Start off-screen
    /* ... rest of styles ... */
    transition: right 0.3s ease, opacity 0.3s;
`;

// Then show it on hover
indicator.addEventListener('mouseenter', () => {
    indicator.style.right = '20px';
    indicator.style.opacity = '1';
});

indicator.addEventListener('mouseleave', () => {
    indicator.style.right = '-300px';
    indicator.style.opacity = '0.4';
});
```

---

## Adding More Countries

To map more countries to existing currencies:

```javascript
// In COUNTRY_TO_CURRENCY object
'CH': 'EUR',  // Switzerland → EUR (or create CHF)
'NO': 'EUR',  // Norway → EUR (or create NOK)
'SE': 'EUR',  // Sweden → EUR (or create SEK)
'DK': 'EUR',  // Denmark → EUR (or create DKK)
'MX': 'USD',  // Mexico → USD (or create MXN)
'BR': 'USD',  // Brazil → USD (or create BRL)
```

---

## Disable Auto-Detection

If you want to always show USD unless manually changed:

```javascript
// In init() function, comment out or remove:
/*
if (currentCurrency === 'USD') {
    const countryCode = await detectCountry();
    if (countryCode) {
        const detectedCurrency = getCurrencyForCountry(countryCode);
        console.log('Detected currency from country:', detectedCurrency);
        currentCurrency = detectedCurrency;
    }
}
*/
```

---

## Debugging

### Enable Detailed Logging

Add these console logs to track what's happening:

```javascript
// In updateAllPrices()
function updateAllPrices() {
    console.log('=== UPDATING PRICES ===');
    console.log('Current currency:', currentCurrency);
    console.log('Currency config:', CURRENCY_CONFIG[currentCurrency]);
    
    // ... rest of function
    
    console.log('Prices updated successfully!');
}
```

### Test Specific Country Detection

```javascript
// In init() function, force a specific currency:
currentCurrency = 'GBP';  // Always use GBP for testing
// Then comment out the detection code
```

### Check Which Elements Are Being Updated

```javascript
// In updateAllPrices()
console.log('Found .price-main elements:', document.querySelectorAll('.price-main').length);
console.log('Found .price-retail elements:', document.querySelectorAll('.price-retail').length);
console.log('Found .price-discount elements:', document.querySelectorAll('.price-discount').length);
```

---

## Advanced: Dynamic Exchange Rates

To fetch live exchange rates from an API:

```javascript
async function fetchExchangeRates() {
    try {
        // Example using exchangerate-api.com (free tier available)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        // Update rates
        CURRENCY_CONFIG.GBP.rate = data.rates.GBP;
        CURRENCY_CONFIG.EUR.rate = data.rates.EUR;
        CURRENCY_CONFIG.CAD.rate = data.rates.CAD;
        CURRENCY_CONFIG.AUD.rate = data.rates.AUD;
        
        // Recalculate all prices
        for (const currency in CURRENCY_CONFIG) {
            const config = CURRENCY_CONFIG[currency];
            const rate = config.rate;
            
            config.prices.main = Math.round(119 * rate);
            config.prices.retail = Math.round(1995 * rate);
            config.prices.discount = Math.round(1876 * rate);
            // ... calculate all other prices
        }
        
        console.log('Exchange rates updated!');
        return true;
    } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        return false;
    }
}

// Call in init() before detecting currency
async function init() {
    console.log('Initializing geo-currency system...');
    
    // Fetch latest exchange rates
    await fetchExchangeRates();
    
    // ... rest of initialization
}
```

---

## Customization Checklist

Before making changes:
- [ ] Backup `/public/js/geo-currency.js`
- [ ] Test in browser console first
- [ ] Clear browser cache after changes
- [ ] Test all currency conversions
- [ ] Check mobile responsiveness

After making changes:
- [ ] Verify no JavaScript errors (F12 console)
- [ ] Test currency switching still works
- [ ] Check all prices update correctly
- [ ] Test on different browsers
- [ ] Verify widget still appears

---

## Quick Reference: Key Functions

| Function | Purpose | Location |
|----------|---------|----------|
| `formatPrice()` | Format amount with currency symbol | Line 143 |
| `detectCountry()` | Get user's country via IP | Line 152 |
| `updateAllPrices()` | Update all prices on page | Line 216 |
| `addCurrencyIndicator()` | Create the widget | Line 281 |
| `init()` | Main initialization | Line 391 |

---

## Common Issues & Solutions

### Widget Not Appearing
**Problem:** Currency widget is invisible  
**Solution:** Check z-index, verify addCurrencyIndicator() is called

### Prices Not Updating
**Problem:** Prices stay in USD  
**Solution:** Check if CSS classes are applied correctly in HTML

### Detection Not Working
**Problem:** Always defaults to USD  
**Solution:** Check browser console for errors, verify API is accessible

### Wrong Currency for Country
**Problem:** UK visitor sees EUR instead of GBP  
**Solution:** Check COUNTRY_TO_CURRENCY mapping

---

## Support & Resources

- **Main Script:** `/public/js/geo-currency.js`
- **Documentation:** `/GEO_CURRENCY_DOCS.md`
- **Visual Guide:** `/CURRENCY_VISUAL_REFERENCE.txt`
- **This Guide:** `/CUSTOMIZATION_GUIDE.md`

Need more help? Check the browser console (F12) for detailed logs!
