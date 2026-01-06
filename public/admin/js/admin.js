// Admin Dashboard Logic
const API_BASE = '/admin/api';
let charts = {}; // Store chart instances
let currentSettings = {};

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    setupNavigation();
    setupEventListeners();

    // Initial Load
    await loadAnalytics();
    await loadSettings();

    // Auto-refresh Analytics every 30s
    setInterval(loadAnalytics, 30000);
});

// Auth Check
async function checkAuth() {
    try {
        const res = await fetch(`${API_BASE}/verify`);
        if (!res.ok) window.location.href = 'login.html';
        const data = await res.json();
        document.getElementById('adminUsername').textContent = data.username || 'Admin';
    } catch (e) {
        window.location.href = 'login.html';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    const origEl = document.getElementById('priceOriginal');
    const currEl = document.getElementById('priceCurrent');
    if (origEl) origEl.addEventListener('input', calculateDiscount);
    if (currEl) currEl.addEventListener('input', calculateDiscount);
}

// Navigation
function setupNavigation() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.dataset.tab;

            // UI Update
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            const target = document.getElementById(tabId);
            if (target) target.classList.add('active');

            // Close sidebar on mobile
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
            }

            // Update page title
            const titles = {
                'analytics': 'Dashboard Analytics',
                'chat': 'Live Chat Inbox',
                'payments': 'Payment Settings',
                'pricing': 'Pricing Management',
                'marketing': 'Marketing & Tracking',
                'security': 'Security Settings'
            };
            document.getElementById('pageTitle').textContent = titles[tabId] || 'Dashboard';

            // Load specific data if needed
            if (tabId === 'analytics') loadAnalytics();
            if (tabId === 'chat') loadChatInbox();
        });
    });
}

// Load Settings
async function loadSettings() {
    try {
        const res = await fetch(`${API_BASE}/settings`);
        if (res.ok) {
            currentSettings = await res.json();
            populateForms(currentSettings);
        }
    } catch (e) {
        console.error('Error loading settings', e);
    }
}

// Populate Forms with Data
function populateForms(data) {
    // Stripe
    if (data.stripe) {
        document.getElementById('stripePublicKey').value = data.stripe.publicKey || '';
        document.getElementById('stripeLinkUSD').value = data.stripe.links?.usd || '';
        document.getElementById('stripeLinkGBP').value = data.stripe.links?.gbp || '';
    }

    // Pricing
    if (data.pricing) {
        document.getElementById('currencySymbol').value = data.pricing.symbol || '$';
        document.getElementById('currencyCode').value = data.pricing.code || 'USD';
        document.getElementById('priceOriginal').value = data.pricing.original || '';
        document.getElementById('priceCurrent').value = data.pricing.current || '';
        calculateDiscount();
    }

    // Marketing
    if (data.marketing) {
        document.getElementById('googleAdsId').value = data.marketing.googleAds || '';
        document.getElementById('ga4Id').value = data.marketing.ga4 || '';
        document.getElementById('gtmId').value = data.marketing.gtm || '';
    }
}

// Calculate Discount
function calculateDiscount() {
    const original = parseFloat(document.getElementById('priceOriginal').value) || 0;
    const current = parseFloat(document.getElementById('priceCurrent').value) || 0;
    const symbol = document.getElementById('currencySymbol').value;

    if (original > 0 && current > 0) {
        const discount = original - current;
        const percent = Math.round((discount / original) * 100);
        document.getElementById('priceDiscount').value = `${symbol}${discount.toFixed(2)} (${percent}% OFF)`;
    }
}

