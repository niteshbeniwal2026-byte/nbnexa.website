/* ============================================================
   js/admin.js — Admin Panel JavaScript
   NB Nexa | AI Automation Agency
   ============================================================ */

'use strict';

// ── LIVE CLOCK ───────────────────────────────────────────────
function updateClock() {
  const el = document.getElementById('live-clock');
  if (el) {
    el.textContent = new Date().toLocaleString('en-IN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }
}
updateClock();
setInterval(updateClock, 1000);

// ── LEAD TABLE SEARCH ────────────────────────────────────────
const leadSearch = document.getElementById('lead-search');
if (leadSearch) {
  leadSearch.addEventListener('input', () => {
    const q = leadSearch.value.toLowerCase();
    document.querySelectorAll('.lead-row').forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

// ── CHART: Lead Growth ───────────────────────────────────────
const leadChartEl = document.getElementById('leadGrowthChart');
if (leadChartEl && typeof Chart !== 'undefined') {
  try {
    new Chart(leadChartEl.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Leads',
          data: [1100, 1500, 1300, 1900, 1700, 2300, 2842],
          backgroundColor: 'rgba(0, 219, 233, 0.15)',
          borderColor: '#00dbe9',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0d1117',
            titleColor: '#dbfcff',
            bodyColor: '#64748b',
            borderColor: '#1f2937',
            borderWidth: 1,
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#475569', font: { size: 11 } }
          },
          y: {
            grid: { color: 'rgba(31,41,55,0.5)' },
            ticks: { color: '#475569', font: { size: 11 } },
            beginAtZero: true
          }
        }
      }
    });
  } catch (err) {
    console.warn('Admin chart failed to initialize:', err);
  }
}

// ── CHART RANGE TABS (dashboard) ─────────────────────────────
document.querySelectorAll('[data-admin-chart-ranges]').forEach(group => {
  group.querySelectorAll('[data-admin-chart-range]').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('[data-admin-chart-range]').forEach(b => {
        const on = b === btn;
        b.classList.toggle('bg-surface-container-highest', on);
        b.classList.toggle('text-primary', on);
        b.classList.toggle('text-on-surface-variant', !on);
      });
    });
  });
});

// ── SIDEBAR MOBILE TOGGLE ────────────────────────────────────
const sidebarToggle = document.getElementById('sidebar-toggle');
const adminSidebar = document.getElementById('admin-sidebar');
if (sidebarToggle && adminSidebar) {
  sidebarToggle.addEventListener('click', () => {
    adminSidebar.classList.toggle('open');
  });
}

// ── NOTIFICATION BADGE ───────────────────────────────────────
function updateNotificationBadge(count) {
  const badge = document.getElementById('notif-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ── LIVE CHAT AUTO-SCROLL ────────────────────────────────────
const chatFeed = document.getElementById('chat-feed');
if (chatFeed) {
  chatFeed.scrollTop = chatFeed.scrollHeight;
}

// ── ANIMATED STAT CARDS ──────────────────────────────────────
document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      const target = Number(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur).toLocaleString() + suffix;
        if (cur >= target) clearInterval(timer);
      }, 20);
      observer.disconnect();
    }
  }, { threshold: 0.5 });
  observer.observe(el);
});

// ── EXPORT CSV (stub) ────────────────────────────────────────
window.exportCSV = function() {
  const rows = [];
  document.querySelectorAll('.lead-row').forEach(row => {
    const cells = [...row.querySelectorAll('td')].map(td => `"${td.textContent.trim()}"`);
    rows.push(cells.join(','));
  });
  if (!rows.length) { alert('No data to export'); return; }
  const csv = 'Name,Contact,Source,Status\n' + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'nbnexa-leads.csv' });
  a.click();
  URL.revokeObjectURL(url);
};
