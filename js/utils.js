/* =============================================
   SAARTHI AI – Notification System
   ============================================= */

const Notifications = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(type, title, message, duration = 4000) {
    const icons = { success: '✅', warning: '⚠️', danger: '🚨', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-msg">${message}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">×</button>
    `;
    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s reverse forwards';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
    return toast;
  },

  success(title, msg, duration) { return this.show('success', title, msg, duration); },
  warning(title, msg, duration) { return this.show('warning', title, msg, duration); },
  danger(title, msg, duration)  { return this.show('danger',  title, msg, duration); },
  info(title, msg, duration)    { return this.show('info',    title, msg, duration); },
};

/* =============================================
   SAARTHI AI – Chart Library
   SVG-based charts
   ============================================= */

const Charts = {

  // ── Donut Chart ──────────────────────────
  donut(container, value, max, color, label) {
    const size = 96, r = 36, cx = 48, cy = 48;
    const circ = 2 * Math.PI * r;
    const pct  = Math.min(value / max, 1);
    const dash = circ * pct;

    container.innerHTML = `
      <div class="score-gauge" style="width:${size}px;height:${size}px;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle class="score-gauge-bg" cx="${cx}" cy="${cy}" r="${r}" stroke-width="8"/>
          <circle class="score-gauge-fill" cx="${cx}" cy="${cy}" r="${r}"
            stroke="${color}" stroke-width="8"
            stroke-dasharray="${dash} ${circ}"
            stroke-dashoffset="0"
            style="filter:drop-shadow(0 0 6px ${color})"
          />
        </svg>
        <div class="score-gauge-text">
          <div class="value" style="color:${color}">${Math.round(value)}</div>
          <div class="label">${label}</div>
        </div>
      </div>`;
  },

  // ── Radar Chart (SVG 5-axis) ─────────────
  radar(container, data) {
    const size = 200, cx = 100, cy = 100, r = 70;
    const axes = data.length;
    const angle = (2 * Math.PI) / axes;

    // Grid polygons
    let gridSVG = '';
    [0.25, 0.5, 0.75, 1].forEach(level => {
      const pts = data.map((_, i) => {
        const a = angle * i - Math.PI / 2;
        return `${cx + r * level * Math.cos(a)},${cy + r * level * Math.sin(a)}`;
      }).join(' ');
      gridSVG += `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`;
    });

    // Axis lines
    let axesSVG = data.map((_, i) => {
      const a = angle * i - Math.PI / 2;
      return `<line x1="${cx}" y1="${cy}" x2="${cx + r * Math.cos(a)}" y2="${cy + r * Math.sin(a)}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
    }).join('');

    // Data polygon
    const pts = data.map((d, i) => {
      const a = angle * i - Math.PI / 2;
      const v = d.value / 100;
      return `${cx + r * v * Math.cos(a)},${cy + r * v * Math.sin(a)}`;
    }).join(' ');

    // Axis labels
    let labelsSVG = data.map((d, i) => {
      const a = angle * i - Math.PI / 2;
      const lx = cx + (r + 20) * Math.cos(a);
      const ly = cy + (r + 20) * Math.sin(a);
      return `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="9" fill="rgba(148,163,184,0.9)" font-family="Inter,sans-serif">${d.label}</text>`;
    }).join('');

    container.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        ${gridSVG}${axesSVG}
        <polygon points="${pts}" fill="rgba(37,99,235,0.2)" stroke="rgba(99,179,237,0.8)" stroke-width="2"/>
        ${data.map((d, i) => {
          const a = angle * i - Math.PI / 2;
          const v = d.value / 100;
          return `<circle cx="${cx + r * v * Math.cos(a)}" cy="${cy + r * v * Math.sin(a)}" r="4" fill="#3b82f6"/>`;
        }).join('')}
        ${labelsSVG}
      </svg>`;
  },

  // ── Mini Bar Chart ───────────────────────
  bars(container, data, height = 80) {
    const max = Math.max(...data.map(d => d.value));
    const barW = 100 / data.length;
    const bars = data.map((d, i) => {
      const h = (d.value / max) * height;
      const x = i * barW;
      return `
        <rect x="${x + 2}%" y="${height - h}" width="${barW - 4}%" height="${h}" rx="3" fill="${d.color || 'rgba(37,99,235,0.7)'}"/>
        <text x="${x + barW/2}%" y="${height + 14}" text-anchor="middle" font-size="8" fill="rgba(148,163,184,0.8)" font-family="Inter">${d.label}</text>`;
    }).join('');
    container.innerHTML = `<svg width="100%" height="${height + 20}" style="overflow:visible">${bars}</svg>`;
  },

  // ── Gauge (semi-circle) ──────────────────
  gauge(container, value, max, color, label) {
    const pct = value / max;
    const angle = pct * 180;
    const r = 60, cx = 80, cy = 75;
    const startX = cx - r, endX = cx + r;

    // Arc path calculation
    const arcX = cx + r * Math.cos(Math.PI * (1 - pct));
    const arcY = cy - r * Math.sin(Math.PI * pct);

    container.innerHTML = `
      <svg width="160" height="90" viewBox="0 0 160 90">
        <path d="M ${startX} ${cy} A ${r} ${r} 0 0 1 ${endX} ${cy}"
          fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="12" stroke-linecap="round"/>
        <path d="M ${startX} ${cy} A ${r} ${r} 0 0 1 ${arcX} ${arcY}"
          fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"
          style="filter:drop-shadow(0 0 6px ${color})"/>
        <text x="${cx}" y="${cy - 10}" text-anchor="middle" font-size="20" font-weight="800" fill="${color}" font-family="Outfit">${value}%</text>
        <text x="${cx}" y="${cy + 8}" text-anchor="middle" font-size="9" fill="rgba(148,163,184,0.8)" font-family="Inter">${label}</text>
      </svg>`;
  },

  // ── Sparkline ────────────────────────────
  sparkline(container, values, color = '#3b82f6') {
    const w = 80, h = 28;
    const max = Math.max(...values), min = Math.min(...values);
    const range = max - min || 1;
    const step = w / (values.length - 1);
    const pts = values.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(' ');
    container.innerHTML = `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  },
};

/* =============================================
   SAARTHI AI – Utility Functions
   ============================================= */

const Utils = {
  formatCurrency: (n) => SaarthiData.formatCurrency(n),
  formatDate: (s) => SaarthiData.formatDate(s),

  animateCount(el, target, duration = 1200, prefix = '', suffix = '') {
    const start = 0;
    const startTime = performance.now();
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  },

  getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  },

  relativeTime(isoStr) {
    const diff = Date.now() - new Date(isoStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  },

  // Render score gauge inline
  renderMiniGauge(score, label, size = 80) {
    const r = size * 0.37, cx = size / 2, cy = size / 2;
    const circ = 2 * Math.PI * r;
    const color = SaarthiData.getScoreColor(score);
    const pct = score / 100;
    return `
      <div style="position:relative;width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="6"/>
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"
            stroke-dasharray="${circ * pct} ${circ}" style="filter:drop-shadow(0 0 4px ${color})"/>
        </svg>
        <div style="position:absolute;text-align:center;">
          <div style="font-family:Outfit;font-weight:800;font-size:${size/4.5}px;color:${color};line-height:1">${score}</div>
          <div style="font-size:${size/9}px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">${label}</div>
        </div>
      </div>`;
  },
};
