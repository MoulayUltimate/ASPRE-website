// Config Loader - Fetches dynamic settings from Admin Dashboard
(function () {
    const CONFIG_API = '/api/config';

    async function loadConfig() {
        try {
            const res = await fetch(CONFIG_API);
            if (!res.ok) return;
            const config = await res.json();

            if (config.pricing) updatePricing(config.pricing);
            if (config.stripe) updateStripe(config.stripe);
            if (config.marketing) injectTracking(config.marketing);

        } catch (e) {
            console.warn('Using default static config');
        }
    }

    function updatePricing(pricing) {
        if (!pricing.current) return;

        const symbol = pricing.symbol || '$';

        // Update Main Price
        document.querySelectorAll('.price-main').forEach(el => {
            el.textContent = `${symbol}${pricing.current}`;
        });

        // Update Retail Price
        document.querySelectorAll('.price-retail').forEach(el => {
            el.textContent = `${symbol}${pricing.original}`;
        });

        // Update Discount
        if (pricing.original && pricing.current) {
            const discount = pricing.original - pricing.current;
            document.querySelectorAll('.price-discount').forEach(el => {
                el.textContent = `${symbol}${discount.toLocaleString()}`;
            });

            // Update Total Discount in breakdown
            document.querySelectorAll('.price-total-discount').forEach(el => {
                el.textContent = `-${symbol}${discount.toLocaleString()}`;
            });
        }

        // Update Global Currency Config for Geo-Currency script
        if (window.CURRENCY_CONFIG && window.CURRENCY_CONFIG.USD) {
            window.CURRENCY_CONFIG.USD.prices.main = pricing.current;
            window.CURRENCY_CONFIG.USD.prices.retail = pricing.original;
        }
    }

    function updateStripe(stripe) {
        if (!stripe.links) return;

        // Update Payment Links

        // Update global config for checkout.js
        if (typeof CHECKOUT_CONFIG !== 'undefined') {
            if (stripe.links.usd) CHECKOUT_CONFIG.stripeUrl = stripe.links.usd;
        }

        // Update direct links
        const buyButtons = document.querySelectorAll('a[href*="stripe.com"]');
        buyButtons.forEach(btn => {
            // Simple heuristic: if it looks like a USD link, update it
            if (stripe.links.usd) {
                btn.href = stripe.links.usd;
                btn.setAttribute('onclick', `return gtag_report_conversion('${stripe.links.usd}')`);
            }
        });

        // Update Geo-Currency Config
        if (window.CURRENCY_CONFIG) {
            if (stripe.links.usd && window.CURRENCY_CONFIG.USD) {
                window.CURRENCY_CONFIG.USD.checkoutUrl = stripe.links.usd;
            }
            if (stripe.links.gbp && window.CURRENCY_CONFIG.GBP) {
                window.CURRENCY_CONFIG.GBP.checkoutUrl = stripe.links.gbp;
            }
        }
    }

    function injectTracking(marketing) {
        // Google Ads
        if (marketing.googleAds && !document.getElementById('dynamic-gads')) {
            const script = document.createElement('script');
            script.id = 'dynamic-gads';
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${marketing.googleAds}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', marketing.googleAds);
        }

        // GA4
        if (marketing.ga4 && !document.getElementById('dynamic-ga4')) {
            const script = document.createElement('script');
            script.id = 'dynamic-ga4';
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${marketing.ga4}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', marketing.ga4);
        }
    }

    // Run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadConfig);
    } else {
        loadConfig();
    }
})();