// Save Settings
async function saveSettings(e, type) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Saving...';
    btn.disabled = true;

    try {
        let payload = {};

        if (type === 'stripe') {
            payload.stripe = {
                publicKey: document.getElementById('stripePublicKey').value,
                links: {
                    usd: document.getElementById('stripeLinkUSD').value,
                    gbp: document.getElementById('stripeLinkGBP').value
                }
            };
        }

        if (type === 'pricing') {
            payload.pricing = {
                symbol: document.getElementById('currencySymbol').value,
                code: document.getElementById('currencyCode').value,
                original: parseFloat(document.getElementById('priceOriginal').value),
                current: parseFloat(document.getElementById('priceCurrent').value)
            };
        }

        if (type === 'marketing') {
            payload.marketing = {
                googleAds: document.getElementById('googleAdsId').value,
                ga4: document.getElementById('ga4Id').value,
                gtm: document.getElementById('gtmId').value
            };
        }

        const res = await fetch(`${API_BASE}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showToast('Settings saved successfully');
            await loadSettings(); // Reload to confirm
        } else {
            throw new Error('Failed to save');
        }

    } catch (e) {
        showToast('Error saving settings', 'error');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// Change Password
async function updatePassword(e) {
    e.preventDefault();
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (newPass !== confirm) {
        showToast('New passwords do not match', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ current, newPass })
        });

        if (res.ok) {
            showToast('Password updated successfully');
            e.target.reset();
        } else {
            showToast('Failed to update password', 'error');
        }
    } catch (e) {
        showToast('Error updating password', 'error');
    }
}

// Load Analytics Data
async function loadAnalytics() {
    try {
        const res = await fetch(`${API_BASE}/analytics`);
        if (!res.ok) return;
        const data = await res.json();

        updateSummaryCards(data);
        updateCharts(data.history);
        updateLiveUsers(data.realtime);
        updateErrorLog(data.errors);
        updateClicks(data.clicks);

    } catch (e) {
        console.error('Failed to load analytics', e);
    }
}

function updateSummaryCards(data) {
    document.getElementById('statViews').textContent = data.today?.views || 0;
    document.getElementById('statLive').textContent = data.realtime?.count || 0;
    document.getElementById('statConversions').textContent = data.today?.conversions || 0;
    document.getElementById('statErrors').textContent = data.errors?.length || 0;
}

function updateCharts(history) {
    const canvas = document.getElementById('trafficChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Destroy existing if needed
    if (charts.traffic) charts.traffic.destroy();

    charts.traffic = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Visitors',
                data: history.visitors,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { borderDash: [2, 4] } },
                x: { grid: { display: false } }
            }
        }
    });

    // Update Country List
    const countryList = document.getElementById('countryList');
    if (!countryList) return;
    countryList.innerHTML = `
        <div class="country-item">
            <div class="country-info">
                <span class="flag">🇺🇸</span>
                <span class="country-name">United States</span>
            </div>
            <span class="country-count">45%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width: 45%"></div></div>
        
        <div class="country-item" style="margin-top: 1rem">
            <div class="country-info">
                <span class="flag">🇬🇧</span>
                <span class="country-name">United Kingdom</span>
            </div>
            <span class="country-count">20%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width: 20%"></div></div>
    `;
}

function updateLiveUsers(realtime) {
    const tbody = document.getElementById('liveUsersTable');
    if (!tbody) return;
    if (!realtime.users || realtime.users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#9ca3af;">No active users right now</td></tr>';
        return;
    }

    tbody.innerHTML = realtime.users.map(u => `
        <tr>
            <td>
                <i class="fas fa-globe-americas" style="color:#9ca3af; margin-right:5px;"></i>
                ${u.city}, ${u.country}
            </td>
            <td>${u.url}</td>
            <td>Just now</td>
        </tr>
    `).join('');
}

function updateErrorLog(errors) {
    const container = document.getElementById('errorLog');
    if (!container) return;
    if (!errors || errors.length === 0) {
        container.innerHTML = '<div class="log-item empty">No recent errors detected.</div>';
        return;
    }

    container.innerHTML = errors.map(e => `
        <div class="log-item error">
            <div class="log-content">
                <h4>${e.message}</h4>
                <p>${e.source}:${e.lineno}</p>
            </div>
            <div class="log-time">${new Date(e.ts).toLocaleTimeString()}</div>
        </div>
    `).join('');
}

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');

    msgEl.textContent = msg;
    toast.className = 'toast show';

    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        icon.style.color = '#ef4444';
    } else {
        icon.className = 'fas fa-check-circle';
        icon.style.color = '#10b981';
    }

    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function updateClicks(clicks) {
    const tbody = document.getElementById('clicksTable');
    const badge = document.getElementById('clicksCount');

    if (!tbody) return;

    if (!clicks || clicks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#9ca3af;">No click data yet</td></tr>';
        if (badge) badge.textContent = '0 clicks';
        return;
    }

    if (badge) badge.textContent = `${clicks.length} recent`;

    tbody.innerHTML = clicks.slice(0, 20).map(c => {
        const icon = c.type === 'link' ? '<i class="fas fa-link"></i>' : '<i class="fas fa-hand-pointer"></i>';
        const url = c.href ? `<a href="${c.href}" target="_blank" style="color:#0066cc; text-decoration:none;">${c.href.slice(0, 40)}...</a>` : '-';

        return `
            <tr>
                <td>${icon} ${c.type || 'click'}</td>
                <td><strong>${c.text}</strong></td>
                <td>${url}</td>
                <td>${new Date(c.ts).toLocaleTimeString()}</td>
            </tr>
        `;
    }).join('');
}

async function logout() {
    await fetch(`${API_BASE}/logout`, { method: 'POST' });
    window.location.href = 'login.html';
}
