// Admin Dashboard Logic
const API_BASE = '/admin/api';
let charts = {}; // Store chart instances

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    setupNavigation();

    // Initial Load
    await loadAnalytics();

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

// Navigation
function setupNavigation() {
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

            // Load specific data if needed
            if (tabId === 'analytics') loadAnalytics();
            // Add other tab loaders here if needed
        });
    });
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
    const ctx = document.getElementById('trafficChart').getContext('2d');

    // Destroy existing if needed
    if (charts.traffic) charts.traffic.destroy();

    charts.traffic = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Mock labels for now
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

    // Update Country List (Mock for now as we need real data aggregation)
    const countryList = document.getElementById('countryList');
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

async function logout() {
    await fetch(`${API_BASE}/logout`, { method: 'POST' });
    window.location.href = 'login.html';
}
