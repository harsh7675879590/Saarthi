/* =============================================
   SAARTHI AI – Main Application Controller
   ============================================= */

const App = {
  currentRole: null,
  currentView: null,
  activeCaseId: null,
  demoRunning: false,
  notifCount: 3,

  // ── Init ───────────────────────────────────
  init() {
    Notifications.init();
    this.render();
    window.addEventListener('hashchange', () => this.handleRoute());
  },

  // ── Initial Render: Landing ───────────────
  render() {
    document.getElementById('app').innerHTML = this.buildLanding();
    this.bindLandingEvents();
  },

  // ── Route Handler ─────────────────────────
  handleRoute() {
    const hash = location.hash.replace('#', '') || 'dashboard';
    this.navigateTo(hash);
  },

  // ── Login as Role ─────────────────────────
  loginAs(roleId) {
    this.currentRole = SaarthiData.roles[roleId];
    SaarthiData.currentUser = this.currentRole;
    this.activeCaseId = SaarthiData.getDemoCase()?.id || SaarthiData.cases[0]?.id;
    this.buildDashboardShell();
    const defaultView = roleId === 'applicant' ? 'apply' : 'cases';
    this.navigateTo(defaultView);
    Notifications.success('Welcome back!', `Logged in as ${this.currentRole.name} – ${this.currentRole.title}`, 3000);
  },

  // ── Navigate to View ──────────────────────
  navigateTo(view) {
    this.currentView = view;

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === view);
    });

    // Update header title
    const titles = {
      cases: { title: 'Case Queue', sub: 'Manage and review loan applications' },
      apply: { title: 'Apply for Loan', sub: 'Submit your MSME loan application' },
      track: { title: 'Track Application', sub: 'Monitor your application status' },
      adk: { title: 'ADK Orchestration', sub: 'Live agent execution visualization' },
      risk: { title: 'Risk Dashboard', sub: 'Fraud alerts and escalation management' },
      admin: { title: 'Admin Dashboard', sub: 'Platform metrics and agent performance' },
      notifications: { title: 'Notifications', sub: 'Recent alerts and communications' },
    };
    const t = titles[view] || { title: 'Saarthi AI', sub: '' };
    const el = document.getElementById('header-title');
    if (el) el.innerHTML = `${t.title} <span class="header-subtitle">— ${t.sub}</span>`;

    // Render content
    const main = document.getElementById('main-content');
    if (!main) return;
    main.innerHTML = '';
    main.classList.add('page-enter');
    setTimeout(() => main.classList.remove('page-enter'), 400);

    switch (view) {
      case 'cases': main.innerHTML = this.buildCasesView(); this.bindCasesEvents(); break;
      case 'apply': main.innerHTML = this.buildApplyView(); this.bindApplyEvents(); break;
      case 'track': main.innerHTML = this.buildTrackView(); break;
      case 'adk': main.innerHTML = this.buildADKView(); this.bindADKEvents(); break;
      case 'risk': main.innerHTML = this.buildRiskView(); break;
      case 'admin': main.innerHTML = this.buildAdminView(); this.bindAdminEvents(); break;
      case 'notifications': main.innerHTML = this.buildNotifView(); break;
      default: main.innerHTML = this.buildCasesView(); this.bindCasesEvents();
    }
  },

  // ═══════════════════════════════════════════
  //  LANDING PAGE
  // ═══════════════════════════════════════════
  buildLanding() {
    const slides = SaarthiData.heroSlides;
    const services = SaarthiData.services;
    const testimonials = SaarthiData.testimonials;
    const blogs = SaarthiData.blogPosts;
    const steps = SaarthiData.processSteps;

    return `
    <div id="view-landing">

      <!-- ═══ TOPBAR ═══ -->
      <div class="pylon-topbar">
        <div class="container">
          <div class="pylon-topbar__left">
            <div class="pylon-topbar__social">
              <a href="#"><i class="fab fa-facebook-square"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-pinterest-p"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
            </div>
            <a href="#" onclick="event.preventDefault();App.loginAs('officer')">Login</a>
            <a href="#news-section">Company News</a>
            <a href="#faq-section">FAQs</a>
          </div>
          <div class="pylon-topbar__right">
            <a href="mailto:needhelp@saarthai.ai"><i class="fa-solid fa-envelope"></i> needhelp@saarthai.ai</a>
            <a href="#"><i class="fa-regular fa-clock"></i> Mon - Sat 8:00 AM - 6:00 PM</a>
          </div>
        </div>
      </div>

      <!-- ═══ NAVBAR ═══ -->
      <nav class="pylon-navbar" id="pylon-navbar">
        <div class="container">
          <div class="pylon-navbar__logo">
            <div class="pylon-navbar__logo-icon">🏦</div>
            <div class="pylon-navbar__logo-text">SAARTHI AI</div>
          </div>

          <ul class="pylon-navbar__menu" id="pylon-menu">
            <li class="active">
              <a href="#hero-section">Home</a>
            </li>
            <li>
              <a href="#about-section">About Us</a>
            </li>
            <li>
              <a href="#services-section">Service <i class="fa-solid fa-chevron-down" style="font-size:0.6rem;margin-left:3px"></i></a>
              <ul>
                <li><a href="#services-section">All Services</a></li>
                <li><a href="#" onclick="event.preventDefault();App.loginAs('applicant')">Apply Now</a></li>
                <li><a href="#calculator-section">Loan Calculator</a></li>
              </ul>
            </li>
            <li>
              <a href="#" onclick="event.preventDefault();App.loginAs('officer')">Page <i class="fa-solid fa-chevron-down" style="font-size:0.6rem;margin-left:3px"></i></a>
              <ul>
                <li><a href="#" onclick="event.preventDefault();App.loginAs('officer')">Dashboard</a></li>
                <li><a href="#" onclick="event.preventDefault();App.loginAs('admin')">Admin Panel</a></li>
                <li><a href="#" onclick="event.preventDefault();App.loginAs('risk')">Risk Dashboard</a></li>
              </ul>
            </li>
            <li>
              <a href="#news-section">News</a>
            </li>
            <li>
              <a href="#contact-section">Contact Us</a>
            </li>
            <li class="search-btn" style="cursor:pointer">
              <a href="#"><i class="fa-solid fa-magnifying-glass"></i></a>
            </li>
          </ul>

          <div class="pylon-navbar__phone">
            <div class="pylon-navbar__phone-icon"><i class="fa-solid fa-headset"></i></div>
            <div>
              <div class="pylon-navbar__phone-label">Call Anytime</div>
              <div class="pylon-navbar__phone-number"><a href="tel:+19812310000" style="color:inherit">+1 9812310000</a></div>
            </div>
          </div>

          <button class="pylon-navbar__mobile-toggle" onclick="document.getElementById('pylon-menu').classList.toggle('open')">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav>

      <!-- ═══ HERO SLIDER ═══ -->
      <section class="pylon-hero" id="hero-section">
        ${slides.map((s, i) => `
        <div class="pylon-hero__slide ${i === 0 ? 'active' : ''}" style="background-image:url('${s.image}')" data-slide="${i}">
          <div class="pylon-hero__content">
            <div class="pylon-hero__subtitle">${s.subtitle}</div>
            <h1 class="pylon-hero__title">${s.title.replace(/\n/g, '<br>')}</h1>
            <button class="pylon-hero__btn" onclick="App.loginAs('applicant')">
              ${s.btn} <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>`).join('')}

        <div class="pylon-hero__nav">
          <button onclick="App.heroSlide(-1)"><i class="fa-solid fa-arrow-left"></i></button>
          <button onclick="App.heroSlide(1)"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </section>

      <!-- ═══ FEATURE BADGES ═══ -->
      <section class="pylon-features">
        <div class="container">
          <div class="pylon-features__grid">
            <div class="pylon-features__item">
              <div class="pylon-features__icon"><i class="fa-solid fa-bolt"></i></div>
              <div class="pylon-features__text">
                <h4>Quick AI Processing</h4>
                <p>4.2 min average loan processing powered by 10 AI agents</p>
              </div>
            </div>
            <div class="pylon-features__item">
              <div class="pylon-features__icon"><i class="fa-solid fa-shield-halved"></i></div>
              <div class="pylon-features__text">
                <h4>Fraud Protection</h4>
                <p>Advanced AI fraud detection with 99.4% accuracy rate</p>
              </div>
            </div>
            <div class="pylon-features__item">
              <div class="pylon-features__icon"><i class="fa-solid fa-robot"></i></div>
              <div class="pylon-features__text">
                <h4>10 Agent Analysis</h4>
                <p>Parallel AI agents analyze every aspect simultaneously</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ SERVICES ═══ -->
      <section class="pylon-section" id="services-section">
        <div class="container">
          <div class="text-center" style="margin-bottom:50px">
            <div class="pylon-section__tag" style="justify-content:center">What We're Offering</div>
            <h2 class="pylon-section__title">All Loans Services</h2>
          </div>
          <div class="pylon-services__grid">
            ${services.map(s => `
            <div class="pylon-service-card reveal-on-scroll">
              <div class="pylon-service-card__image">
                <img src="${s.image}" alt="${s.name}" loading="lazy" />
                <div class="pylon-service-card__icon"><i class="${s.icon}"></i></div>
              </div>
              <div class="pylon-service-card__body">
                <h3>${s.name}</h3>
                <p>${s.desc}</p>
                <a href="#" class="pylon-service-card__link" onclick="event.preventDefault();App.loginAs('applicant')">
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- ═══ ABOUT + CALCULATOR ═══ -->
      <section class="pylon-section pylon-section--gray" id="about-section">
        <div class="container">
          <div class="pylon-about__grid">
            <div class="reveal-left">
              <div class="pylon-section__tag">Who We Are</div>
              <h2 class="pylon-section__title">Trust Us For Fast Services</h2>
              <div style="margin-top:16px">
                <img src="assets/images/service-education.png" alt="About Saarthi AI" style="width:100%;border-radius:12px;box-shadow:var(--shadow-lg);max-height:300px;object-fit:cover" />
              </div>
              <p style="margin-top:20px;line-height:1.8">
                Saarthi AI is an enterprise-grade agentic AI platform that revolutionizes MSME loan underwriting. 
                Built on Google Agent Development Kit (ADK) and UiPath Maestro, our 10 specialized AI agents 
                work in parallel to analyze applications, detect fraud, verify compliance, and deliver lending decisions 
                in minutes instead of days.
              </p>
              <div class="pylon-checklist">
                <div class="pylon-checklist__item"><i class="fa-solid fa-circle-check"></i> Working Capital Loans</div>
                <div class="pylon-checklist__item"><i class="fa-solid fa-circle-check"></i> Gold Loan Per Day</div>
                <div class="pylon-checklist__item"><i class="fa-solid fa-circle-check"></i> Personal Loan</div>
                <div class="pylon-checklist__item"><i class="fa-solid fa-circle-check"></i> Mortgage Loan</div>
                <div class="pylon-checklist__item"><i class="fa-solid fa-circle-check"></i> MSME / Business Loan</div>
                <div class="pylon-checklist__item"><i class="fa-solid fa-circle-check"></i> Education / Student Loan</div>
                <div class="pylon-checklist__item"><i class="fa-solid fa-circle-check"></i> Equipment Loan</div>
                <div class="pylon-checklist__item"><i class="fa-solid fa-circle-check"></i> Term Loan</div>
              </div>
            </div>
            <div class="reveal-right" id="calculator-section">
              <div class="pylon-calculator">
                <div class="pylon-calculator__title">💰 Loan Calculator</div>
                <div class="pylon-calc-group">
                  <label>Loan Amount <span id="calc-amount-val">₹25,00,000</span></label>
                  <input type="range" class="pylon-calc-slider" id="calc-amount" min="100000" max="10000000" step="50000" value="2500000" oninput="App.updateCalc()" />
                </div>
                <div class="pylon-calc-group">
                  <label>Tenure (Months) <span id="calc-months-val">12</span></label>
                  <input type="range" class="pylon-calc-slider" id="calc-months" min="3" max="60" step="1" value="12" oninput="App.updateCalc()" />
                </div>
                <div class="pylon-calc-group">
                  <label>Interest Rate <span id="calc-rate-val">13.5%</span></label>
                  <input type="range" class="pylon-calc-slider" id="calc-rate" min="5" max="24" step="0.5" value="13.5" oninput="App.updateCalc()" />
                </div>
                <div class="pylon-calc-result">
                  <div class="pylon-calc-result__label">Monthly EMI</div>
                  <div class="pylon-calc-result__value" id="calc-emi">₹2,24,384</div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px">
                  <div class="pylon-calc-result" style="padding:14px">
                    <div class="pylon-calc-result__label">Total Interest</div>
                    <div class="pylon-calc-result__value" style="font-size:1.4rem" id="calc-interest">₹1,92,614</div>
                  </div>
                  <div class="pylon-calc-result" style="padding:14px">
                    <div class="pylon-calc-result__label">Total Payment</div>
                    <div class="pylon-calc-result__value" style="font-size:1.4rem" id="calc-total">₹26,92,614</div>
                  </div>
                </div>
                <button class="btn btn-accent w-full" style="margin-top:20px" onclick="App.loginAs('applicant')">
                  Apply For This Loan <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ WHY CHOOSE US + PROCESS STEPS ═══ -->
      <section class="pylon-section pylon-section--dark" id="why-section">
        <div class="container">
          <div class="pylon-why__grid">
            <div class="reveal-left">
              <div class="pylon-section__tag" style="color:rgba(255,255,255,0.7)">Why Choose Us</div>
              <h2 class="pylon-section__title" style="color:#fff">Trust Us For Fast Services</h2>
              <p style="color:rgba(255,255,255,0.7);margin-bottom:20px;line-height:1.8">
                Our AI-powered platform combines the power of Google's Agent Development Kit with 
                10 specialized underwriting agents that work in parallel to deliver instant, accurate 
                lending decisions. Human oversight is maintained at every critical juncture.
              </p>
              <div style="margin-top:16px">
                <img src="assets/images/service-business.png" alt="Why Saarthi" style="width:100%;border-radius:12px;max-height:280px;object-fit:cover;opacity:0.8" />
              </div>
              <div class="pylon-checklist" style="margin-top:20px">
                <div class="pylon-checklist__item" style="color:rgba(255,255,255,0.7)"><i class="fa-solid fa-circle-check"></i> Working Capital Loans</div>
                <div class="pylon-checklist__item" style="color:rgba(255,255,255,0.7)"><i class="fa-solid fa-circle-check"></i> Gold Loan Per Day</div>
                <div class="pylon-checklist__item" style="color:rgba(255,255,255,0.7)"><i class="fa-solid fa-circle-check"></i> Personal Loan</div>
                <div class="pylon-checklist__item" style="color:rgba(255,255,255,0.7)"><i class="fa-solid fa-circle-check"></i> Mortgage Loan</div>
                <div class="pylon-checklist__item" style="color:rgba(255,255,255,0.7)"><i class="fa-solid fa-circle-check"></i> MSME / Business Loan</div>
                <div class="pylon-checklist__item" style="color:rgba(255,255,255,0.7)"><i class="fa-solid fa-circle-check"></i> Education / Student Loan</div>
                <div class="pylon-checklist__item" style="color:rgba(255,255,255,0.7)"><i class="fa-solid fa-circle-check"></i> Equipment Loan</div>
                <div class="pylon-checklist__item" style="color:rgba(255,255,255,0.7)"><i class="fa-solid fa-circle-check"></i> Term Loan</div>
              </div>
            </div>
            <div class="reveal-right">
              ${steps.map(s => `
              <div class="pylon-step">
                <div class="pylon-step__num">${s.num}</div>
                <div class="pylon-step__text">${s.text}</div>
              </div>`).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ TESTIMONIALS ═══ -->
      <section class="pylon-section pylon-section--gray" id="testimonials-section">
        <div class="container">
          <div class="text-center" style="margin-bottom:50px">
            <div class="pylon-section__tag" style="justify-content:center">Customers Testimonials</div>
            <h2 class="pylon-section__title">Customers Testimonials</h2>
          </div>
          <div class="pylon-testimonials__grid">
            ${testimonials.map(t => `
            <div class="pylon-testimonial-card reveal-on-scroll">
              <div class="pylon-testimonial-card__quote">"</div>
              <div class="pylon-testimonial-card__stars">★★★★★</div>
              <div class="pylon-testimonial-card__text">"${t.text}"</div>
              <div class="pylon-testimonial-card__author">
                <div class="pylon-testimonial-card__avatar">${t.initials}</div>
                <div>
                  <div class="pylon-testimonial-card__name">${t.name}</div>
                  <div class="pylon-testimonial-card__role">${t.role}</div>
                </div>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- ═══ PARTNERS ROW ═══ -->
      <section class="pylon-section" style="padding:30px 0">
        <div class="container">
          <div class="pylon-partners">
            <div class="pylon-partners__item">Google ADK</div>
            <div class="pylon-partners__item">UiPath</div>
            <div class="pylon-partners__item">Gemini AI</div>
            <div class="pylon-partners__item">Maestro</div>
            <div class="pylon-partners__item">CIBIL</div>
          </div>
        </div>
      </section>

      <!-- ═══ CTA BANNER ═══ -->
      <section class="pylon-cta" style="background-image:url('assets/images/hero-bg.png');background-blend-mode:overlay">
        <div class="container">
          <div>
            <div class="pylon-cta__label">Simple / Transparent / Secure</div>
            <h2 class="pylon-cta__title">Get a Business Loans Quickly</h2>
          </div>
          <button class="pylon-hero__btn" onclick="App.loginAs('applicant')">
            Apply For Loan <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </section>

      <!-- ═══ BLOG / NEWS ═══ -->
      <section class="pylon-section" id="news-section">
        <div class="container">
          <div class="text-center" style="margin-bottom:50px">
            <div class="pylon-section__tag" style="justify-content:center">News & Articles</div>
            <h2 class="pylon-section__title">Latest News & Articles</h2>
          </div>
          <div class="pylon-blog__grid">
            ${blogs.map(b => `
            <div class="pylon-blog-card reveal-on-scroll">
              <div class="pylon-blog-card__image">
                <img src="${b.image}" alt="${b.title}" loading="lazy" />
              </div>
              <div class="pylon-blog-card__body">
                <div class="pylon-blog-card__meta">
                  <span><i class="fa-regular fa-calendar"></i> ${b.date}</span>
                  <span><i class="fa-regular fa-user"></i> ${b.author}</span>
                  <span><i class="fa-regular fa-comment"></i> ${b.comments} Comments</span>
                </div>
                <h3 class="pylon-blog-card__title">${b.title}</h3>
                <a href="#" class="pylon-blog-card__link" onclick="event.preventDefault()">
                  Read More <i class="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </section>

      <!-- ═══ COUNTERS ═══ -->
      <section class="pylon-section pylon-section--gray">
        <div class="container">
          <div class="pylon-counters" id="counters-section">
            <div class="pylon-counter reveal-on-scroll">
              <div class="pylon-counter__value" data-count="1247">0</div>
              <div class="pylon-counter__label">Applications Processed</div>
            </div>
            <div class="pylon-counter reveal-on-scroll">
              <div class="pylon-counter__value" data-count="97">0</div>
              <div class="pylon-counter__label">Agent Success Rate %</div>
            </div>
            <div class="pylon-counter reveal-on-scroll">
              <div class="pylon-counter__value" data-count="78">0</div>
              <div class="pylon-counter__label">Manual Effort Reduced %</div>
            </div>
            <div class="pylon-counter reveal-on-scroll">
              <div class="pylon-counter__value" data-count="10">0</div>
              <div class="pylon-counter__label">Specialized AI Agents</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ FOOTER ═══ -->
      <footer class="pylon-footer" id="contact-section">
        <div class="container">
          <div class="pylon-footer__grid">
            <div class="pylon-footer__brand">
              <h3>🏦 SAARTHI AI</h3>
              <p>Saarthi AI is an enterprise-grade agentic AI platform for MSME loan underwriting using Google ADK multi-agent orchestration and UiPath Maestro case management.</p>
              <div class="pylon-footer__social">
                <a href="#"><i class="fab fa-facebook-f"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-linkedin-in"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
              </div>
            </div>
            <div class="pylon-footer__col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#about-section"><i class="fa-solid fa-angle-right"></i> About Us</a></li>
                <li><a href="#services-section"><i class="fa-solid fa-angle-right"></i> Services</a></li>
                <li><a href="#calculator-section"><i class="fa-solid fa-angle-right"></i> Loan Calculator</a></li>
                <li><a href="#" onclick="event.preventDefault();App.loginAs('applicant')"><i class="fa-solid fa-angle-right"></i> Apply Now</a></li>
                <li><a href="#news-section"><i class="fa-solid fa-angle-right"></i> News</a></li>
              </ul>
            </div>
            <div class="pylon-footer__col">
              <h4>Loan Types</h4>
              <ul>
                <li><a href="#"><i class="fa-solid fa-angle-right"></i> Personal Loan</a></li>
                <li><a href="#"><i class="fa-solid fa-angle-right"></i> Business Loan</a></li>
                <li><a href="#"><i class="fa-solid fa-angle-right"></i> Education Loan</a></li>
                <li><a href="#"><i class="fa-solid fa-angle-right"></i> Equipment Loan</a></li>
                <li><a href="#"><i class="fa-solid fa-angle-right"></i> Term Loan</a></li>
              </ul>
            </div>
            <div class="pylon-footer__col">
              <h4>Contact Info</h4>
              <ul>
                <li><a href="#"><i class="fa-solid fa-location-dot"></i> Plot 4X, XXXX, Pune 41XXX9</a></li>
                <li><a href="mailto:needhelp@saarthai.ai"><i class="fa-solid fa-envelope"></i> needhelp@saarthai.ai</a></li>
                <li><a href="tel:+19812310000"><i class="fa-solid fa-phone"></i> +1 9812310000</a></li>
                <li><a href="#"><i class="fa-solid fa-clock"></i> Mon-Sat 8:00 AM - 6:00 PM</a></li>
              </ul>
            </div>
          </div>
          <div class="pylon-footer__bottom">
            © ${new Date().getFullYear()} Saarthi AI · Built on Google ADK + UiPath Maestro · UiPath AgentHack 2024 · Track 1: Maestro Case
          </div>
        </div>
      </footer>

    </div>`;
  },

  currentSlide: 0,
  slideInterval: null,

  heroSlide(dir) {
    const slides = document.querySelectorAll('.pylon-hero__slide');
    if (!slides.length) return;
    slides[this.currentSlide].classList.remove('active');
    this.currentSlide = (this.currentSlide + dir + slides.length) % slides.length;
    slides[this.currentSlide].classList.add('active');

    // Reset auto-slide timer if manual interaction occurred
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = setInterval(() => this.heroSlide(1), 5000);
    }
  },

  updateCalc() {
    const amountInput = document.getElementById('calc-amount');
    const monthsInput = document.getElementById('calc-months');
    const rateInput = document.getElementById('calc-rate');

    if (!amountInput || !monthsInput || !rateInput) return;

    const principal = parseFloat(amountInput.value);
    const months = parseInt(monthsInput.value);
    const annualRate = parseFloat(rateInput.value);

    // Update labels
    const amountValEl = document.getElementById('calc-amount-val');
    const monthsValEl = document.getElementById('calc-months-val');
    const rateValEl = document.getElementById('calc-rate-val');

    if (amountValEl) amountValEl.textContent = SaarthiData.formatCurrency(principal);
    if (monthsValEl) monthsValEl.textContent = months;
    if (rateValEl) rateValEl.textContent = annualRate + '%';

    // Calculate EMI: P * r * (1+r)^n / ((1+r)^n - 1)
    const monthlyRate = annualRate / 12 / 100;
    let emi = 0;
    if (monthlyRate === 0) {
      emi = principal / months;
    } else {
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    // Update display values
    const emiEl = document.getElementById('calc-emi');
    const interestEl = document.getElementById('calc-interest');
    const totalEl = document.getElementById('calc-total');

    if (emiEl) emiEl.textContent = SaarthiData.formatCurrency(Math.round(emi));
    if (interestEl) interestEl.textContent = SaarthiData.formatCurrency(Math.round(totalInterest));
    if (totalEl) totalEl.textContent = SaarthiData.formatCurrency(Math.round(totalPayment));
  },

  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right').forEach(el => {
      observer.observe(el);
    });
  },

  initStickyNavbar() {
    const navbar = document.getElementById('pylon-navbar');
    if (!navbar) return;
    const sticky = navbar.offsetTop;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > sticky + 50) {
        navbar.classList.add('sticky');
      } else {
        navbar.classList.remove('sticky');
      }

      // Scroll to Top Button Visibility
      const scrollTopBtn = document.getElementById('scroll-top-btn');
      if (scrollTopBtn) {
        if (window.pageYOffset > 300) {
          scrollTopBtn.classList.add('show');
        } else {
          scrollTopBtn.classList.remove('show');
        }
      }
    });
  },

  initCountersObserver() {
    const counters = document.querySelectorAll('.pylon-counter__value');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          if (!isNaN(target)) {
            Utils.animateCount(el, target);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(c => observer.observe(c));
  },

  bindLandingEvents() {
    // Slider auto-rotation
    this.currentSlide = 0;
    if (this.slideInterval) clearInterval(this.slideInterval);
    this.slideInterval = setInterval(() => {
      this.heroSlide(1);
    }, 5000);

    // Initialize Calculator
    this.updateCalc();

    // Scroll reveal animations
    this.initScrollReveal();

    // Sticky Navbar
    this.initStickyNavbar();

    // Counters animation trigger
    this.initCountersObserver();
  },

  // ═══════════════════════════════════════════
  //  DASHBOARD SHELL
  // ═══════════════════════════════════════════
  buildDashboardShell() {
    const role = this.currentRole;
    const isApplicant = role.id === 'applicant';

    const navItems = isApplicant ? [
      { view: 'apply', icon: '📝', label: 'Apply for Loan' },
      { view: 'track', icon: '📍', label: 'Track Status' },
      { view: 'notifications', icon: '🔔', label: 'Notifications', badge: 2 },
    ] : role.id === 'risk' ? [
      { view: 'risk', icon: '🛡️', label: 'Risk Dashboard' },
      { view: 'cases', icon: '📁', label: 'All Cases' },
      { view: 'adk', icon: '🤖', label: 'ADK Orchestration' },
      { view: 'notifications', icon: '🔔', label: 'Alerts', badge: this.notifCount },
    ] : role.id === 'admin' ? [
      { view: 'admin', icon: '⚙️', label: 'Admin Dashboard' },
      { view: 'cases', icon: '📁', label: 'All Cases' },
      { view: 'adk', icon: '🤖', label: 'ADK Orchestration' },
      { view: 'notifications', icon: '🔔', label: 'Notifications' },
    ] : [
      { view: 'cases', icon: '📁', label: 'Case Queue', badge: 4 },
      { view: 'adk', icon: '🤖', label: 'ADK Orchestration' },
      { view: 'risk', icon: '🛡️', label: 'Risk Alerts' },
      { view: 'notifications', icon: '🔔', label: 'Notifications', badge: 2 },
    ];

    document.getElementById('app').innerHTML = `
    <div class="app-layout" id="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-logo">
          <div class="sidebar-logo-icon">🏦</div>
          <div>
            <div class="sidebar-logo-text">SAARTHI AI</div>
            <div class="sidebar-logo-tagline">Intelligent Lending</div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section-label">Navigation</div>
          ${navItems.map(item => `
            <div class="nav-item" data-view="${item.view}" onclick="App.navigateTo('${item.view}')">
              <span class="nav-item-icon">${item.icon}</span>
              <span>${item.label}</span>
              ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
            </div>`).join('')}

          ${!isApplicant ? `
          <div class="nav-section-label" style="margin-top:12px">Quick Access</div>
          <div class="nav-item" onclick="App.runDemo()">
            <span class="nav-item-icon">▶️</span>
            <span>Run Demo</span>
          </div>` : ''}
        </nav>

        <div class="sidebar-footer">
          <div class="user-pill" onclick="App.logout()">
            <div class="user-avatar avatar-${role.id}" style="background:${role.color}15;border:1px solid ${role.color}40;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px">${role.emoji}</div>
            <div class="user-info">
              <div class="user-name">${role.name}</div>
              <div class="user-role">${role.title}</div>
            </div>
            <span style="font-size:12px;color:var(--text-muted)">⏏</span>
          </div>
        </div>
      </aside>

      <!-- Header -->
      <header class="app-header">
        <button class="btn btn-ghost btn-icon" onclick="App.toggleSidebar()" title="Toggle Sidebar">☰</button>
        <div class="flex-1">
          <div class="header-title" id="header-title">Saarthi AI</div>
        </div>
        <div class="header-actions">
          <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);padding:4px 12px;border-radius:999px;font-size:0.7rem;font-weight:700;color:#fbbf24">
            🤖 ADK Powered
          </div>
          <div class="notif-btn" onclick="App.navigateTo('notifications')">
            🔔
            <span class="notif-badge" id="notif-badge">${this.notifCount}</span>
          </div>
          <div style="width:32px;height:32px;background:${role.color}20;border:1px solid ${role.color}40;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer" onclick="App.logout()">${role.emoji}</div>
        </div>
      </header>

      <!-- Main -->
      <main class="app-main" id="main-content"></main>
    </div>`;
  },

  toggleSidebar() {
    document.getElementById('app-layout')?.classList.toggle('sidebar-collapsed');
  },

  logout() {
    this.currentRole = null;
    this.render();
  },

  // ═══════════════════════════════════════════
  //  CASES VIEW (Loan Officer)
  // ═══════════════════════════════════════════
  buildCasesView() {
    const cases = SaarthiData.cases;
    const activeCase = SaarthiData.getCaseById(this.activeCaseId) || cases[0];

    return `
    <div style="display:grid;grid-template-columns:340px 1fr;gap:20px;height:calc(100vh - 140px);min-height:0;">
      <!-- Left: Case List -->
      <div style="display:flex;flex-direction:column;gap:0;overflow:hidden;">
        <div style="margin-bottom:14px;">
          <div class="section-header" style="margin-bottom:12px">
            <div class="section-title">Cases</div>
            <span class="badge badge-warning">${cases.length} Active</span>
          </div>
          <div class="search-bar" style="max-width:100%">
            <span class="search-icon">🔍</span>
            <input type="text" class="search-input" placeholder="Search cases..." oninput="App.filterCases(this.value)">
          </div>
        </div>
        <div style="overflow-y:auto;flex:1;padding-right:4px;" id="case-list">
          ${cases.map(c => this.buildCaseListItem(c, c.id === activeCase.id)).join('')}
        </div>
      </div>

      <!-- Right: Case Detail -->
      <div style="overflow-y:auto;" id="case-detail-panel">
        ${this.buildCaseDetail(activeCase)}
      </div>
    </div>`;
  },

  buildCaseListItem(c, selected) {
    const priorityDot = { high: 'priority-high', medium: 'priority-medium', low: 'priority-low' }[c.priority] || '';
    return `
    <div class="case-card ${selected ? 'selected' : ''}" onclick="App.selectCase('${c.id}')" id="case-item-${c.id}">
      <div class="flex items-center gap-2">
        <div class="priority-dot ${priorityDot}"></div>
        <div style="font-size:0.7rem;color:var(--text-muted);font-family:var(--font-mono)">${c.id}</div>
      </div>
      <div class="case-card-body">
        <div class="case-company">${c.company}</div>
        <div class="case-meta">
          <span class="case-amount">${SaarthiData.formatCurrency(c.loanAmount)}</span>
          <span>${c.loanType}</span>
          <span>${SaarthiData.formatDate(c.createdAt)}</span>
        </div>
      </div>
      <div>
        <span class="badge ${SaarthiData.getStatusBadgeClass(c.status)}" style="font-size:0.65rem">${SaarthiData.getStatusLabel(c.status)}</span>
      </div>
    </div>`;
  },

  buildCaseDetail(c) {
    if (!c) return '<div class="empty-state"><div class="empty-state-icon">📁</div><div class="empty-state-title">Select a case</div></div>';
    const ao = c.agentOutputs || {};
    const cr = ao.credit_recommendation || {};

    return `
    <div class="animate-fadeIn">
      <!-- Case Header -->
      <div class="card" style="margin-bottom:16px;">
        <div class="flex items-center gap-4 mb-4">
          <div style="width:52px;height:52px;background:linear-gradient(135deg,var(--color-primary-600),var(--color-primary-500));border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;">🏭</div>
          <div class="flex-1">
            <h3 style="margin-bottom:4px;">${c.company}</h3>
            <div style="display:flex;gap:10px;flex-wrap:wrap;font-size:0.75rem;color:var(--text-muted)">
              <span>📋 ${c.id}</span>
              <span>📍 ${c.location || 'N/A'}</span>
              <span>🏭 ${c.industry || 'N/A'}</span>
              <span>📅 ${c.businessVintage || 'N/A'}</span>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:Outfit;font-size:1.5rem;font-weight:800;color:var(--color-accent-400)">${SaarthiData.formatCurrency(c.loanAmount)}</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">${c.loanType}</div>
            <span class="badge ${SaarthiData.getStatusBadgeClass(c.status)}" style="margin-top:4px;display:inline-block">${SaarthiData.getStatusLabel(c.status)}</span>
          </div>
        </div>

        <!-- Phase Progress -->
        <div class="phase-progress" id="phase-progress">
          ${this.buildPhaseProgress(c.status)}
        </div>
      </div>

      <!-- Underwriting Verification Report (Tabs) -->
      <div class="section-header">
        <div class="section-title">🛡️ Underwriting Verification Report</div>
        <button class="btn btn-ghost btn-sm" onclick="App.runAgentDemo('${c.id}')">▶ Re-run AI Analysis</button>
      </div>

      <div class="card" style="padding:20px;margin-bottom:16px;">
        <!-- Tab Bar -->
        <div class="pillar-tabs">
          <button class="pillar-tab active" id="tab-btn-kyc" onclick="App.setDetailTab('kyc')">
            📋 Identity & Docs
            <span class="pillar-tab-badge ${c.documents?.gst_returns?.missing ? 'warning' : 'success'}">
              ${c.documents?.gst_returns?.missing ? '⚠️ Exception' : 'Verified'}
            </span>
          </button>
          <button class="pillar-tab" id="tab-btn-financials" onclick="App.setDetailTab('financials')">
            📊 Financials & Cashflow
            <span class="pillar-tab-badge success" id="tab-badge-fin-score" style="color:var(--color-primary-500);background:var(--color-primary-100)">
              ${ao.financial?.score || 72}/100
            </span>
          </button>
          <button class="pillar-tab" id="tab-btn-risk" onclick="App.setDetailTab('risk')">
            🛡️ Risk & Compliance
            <span class="pillar-tab-badge success" id="tab-badge-fraud" style="color:var(--color-success);background:rgba(16,185,129,0.1)">
              Score: ${ao.fraud_detection?.score || 18}
            </span>
          </button>
          <button class="pillar-tab" id="tab-btn-ops" onclick="App.setDetailTab('ops')">
            📧 Ops & Comms
          </button>
        </div>

        <!-- Pillar Pane 1: Identity & Docs -->
        <div class="pillar-pane active" id="pane-kyc">
          ${this.buildPillarKYC(c)}
        </div>

        <!-- Pillar Pane 2: Financials & Cashflow -->
        <div class="pillar-pane" id="pane-financials">
          ${this.buildPillarFinancials(c)}
        </div>

        <!-- Pillar Pane 3: Risk & Compliance -->
        <div class="pillar-pane" id="pane-risk">
          ${this.buildPillarRisk(c)}
        </div>

        <!-- Pillar Pane 4: Ops & Comms -->
        <div class="pillar-pane" id="pane-ops">
          ${this.buildPillarOps(c)}
        </div>
      </div>

      <!-- Human Review Panel (if applicable) -->
      ${(c.status === 'human_review' || c.status === 'clarification' || c.status === 'escalated') ? this.buildReviewPanel(c) : ''}

      <!-- Timeline -->
      <div class="card mt-4" style="margin-top:16px">
        <div class="section-title mb-4">📅 Case Timeline</div>
        <div class="timeline">
          ${(c.timeline || []).map(t => `
          <div class="timeline-item">
            <div class="timeline-dot ${t.type}"></div>
            <div class="timeline-time">${t.time}</div>
            <div class="timeline-title">${t.action}</div>
            <div class="timeline-desc">${t.actor}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
  },

  setDetailTab(tabId) {
    document.querySelectorAll('.pillar-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.pillar-pane').forEach(pane => pane.classList.remove('active'));

    const activeBtn = document.getElementById(`tab-btn-${tabId}`);
    const activePane = document.getElementById(`pane-${tabId}`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activePane) activePane.classList.add('active');
  },

  buildPillarKYC(c) {
    const ao = c.agentOutputs || {};
    const docIntel = ao.doc_intelligence || {};
    const completeness = ao.intake?.completeness || (c.documents ? Math.round(Object.values(c.documents).filter(d => d.uploaded).length / Object.keys(c.documents).length * 100) : 87);
    const confidence = docIntel.confidence || 94;
    const profile = docIntel.profile || {
      name: c.applicant || 'N/A',
      pan: c.pan || 'N/A',
      gstin: c.gstin || 'N/A',
      businessName: c.company || 'N/A'
    };

    const docs = c.documents || {
      pan: { uploaded: true, verified: true },
      aadhaar: { uploaded: true, verified: true },
      gst_certificate: { uploaded: true, verified: true },
      bank_statements: { uploaded: true, verified: true },
      itr_3years: { uploaded: true, verified: true },
      balance_sheet: { uploaded: true, verified: true },
      gst_returns: { uploaded: c.status !== 'clarification' && c.status !== 'human_review', verified: c.status !== 'clarification' && c.status !== 'human_review' }
    };

    return `
    <div class="metric-widget-grid">
      <div class="metric-widget">
        <div class="metric-widget-label">Document Completeness</div>
        <div class="metric-widget-value" id="kyc-completeness-val">${completeness}%</div>
        <div class="metric-widget-desc">Percentage of mandatory files received</div>
      </div>
      <div class="metric-widget">
        <div class="metric-widget-label">OCR Confidence Level</div>
        <div class="metric-widget-value" id="kyc-confidence-val">${confidence}%</div>
        <div class="metric-widget-desc">Average text extraction confidence</div>
      </div>
      <div class="metric-widget">
        <div class="metric-widget-label">KYC Profile Match</div>
        <div class="metric-widget-value" style="color:var(--color-success)">PASS</div>
        <div class="metric-widget-desc">PAN ↔ Aadhaar ↔ GST cross-matches match</div>
      </div>
    </div>

    <div class="verification-card-grid">
      <div class="verification-list">
        <div class="verification-list-title">👤 Extracted Profile Details</div>
        <div class="verification-item">
          <div class="verification-label">Director / Applicant</div>
          <div style="font-weight:600;font-size:0.8rem;">${profile.name || c.applicant}</div>
        </div>
        <div class="verification-item">
          <div class="verification-label">Permanent Account Number (PAN)</div>
          <div style="font-weight:600;font-size:0.8rem;font-family:var(--font-mono)">${profile.pan || c.pan || 'N/A'}</div>
        </div>
        <div class="verification-item">
          <div class="verification-label">GSTIN ID</div>
          <div style="font-weight:600;font-size:0.8rem;font-family:var(--font-mono)">${profile.gstin || c.gstin || 'N/A'}</div>
        </div>
        <div class="verification-item">
          <div class="verification-label">Registered Business Name</div>
          <div style="font-weight:600;font-size:0.8rem;">${profile.businessName || c.company}</div>
        </div>
      </div>

      <div class="verification-list">
        <div class="verification-list-title">📎 Document Verification Status</div>
        <div id="kyc-document-list" style="display:flex;flex-direction:column;gap:1px">
          ${Object.entries(docs).map(([key, val]) => {
      const label = key.toUpperCase().replace('_', ' ');
      const isOk = val.uploaded && val.verified;
      const statusClass = isOk ? 'pass' : (val.missing ? 'warning' : 'fail');
      const statusText = isOk ? 'Verified' : (val.missing ? 'Missing' : 'Pending');
      return `
            <div class="verification-item">
              <div class="verification-label">${label}</div>
              <span class="verification-status ${statusClass}">${statusText}</span>
            </div>`;
    }).join('')}
        </div>
      </div>
    </div>`;
  },

  buildPillarFinancials(c) {
    const ao = c.agentOutputs || {};
    const fin = ao.financial || {};
    const bank = ao.bank_statement || {};
    const gst = ao.gst || {};

    const metrics = fin.metrics || {
      dscr: 1.42,
      net_profit_margin: 8.4,
      yoy_growth: 21.7,
      current_ratio: 1.68
    };

    const bankMetrics = bank.metrics || {
      avg_monthly_balance: 1245000,
      bounce_count: 1
    };

    const score = fin.score || 72;
    const bankScore = bank.score || 81;
    const gstScore = gst.score || 61;

    // Reconciliation numbers
    const revenue_gst = gst.turnovers?.fy24_gst || (c.loanAmount * 7.1);
    const revenue_itr = gst.turnovers?.fy24_itr || (c.loanAmount * 7.4);
    const bank_inflows = bankMetrics.total_credits_annual || (c.loanAmount * 8.1);

    const maxVal = Math.max(revenue_gst, revenue_itr, bank_inflows);

    return `
    <div class="metric-widget-grid">
      <div class="metric-widget">
        <div class="metric-widget-label">Debt Service Coverage (DSCR)</div>
        <div class="metric-widget-value">${metrics.dscr}x</div>
        <div class="metric-widget-desc">Debt repayment ratio (Target > 1.25x)</div>
      </div>
      <div class="metric-widget">
        <div class="metric-widget-label">Net Profit Margin</div>
        <div class="metric-widget-value">${metrics.net_profit_margin}%</div>
        <div class="metric-widget-desc">Net earnings percentage of sales</div>
      </div>
      <div class="metric-widget">
        <div class="metric-widget-label">Avg Bank Balance</div>
        <div class="metric-widget-value">${SaarthiData.formatCurrency(bankMetrics.avg_monthly_balance)}</div>
        <div class="metric-widget-desc">Average active ledger balance</div>
      </div>
      <div class="metric-widget">
        <div class="metric-widget-label">Bounce Incidence</div>
        <div class="metric-widget-value" style="color:${bankMetrics.bounce_count > 1 ? 'var(--color-danger)' : 'var(--color-success)'}">
          ${bankMetrics.bounce_count} ${bankMetrics.bounce_count === 1 ? 'Bounce' : 'Bounces'}
        </div>
        <div class="metric-widget-desc">Banking return triggers (12 months)</div>
      </div>
    </div>

    <div class="verification-card-grid">
      <div class="verification-list">
        <div class="verification-list-title">📊 Financial Score Summary</div>
        <div class="verification-item">
          <div class="verification-label">Balance Sheet & Income Score</div>
          <div style="font-weight:700;color:${SaarthiData.getScoreColor(score)}">${score}/100</div>
        </div>
        <div class="verification-item">
          <div class="verification-label">Banking Cashflow Score</div>
          <div style="font-weight:700;color:${SaarthiData.getScoreColor(bankScore)}">${bankScore}/100</div>
        </div>
        <div class="verification-item">
          <div class="verification-label">GST Compliance Score</div>
          <div style="font-weight:700;color:${SaarthiData.getScoreColor(gstScore)}">${gstScore}/100</div>
        </div>
        <div class="verification-item">
          <div class="verification-label">Year-over-Year (YoY) Sales Growth</div>
          <div style="font-weight:700;color:var(--color-success)">+${metrics.yoy_growth}%</div>
        </div>
      </div>

      <div class="verification-list">
        <div class="verification-list-title">🔄 Cashflow & Tax Reconciliation</div>
        <div class="reconciliation-wrap">
          <div class="reconcile-bars">
            <div class="reconcile-bar-item">
              <div class="reconcile-bar-header">
                <span>GST Declared Sales</span>
                <span>${SaarthiData.formatCurrency(revenue_gst)}</span>
              </div>
              <div class="reconcile-bar-outer">
                <div class="reconcile-bar-inner gst" style="width:${(revenue_gst / maxVal) * 100}%"></div>
              </div>
            </div>
            <div class="reconcile-bar-item">
              <div class="reconcile-bar-header">
                <span>ITR Reported Revenue</span>
                <span>${SaarthiData.formatCurrency(revenue_itr)}</span>
              </div>
              <div class="reconcile-bar-outer">
                <div class="reconcile-bar-inner itr" style="width:${(revenue_itr / maxVal) * 100}%"></div>
              </div>
            </div>
            <div class="reconcile-bar-item">
              <div class="reconcile-bar-header">
                <span>Bank Statement Credits</span>
                <span>${SaarthiData.formatCurrency(bank_inflows)}</span>
              </div>
              <div class="reconcile-bar-outer">
                <div class="reconcile-bar-inner bank" style="width:${(bank_inflows / maxVal) * 100}%"></div>
              </div>
            </div>
          </div>
        </div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:10px;line-height:1.4">
          ✓ Inflow audit reconciles declarations with bank credits (variance within acceptable limits).
        </div>
      </div>
    </div>`;
  },

  buildPillarRisk(c) {
    const ao = c.agentOutputs || {};
    const fraud = ao.fraud_detection || { score: 18, riskCategory: 'Low' };
    const cr = ao.credit_recommendation || { lendingScore: 698, verdict: 'CONDITIONAL_APPROVAL', verdictLabel: 'Conditional Approval' };

    const score = fraud.score;
    const scoreColor = score > 50 ? 'var(--color-danger)' : (score > 25 ? 'var(--color-warning)' : 'var(--color-success)');

    return `
    <div class="metric-widget-grid">
      <div class="metric-widget">
        <div class="metric-widget-label">Fraud Risk Score</div>
        <div class="metric-widget-value" style="color:${scoreColor}">${score}/100</div>
        <div class="metric-widget-desc">Risk exposure (Lower is safer)</div>
      </div>
      <div class="metric-widget">
        <div class="metric-widget-label">Underwriting Verdict</div>
        <div class="metric-widget-value" style="font-size:1.15rem;margin-top:4px">
          <span class="verdict-badge verdict-${cr.verdict === 'APPROVE' ? 'approve' : cr.verdict === 'CONDITIONAL_APPROVAL' ? 'conditional' : cr.verdict === 'REJECT' ? 'reject' : 'review'}">
            ${cr.verdictLabel || cr.verdict}
          </span>
        </div>
        <div class="metric-widget-desc">AI Automated Underwriting Decision</div>
      </div>
      <div class="metric-widget">
        <div class="metric-widget-label">Approved Limit</div>
        <div class="metric-widget-value">${cr.approvedAmount ? SaarthiData.formatCurrency(cr.approvedAmount) : '—'}</div>
        <div class="metric-widget-desc">Credit capacity allotment limit</div>
      </div>
      <div class="metric-widget">
        <div class="metric-widget-label">Pricing (Rate)</div>
        <div class="metric-widget-value">${cr.recommendedRate ? cr.recommendedRate + '%' : '—'}</div>
        <div class="metric-widget-desc">Recommended annual interest percentage</div>
      </div>
    </div>

    <div class="verification-card-grid">
      <div class="verification-list">
        <div class="verification-list-title">🛡️ Compliance & Safety Checklists</div>
        <div class="verification-item">
          <div class="verification-label">Director Politically Exposed (PEP) check</div>
          <span class="verification-status pass">CLEAR</span>
        </div>
        <div class="verification-item">
          <div class="verification-label">AML / Global Sanctions Database check</div>
          <span class="verification-status pass">CLEAR</span>
        </div>
        <div class="verification-item">
          <div class="verification-label">CIBIL Defaulter / Suit-Filed check</div>
          <span class="verification-status pass">CLEAR</span>
        </div>
        <div class="verification-item">
          <div class="verification-label">Document Tampering & Metadata Audit</div>
          <span class="verification-status pass">PASS</span>
        </div>
      </div>

      <div class="verification-list">
        <div class="verification-list-title">📋 Pre-Disbursement Underwriting Conditions</div>
        <div style="font-size:0.75rem;color:var(--text-secondary);line-height:1.6">
          ${cr.conditions ? cr.conditions.map(cond => `
            <div style="margin-bottom:8px;display:flex;align-items:flex-start;gap:8px">
              <span style="color:var(--color-accent-500);font-weight:700">•</span>
              <span>${cond}</span>
            </div>`).join('') : '<div style="color:var(--text-muted)">No special approval conditions specified.</div>'}
        </div>
      </div>
    </div>`;
  },

  buildPillarOps(c) {
    const ao = c.agentOutputs || {};
    const comms = ao.communication || {};
    const email = comms.templates?.email || '';

    // Generate executive summary paragraph
    const vintage = c.businessVintage || '8 years';
    const industry = c.industry || 'Manufacturing';
    const amount = SaarthiData.formatCurrency(c.loanAmount);
    const dscr = ao.financial?.metrics?.dscr || 1.42;
    const verdict = ao.credit_recommendation?.verdictLabel || 'Conditional Approval';

    const execSummary = `Saarthi AI's multi-agent underwriting system has processed a credit application for <strong>${c.company}</strong> seeking a <strong>${c.loanType}</strong> of <strong>${amount}</strong>. Based on a business vintage of <strong>${vintage}</strong> in the <strong>${industry}</strong> industry, the cashflow audit indicates a healthy debt service capacity with a DSCR of <strong>${dscr}</strong>. Cross-checks on compliance, PEP, and fraud risk (score: ${ao.fraud_detection?.score || 18}/100) are clear. The underwriting system recommends <strong>${verdict}</strong> subject to resolving the missing GST documentation and acquiring director guarantees.`;

    return `
    <div class="verification-card-grid">
      <div class="verification-list">
        <div class="verification-list-title">📝 Executive Loan Underwriting Summary</div>
        <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.7;margin-bottom:12px;">
          ${execSummary}
        </div>
        <div style="border-top:1px solid var(--border-subtle);padding-top:12px;display:flex;gap:10px;">
          <button class="btn btn-outline-primary btn-sm" onclick="Notifications.info('Report Generated','Underwriting summary report ready for download')">📥 Download Underwriting PDF</button>
        </div>
      </div>

      <div class="verification-list">
        <div class="verification-list-title">📧 Communications Log & Actions</div>
        <div class="comms-preview" style="padding:0">
          <div class="comms-channel-tabs" style="margin-bottom:10px">
            <button class="comms-channel-tab active">📧 Email</button>
            <button class="comms-channel-tab" onclick="Notifications.info('WhatsApp Preview','WhatsApp message: GSTR-3B request sent to director mobile')">💬 WhatsApp</button>
            <button class="comms-channel-tab" onclick="Notifications.info('SMS Preview','SMS notification: Clarification link dispatched')">📱 SMS</button>
          </div>
          <div class="comms-message" style="font-size:0.72rem;max-height:160px">${email ? email : 'No client communications logs recorded.'}</div>
          ${email ? `<button class="btn btn-outline-primary btn-sm" style="margin-top:12px" onclick="App.showFullComms()">Expand Email Preview</button>` : ''}
        </div>
      </div>
    </div>`;
  },

  buildPhaseProgress(status) {
    const phases = ['Phase 1: Intake', 'Phase 2: Analysis', 'Phase 3: Decision', 'Human Review'];
    const activeIdx = { pending: 0, in_progress: 0, phase1: 0, phase2: 1, phase3: 2, human_review: 3, clarification: 3, escalated: 3, approved: 4, rejected: 4 }[status] ?? 1;
    return phases.map((label, i) => `
      <div class="phase-step ${i < activeIdx ? 'completed' : i === activeIdx ? 'active' : ''}">
        <div class="phase-num">${i < activeIdx ? '✓' : i + 1}</div>
        <div class="phase-label">${label}</div>
      </div>`).join('');
  },

  buildAgentAccordion(c) {
    const ao = c.agentOutputs || {};
    const agents = [
      { key: 'intake', num: 1, name: 'Intake Agent', icon: '📋', color: 'var(--color-info)', score: ao.intake?.completeness, unit: '%', extra: `<div class="finding-item positive">✓ Case LOAN-2024-001 created</div><div class="finding-item neutral">⚠️ Missing: Q4 GST Returns</div>` },
      { key: 'doc_intelligence', num: 2, name: 'Document Intelligence', icon: '📄', color: 'var(--color-primary-300)', score: ao.doc_intelligence?.confidence, unit: '%', extra: `<div class="finding-item positive">✓ PAN, Aadhaar, GST verified</div><div class="finding-item positive">✓ Name consistency: PASS</div>` },
      { key: 'financial', num: 3, name: 'Financial Analysis', icon: '📊', color: SaarthiData.getScoreColor(ao.financial?.score || 72), score: ao.financial?.score || 72, extra: ao.financial?.observations?.map(o => `<div class="finding-item ${o.type}">${o.type === 'positive' ? '✓' : o.type === 'negative' ? '✗' : '~'} ${o.text}</div>`).join('') || '' },
      { key: 'gst', num: 4, name: 'GST Intelligence', icon: '🧾', color: SaarthiData.getScoreColor(ao.gst?.score || 61), score: ao.gst?.score || 61, extra: `<div class="finding-item positive">✓ GSTIN 27ABCPG1234R1Z5 — Active</div><div class="finding-item negative">✗ Q4 FY2023-24 GSTR-3B not filed</div><div class="finding-item positive">✓ Revenue variance 3.8% — within tolerance</div>` },
      { key: 'bank_statement', num: 5, name: 'Bank Statement Analysis', icon: '🏦', color: SaarthiData.getScoreColor(ao.bank_statement?.score || 81), score: ao.bank_statement?.score || 81, extra: ao.bank_statement?.observations?.map(o => `<div class="finding-item ${o.type}">${o.type === 'positive' ? '✓' : '~'} ${o.text}</div>`).join('') || '' },
      { key: 'fraud_detection', num: 6, name: 'Fraud Detection', icon: '🔍', color: 'var(--color-success)', score: ao.fraud_detection?.score || 18, extra: `<div class="finding-item positive">✓ Document integrity: PASS</div><div class="finding-item positive">✓ Blacklist: CLEAR</div><div class="finding-item positive">✓ PAN-Aadhaar linked</div>` },
      { key: 'credit_recommendation', num: 7, name: 'Credit Recommendation', icon: '💳', color: SaarthiData.getLendingScoreColor(ao.credit_recommendation?.lendingScore || 698), score: ao.credit_recommendation?.lendingScore || 698, unit: '/850', extra: (ao.credit_recommendation?.conditions || []).map(con => `<div class="finding-item neutral">~ ${con}</div>`).join('') },
      { key: 'compliance', num: 8, name: 'Compliance Check', icon: '⚖️', color: 'var(--color-warning)', score: null, extra: `<div class="finding-item positive">✓ KYC: Fully verified</div><div class="finding-item positive">✓ AML/PEP: CLEAR</div><div class="finding-item neutral">~ GST filing pending (must resolve)</div>` },
      { key: 'communication', num: 9, name: 'Communication Agent', icon: '📧', color: 'var(--color-info)', score: null, extra: this.buildCommsPreviewMini(ao.communication) },
      { key: 'case_summary', num: 10, name: 'Case Summary', icon: '📝', color: 'var(--text-muted)', score: null, extra: '<div style="font-size:0.8rem;color:var(--text-muted)">Summary will be generated after human decision.</div>' },
    ];

    return `<div id="agent-accordion">${agents.map((a, idx) => `
      <div class="agent-output-card accordion-item ${idx < 8 ? 'open' : ''}" id="agent-card-${a.key}">
        <div class="agent-output-header accordion-header" onclick="App.toggleAccordion('agent-card-${a.key}')">
          <div class="agent-output-icon" style="background:${a.color}18;border:1px solid ${a.color}30;">
            ${a.icon}
          </div>
          <div style="flex:1">
            <div class="agent-output-name">Agent ${a.num}: ${a.name}</div>
            <div class="agent-output-sub">
              <span class="badge badge-phase">ADK LlmAgent</span>
              ${a.key === 'gst' || a.key === 'compliance' ? '<span class="badge badge-warning" style="margin-left:4px">⚠️ Exception</span>' : ''}
            </div>
          </div>
          ${a.score !== null && a.score !== undefined ? `<div class="agent-output-score" style="color:${a.color}">${a.score}${a.unit || ''}</div>` : '<div style="color:var(--color-success);font-size:0.875rem;font-weight:700">✓</div>'}
          <span class="accordion-chevron">▼</span>
        </div>
        <div class="accordion-body">
          <div class="accordion-content">
            ${a.score !== null && a.score !== undefined ? `
            <div class="mb-3">
              <div class="flex items-center justify-between mb-1">
                <span style="font-size:0.75rem;color:var(--text-muted)">Score</span>
                <span style="font-size:0.8rem;font-weight:700;color:${a.color}">${a.score}${a.unit || '/100'}</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill ${a.score >= 75 ? 'success' : a.score >= 50 ? 'warning' : 'danger'}" style="width:${a.unit ? (a.score / 850 * 100) : a.score}%"></div>
              </div>
            </div>` : ''}
            ${a.extra}
          </div>
        </div>
      </div>`).join('')}</div>`;
  },

  buildCommsPreviewMini(comms) {
    if (!comms) return '<div style="font-size:0.8rem;color:var(--text-muted)">No communications sent yet.</div>';
    return `
    <div class="comms-preview">
      <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;">📧 Clarification email sent to applicant</div>
      <div class="comms-message" style="font-size:0.72rem;max-height:120px">${(comms.templates?.email || '').slice(0, 300)}...</div>
      <button class="btn btn-ghost btn-sm" style="margin-top:8px" onclick="App.showFullComms()">View Full Message</button>
    </div>`;
  },

  buildReviewPanel(c) {
    return `
    <div class="review-panel mt-4" style="margin-top:16px">
      <div class="review-panel-title">
        <span style="font-size:1.5rem">👤</span>
        Human Review Required
        <span class="badge badge-warning">Action Needed</span>
      </div>
      <p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:16px">
        The AI recommends <strong style="color:var(--color-accent-400)">Conditional Approval</strong> for ₹20,00,000 at 13.5% p.a.
        Please review the agent findings and make a final decision.
      </p>
      <div class="form-group">
        <label class="form-label">Decision Justification / Notes</label>
        <textarea class="form-control" id="decision-notes" placeholder="Enter your reasoning or any additional conditions..." rows="3"></textarea>
      </div>
      <div class="review-actions">
        <button class="btn btn-success" onclick="App.makeDecision('${c.id}', 'approve')">✅ Approve</button>
        <button class="btn btn-outline-primary" onclick="App.makeDecision('${c.id}', 'conditional')">⚡ Approve with Conditions</button>
        <button class="btn btn-ghost" onclick="App.makeDecision('${c.id}', 'request_info')">📋 Request More Info</button>
        <button class="btn btn-danger" onclick="App.makeDecision('${c.id}', 'reject')">❌ Reject</button>
      </div>
    </div>`;
  },

  // ═══════════════════════════════════════════
  //  ADK ORCHESTRATION VIEW
  // ═══════════════════════════════════════════
  buildADKView() {
    return `
    <div class="animate-fadeIn">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 style="font-family:var(--font-display);margin-bottom:4px">🤖 ADK Agent Orchestration</h2>
          <p style="font-size:0.875rem;color:var(--text-muted)">Live view of the 14-node Google ADK agent hierarchy for LOAN-2024-001</p>
        </div>
        <button class="btn btn-accent btn-lg" id="run-demo-btn" onclick="App.runDemo()">
          <span class="spinner spinner-sm" id="demo-spinner" style="display:none"></span>
          ▶ Run Demo
        </button>
      </div>

      <!-- ADK Info Banner -->
      <div class="kpi-banner mb-5">
        <span class="kpi-banner-icon">🔬</span>
        <div>
          <div class="kpi-banner-text">Google Agent Development Kit (ADK) – Multi-Agent Architecture</div>
          <div class="kpi-banner-sub">1 root_agent (LlmAgent) orchestrates 3 workflow containers and 10 specialist sub_agents • Total: 14 ADK nodes</div>
        </div>
      </div>

      <!-- ADK Tree -->
      <div class="card" style="padding:32px;overflow-x:auto;" id="adk-tree-card">
        <div class="adk-tree" id="adk-tree">

          <!-- ROOT AGENT -->
          <div class="adk-root-node">
            <div class="adk-root-pulse"></div>
            <div class="adk-root-pulse adk-root-pulse-2"></div>
            <div class="adk-root-card" id="root-agent-card">
              <div class="adk-root-icon">🧠</div>
              <div class="adk-root-name">saarthi_orchestrator</div>
              <div class="adk-root-type">🟣 LlmAgent (Gemini 2.0 Flash)</div>
              <div class="adk-root-desc">Master MSME loan underwriting orchestrator<br>Routes tasks · Handles exceptions · Human-in-loop</div>
              <div id="root-status" style="margin-top:8px;font-size:0.72rem;color:var(--text-muted)">Status: <span style="color:var(--color-info)">Idle</span></div>
            </div>
          </div>

          <div class="adk-connector-down"></div>

          <!-- 3 Containers Row -->
          <div class="adk-containers-row" id="containers-row">

            <!-- Container 1: Sequential / intake_pipeline -->
            <div class="adk-container" id="container-intake">
              <div class="adk-connector-down" style="background:linear-gradient(180deg,rgba(37,99,235,0.4),rgba(37,99,235,0.4));height:30px;margin-bottom:0"></div>
              <div class="adk-container-card sequential" id="container-card-intake">
                <div class="adk-container-icon">🔵</div>
                <div class="adk-container-name">intake_pipeline</div>
                <div class="adk-container-phase">Phase 1 · SequentialAgent</div>
                <span class="badge badge-sequential">Sequential</span>
              </div>
              <div class="adk-leaf-grid" style="margin-top:12px;width:160px">
                ${this.buildLeafCard(SaarthiData.adkAgents[0])}
              </div>
            </div>

            <!-- Container 2: Parallel / analysis_pipeline -->
            <div class="adk-container" id="container-analysis" style="max-width:500px;flex:2">
              <div class="adk-connector-down" style="background:linear-gradient(180deg,rgba(234,88,12,0.4),rgba(234,88,12,0.4));height:30px;margin-bottom:0"></div>
              <div class="adk-container-card parallel" id="container-card-analysis">
                <div class="adk-container-icon">🟠</div>
                <div class="adk-container-name">analysis_pipeline</div>
                <div class="adk-container-phase">Phase 2 · ParallelAgent · All run simultaneously ⚡</div>
                <span class="badge badge-parallel">Parallel</span>
              </div>
              <div class="adk-parallel-grid" style="margin-top:12px;grid-template-columns:repeat(5,1fr);width:100%">
                ${SaarthiData.adkAgents.slice(1, 6).map(a => this.buildLeafCard(a)).join('')}
              </div>
            </div>

            <!-- Container 3: Sequential / decision_pipeline -->
            <div class="adk-container" id="container-decision">
              <div class="adk-connector-down" style="background:linear-gradient(180deg,rgba(37,99,235,0.4),rgba(37,99,235,0.4));height:30px;margin-bottom:0"></div>
              <div class="adk-container-card sequential" id="container-card-decision">
                <div class="adk-container-icon">🔵</div>
                <div class="adk-container-name">decision_pipeline</div>
                <div class="adk-container-phase">Phase 3 · SequentialAgent</div>
                <span class="badge badge-sequential">Sequential</span>
              </div>
              <div class="adk-leaf-grid" style="margin-top:12px;width:160px">
                ${SaarthiData.adkAgents.slice(6).map(a => this.buildLeafCard(a)).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Demo Log -->
      <div class="card mt-5" style="margin-top:20px">
        <div class="section-title mb-3">📡 Execution Log</div>
        <div id="demo-log" style="font-family:var(--font-mono);font-size:0.78rem;color:var(--text-secondary);background:rgba(0,0,0,0.3);border-radius:10px;padding:16px;min-height:120px;max-height:280px;overflow-y:auto;line-height:1.8">
          <div style="color:var(--text-muted)">Waiting for demo to start… Click ▶ Run Demo to begin.</div>
        </div>
      </div>
    </div>`;
  },

  buildLeafCard(agent) {
    const status = adkEngine.getAgentStatus(agent.id);
    const statusClass = { completed: 'completed', processing: 'processing', warning: 'warning', error: 'error' }[status.status] || '';
    const score = status.score;
    return `
    <div class="adk-leaf-card ${statusClass}" id="leaf-${agent.id}">
      <div class="adk-leaf-icon">${agent.icon}</div>
      <div class="adk-leaf-num">Agent ${agent.num}</div>
      <div class="adk-leaf-name" style="font-size:0.62rem">${agent.name}</div>
      ${score !== null && score !== undefined ? `<div class="adk-leaf-score" style="color:${SaarthiData.getScoreColor(score || 0)}">${score}</div>` : `<div class="adk-leaf-score" style="font-size:0.65rem;color:var(--text-muted)">—</div>`}
    </div>`;
  },

  // ═══════════════════════════════════════════
  //  APPLY VIEW (Applicant)
  // ═══════════════════════════════════════════
  buildApplyView() {
    return `
    <div class="app-form-container animate-fadeIn">
      <div class="flex items-center gap-4 mb-6">
        <div style="width:52px;height:52px;background:linear-gradient(135deg,var(--color-accent-500),var(--color-primary-400));border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px">📝</div>
        <div>
          <h2>New Loan Application</h2>
          <p style="font-size:0.875rem;margin:0">Your application will be processed by 10 AI agents in minutes</p>
        </div>
      </div>

      <!-- Step Wizard -->
      <div class="step-wizard" id="apply-wizard">
        <div class="step-item active" data-step="1"><div class="step-content"><div class="step-circle">1</div><div class="step-label">Business Info</div></div></div>
        <div class="step-connector"></div>
        <div class="step-item" data-step="2"><div class="step-content"><div class="step-circle">2</div><div class="step-label">Loan Details</div></div></div>
        <div class="step-connector"></div>
        <div class="step-item" data-step="3"><div class="step-content"><div class="step-circle">3</div><div class="step-label">Documents</div></div></div>
        <div class="step-connector"></div>
        <div class="step-item" data-step="4"><div class="step-content"><div class="step-circle">4</div><div class="step-label">Review</div></div></div>
      </div>

      <!-- Step 1: Business Info -->
      <div class="card" id="apply-step-1">
        <div class="form-section-title">🏭 Business Information</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="form-group">
            <label class="form-label">Business Name <span class="required">*</span></label>
            <input type="text" class="form-control" id="biz-name" placeholder="ABC Manufacturing Pvt Ltd" value="ABC Manufacturing Pvt Ltd">
          </div>
          <div class="form-group">
            <label class="form-label">Business Type <span class="required">*</span></label>
            <select class="form-control" id="biz-type">
              <option>Private Limited Company</option>
              <option>Partnership Firm</option>
              <option>Proprietorship</option>
              <option>LLP</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">PAN Number <span class="required">*</span></label>
            <input type="text" class="form-control" id="pan" placeholder="ABCPG1234R" value="ABCPG1234R" maxlength="10" style="text-transform:uppercase">
          </div>
          <div class="form-group">
            <label class="form-label">GSTIN <span class="required">*</span></label>
            <input type="text" class="form-control" id="gstin" placeholder="27ABCPG1234R1Z5" value="27ABCPG1234R1Z5">
          </div>
          <div class="form-group">
            <label class="form-label">Industry</label>
            <select class="form-control" id="industry">
              <option>Manufacturing</option>
              <option>Trading</option>
              <option>Services</option>
              <option>Agriculture</option>
              <option>Textiles</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Business Vintage</label>
            <select class="form-control" id="vintage">
              <option>Less than 1 year</option>
              <option>1-3 years</option>
              <option>3-5 years</option>
              <option>5-10 years</option>
              <option selected>More than 10 years</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Registered Address <span class="required">*</span></label>
          <textarea class="form-control" id="address" rows="2" placeholder="Plot 45, MIDC, Pune 411019">Plot 45, MIDC Industrial Area, Pune 411019, Maharashtra</textarea>
        </div>
        <div class="flex justify-between mt-4">
          <div></div>
          <button class="btn btn-primary" onclick="App.applyNextStep(2)">Next: Loan Details →</button>
        </div>
      </div>

      <!-- Step 2: Loan Details (hidden) -->
      <div class="card hidden" id="apply-step-2">
        <div class="form-section-title">💰 Loan Details</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="form-group">
            <label class="form-label">Loan Amount (₹) <span class="required">*</span></label>
            <input type="number" class="form-control" id="loan-amount" placeholder="2500000" value="2500000">
            <div class="form-hint">Enter amount in Rupees (e.g. 2500000 = ₹25L)</div>
          </div>
          <div class="form-group">
            <label class="form-label">Loan Type <span class="required">*</span></label>
            <select class="form-control" id="loan-type">
              <option selected>Working Capital Loan</option>
              <option>Term Loan</option>
              <option>Equipment Loan</option>
              <option>Trade Finance</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Tenure Required</label>
            <select class="form-control">
              <option>6 months</option>
              <option selected>12 months</option>
              <option>24 months</option>
              <option>36 months</option>
              <option>60 months</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Annual Turnover (₹)</label>
            <input type="number" class="form-control" placeholder="18500000" value="18500000">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Purpose of Loan <span class="required">*</span></label>
          <textarea class="form-control" rows="3" placeholder="Describe how you will use the loan...">Purchase of raw materials and inventory for upcoming export orders to European markets</textarea>
        </div>
        <div class="flex justify-between mt-4">
          <button class="btn btn-ghost" onclick="App.applyNextStep(1)">← Back</button>
          <button class="btn btn-primary" onclick="App.applyNextStep(3)">Next: Documents →</button>
        </div>
      </div>

      <!-- Step 3: Documents (hidden) -->
      <div class="card hidden" id="apply-step-3">
        <div class="form-section-title">📎 Document Upload</div>
        <p style="font-size:0.875rem;color:var(--text-muted);margin-bottom:20px">Upload all required documents for AI-powered extraction and verification</p>
        <div class="doc-upload-grid">
          ${[
        { id: 'pan-doc', icon: '🪪', name: 'PAN Card', hint: 'PDF or Image', uploaded: true },
        { id: 'aadhaar-doc', icon: '🪪', name: 'Aadhaar Card', hint: 'PDF or Image', uploaded: true },
        { id: 'gst-cert', icon: '🧾', name: 'GST Certificate', hint: 'PDF', uploaded: true },
        { id: 'bank-stmt', icon: '🏦', name: 'Bank Statements (12M)', hint: 'PDF', uploaded: true },
        { id: 'itr-doc', icon: '📑', name: 'ITR (3 Years)', hint: 'PDF', uploaded: true },
        { id: 'bal-sheet', icon: '📊', name: 'Balance Sheet', hint: 'PDF', uploaded: true },
        { id: 'gst-ret', icon: '🧾', name: 'GST Returns', hint: 'PDF — Q4 Missing!', uploaded: false },
        { id: 'trade-lic', icon: '📋', name: 'Trade License', hint: 'PDF or Image', uploaded: false },
      ].map(doc => `
          <div class="doc-upload-item ${doc.uploaded ? 'uploaded' : ''}" onclick="App.simulateUpload('${doc.id}', this)">
            <div class="doc-upload-icon">${doc.uploaded ? '✅' : doc.icon}</div>
            <div class="doc-upload-name">${doc.name}</div>
            <div class="doc-upload-hint" style="color:${doc.uploaded ? 'var(--color-success)' : doc.hint.includes('Missing') ? 'var(--color-warning)' : 'var(--text-muted)'}">${doc.uploaded ? 'Uploaded ✓' : doc.hint}</div>
          </div>`).join('')}
        </div>
        <div class="flex justify-between mt-6">
          <button class="btn btn-ghost" onclick="App.applyNextStep(2)">← Back</button>
          <button class="btn btn-primary" onclick="App.applyNextStep(4)">Next: Review →</button>
        </div>
      </div>

      <!-- Step 4: Review (hidden) -->
      <div class="card hidden" id="apply-step-4">
        <div class="form-section-title">🔍 Application Review</div>
        <div class="card-flat" style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);margin-bottom:16px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:1.5rem">🤖</span>
            <div>
              <div style="font-weight:700;color:var(--color-success)">Ready for AI Processing</div>
              <div style="font-size:0.8rem;color:var(--text-muted)">10 specialized agents will analyze your application in parallel</div>
            </div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
          <div><span style="color:var(--text-muted);font-size:0.8rem">Company:</span><div style="font-weight:600">ABC Manufacturing Pvt Ltd</div></div>
          <div><span style="color:var(--text-muted);font-size:0.8rem">Loan Amount:</span><div style="font-weight:600;color:var(--color-accent-400)">₹25,00,000</div></div>
          <div><span style="color:var(--text-muted);font-size:0.8rem">Loan Type:</span><div style="font-weight:600">Working Capital</div></div>
          <div><span style="color:var(--text-muted);font-size:0.8rem">Documents:</span><div style="font-weight:600">7/8 uploaded</div></div>
        </div>
        <div class="flex justify-between">
          <button class="btn btn-ghost" onclick="App.applyNextStep(3)">← Back</button>
          <button class="btn btn-accent btn-lg" onclick="App.submitApplication()">🚀 Submit Application</button>
        </div>
      </div>
    </div>`;
  },

  // ═══════════════════════════════════════════
  //  TRACK VIEW (Applicant)
  // ═══════════════════════════════════════════
  buildTrackView() {
    const c = SaarthiData.getDemoCase();
    if (!c) return '<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">No active applications</div></div>';
    return `
    <div class="animate-fadeIn" style="max-width:800px;margin:0 auto">
      <div class="card mb-5" style="margin-bottom:20px">
        <div class="flex items-center gap-4">
          <div style="width:52px;height:52px;background:linear-gradient(135deg,var(--color-primary-600),var(--color-primary-500));border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px">🏭</div>
          <div class="flex-1">
            <h3>${c.company}</h3>
            <div style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-mono)">${c.id}</div>
          </div>
          <div style="text-align:right">
            <div style="font-family:Outfit;font-size:1.5rem;font-weight:800;color:var(--color-accent-400)">${SaarthiData.formatCurrency(c.loanAmount)}</div>
            <span class="badge ${SaarthiData.getStatusBadgeClass(c.status)}">${SaarthiData.getStatusLabel(c.status)}</span>
          </div>
        </div>
      </div>

      <!-- Action Required Banner -->
      <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:14px;padding:16px;margin-bottom:20px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:1.5rem">⚠️</span>
          <div class="flex-1">
            <div style="font-weight:700;color:var(--color-warning)">Action Required</div>
            <div style="font-size:0.8rem;color:var(--text-muted)">Please upload your Q4 FY2023-24 GST Return (GSTR-3B) to proceed</div>
          </div>
          <button class="btn btn-accent btn-sm" onclick="Notifications.success('Document Uploaded!','Q4 GST Return uploaded successfully',3000)">Upload Now</button>
        </div>
      </div>

      <!-- Phase Progress -->
      <div class="card mb-5" style="margin-bottom:20px;">
        <div class="section-title mb-4">Application Status</div>
        <div class="phase-progress">
          ${this.buildPhaseProgress(c.status)}
        </div>
        <div style="margin-top:16px;font-size:0.8rem;color:var(--text-muted);text-align:center">
          Estimated completion: <strong style="color:var(--text-primary)">1-2 business days</strong> after document submission
        </div>
      </div>

      <!-- AI Analysis Summary -->
      <div class="card mb-5" style="margin-bottom:20px;">
        <div class="section-title mb-4">🤖 AI Analysis Summary</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
          <div class="stat-card" style="--stat-accent:linear-gradient(90deg,var(--color-success),var(--color-success))">
            <div class="stat-icon" style="background:rgba(16,185,129,0.15);color:var(--color-success)">📊</div>
            <div class="stat-label">Financial Score</div>
            <div class="stat-value" style="color:var(--color-success)">72</div>
          </div>
          <div class="stat-card" style="--stat-accent:linear-gradient(90deg,var(--color-info),var(--color-info))">
            <div class="stat-icon" style="background:rgba(6,182,212,0.15);color:var(--color-info)">🏦</div>
            <div class="stat-label">Banking Score</div>
            <div class="stat-value" style="color:var(--color-info)">81</div>
          </div>
          <div class="stat-card" style="--stat-accent:linear-gradient(90deg,var(--color-primary-400),var(--color-primary-400))">
            <div class="stat-icon" style="background:rgba(37,99,235,0.15);color:var(--color-primary-400)">💳</div>
            <div class="stat-label">Lending Score</div>
            <div class="stat-value" style="color:var(--color-primary-400)">698</div>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="card">
        <div class="section-title mb-4">📅 Activity Timeline</div>
        <div class="timeline">
          ${(c.timeline || []).slice(0, 6).map(t => `
          <div class="timeline-item">
            <div class="timeline-dot ${t.type}"></div>
            <div class="timeline-time">${t.time}</div>
            <div class="timeline-title">${t.action}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
  },

  // ═══════════════════════════════════════════
  //  RISK DASHBOARD
  // ═══════════════════════════════════════════
  buildRiskView() {
    const m = SaarthiData.platformMetrics;
    return `
    <div class="animate-fadeIn">
      <div class="dashboard-grid-4" style="margin-bottom:20px;">
        <div class="stat-card" style="--stat-accent:linear-gradient(90deg,#dc2626,#ef4444)">
          <div class="stat-icon" style="background:rgba(239,68,68,0.15);color:var(--color-danger)">🚨</div>
          <div class="stat-label">Fraud Alerts</div>
          <div class="stat-value">${m.fraudDetected}</div>
          <div class="stat-change negative">↑ 3 new today</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(245,158,11,0.15);color:var(--color-warning)">⚠️</div>
          <div class="stat-label">Escalated Cases</div>
          <div class="stat-value">5</div>
          <div class="stat-change negative">Needs attention</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(16,185,129,0.15);color:var(--color-success)">🛡️</div>
          <div class="stat-label">Fraud Prevented</div>
          <div class="stat-value">₹2.8Cr</div>
          <div class="stat-change positive">↑ This month</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(6,182,212,0.15);color:var(--color-info)">🔍</div>
          <div class="stat-label">Under Investigation</div>
          <div class="stat-value">3</div>
          <div class="stat-change">Active cases</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
        <div>
          <div class="section-title mb-4">🚨 Fraud Alerts</div>
          ${[
        { id: 'LOAN-2024-003', company: 'Phantom Exports LLC', score: 87, level: 'CRITICAL', signal: 'Forged bank statements + CIBIL defaulter match' },
        { id: 'LOAN-2024-007', company: 'Quick Cash Solutions', score: 74, level: 'HIGH', signal: 'Circular GST transactions + new business + large amount' },
        { id: 'LOAN-2024-011', company: 'Shreeji Traders', score: 62, level: 'MEDIUM', signal: 'Revenue inflation: GST ↔ ITR variance 48%' },
      ].map(alert => `
          <div class="fraud-alert-card ${alert.level.toLowerCase() === 'critical' ? 'critical' : ''}">
            <div class="flex items-center justify-between mb-2">
              <div class="fraud-level" style="color:${alert.level === 'CRITICAL' ? 'var(--color-danger)' : alert.level === 'HIGH' ? 'var(--color-warning)' : 'var(--color-info)'}">
                ${alert.level}
              </div>
              <span class="fraud-score-badge">${alert.score}/100</span>
            </div>
            <div style="font-weight:700;font-size:0.875rem;color:var(--text-primary);margin-bottom:4px">${alert.company}</div>
            <div style="font-size:0.75rem;color:var(--text-muted)">📋 ${alert.id}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:6px">🔍 ${alert.signal}</div>
            <div class="flex gap-2 mt-3">
              <button class="btn btn-danger btn-sm" onclick="Notifications.danger('Investigation Started','Case ${alert.id} frozen pending review')">Investigate</button>
              <button class="btn btn-ghost btn-sm">View Details</button>
            </div>
          </div>`).join('')}
        </div>

        <div>
          <div class="section-title mb-4">📊 Risk Distribution</div>
          <div class="card" style="margin-bottom:16px;">
            <div style="display:flex;flex-direction:column;gap:12px">
              ${[
        { label: 'Low Risk (0-25)', count: 1089, pct: 87, color: 'var(--color-success)' },
        { label: 'Medium Risk (26-60)', count: 140, pct: 11, color: 'var(--color-warning)' },
        { label: 'High Risk (61-80)', count: 15, pct: 1.5, color: 'var(--color-danger)' },
        { label: 'Critical (>80)', count: 3, pct: 0.5, color: '#9f1239' },
      ].map(r => `
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span style="font-size:0.8rem;color:var(--text-secondary)">${r.label}</span>
                  <span style="font-size:0.8rem;font-weight:700;color:${r.color}">${r.count} cases (${r.pct}%)</span>
                </div>
                <div class="progress-bar-wrap">
                  <div class="progress-bar-fill" style="width:${r.pct}%;background:${r.color}"></div>
                </div>
              </div>`).join('')}
            </div>
          </div>

          <div class="section-title mb-4">⚡ Recent Escalations</div>
          <div class="card">
            ${[
        { id: 'LOAN-2024-005', company: 'Metro Steel Industries', reason: 'Loan > ₹50L — mandatory human review', time: '2h ago' },
        { id: 'LOAN-2024-008', company: 'Sunrise Agro Ltd', reason: 'GST revenue variance > 30%', time: '4h ago' },
        { id: 'LOAN-2024-003', company: 'Phantom Exports LLC', reason: 'Fraud score 87 — critical', time: '5h ago' },
      ].map(e => `
            <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
              <span style="font-size:1.25rem;margin-top:2px">⚡</span>
              <div class="flex-1">
                <div style="font-weight:600;font-size:0.8rem;color:var(--text-primary)">${e.company}</div>
                <div style="font-size:0.72rem;color:var(--text-muted)">${e.reason}</div>
              </div>
              <div style="font-size:0.7rem;color:var(--text-muted);white-space:nowrap">${e.time}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
  },

  // ═══════════════════════════════════════════
  //  ADMIN DASHBOARD
  // ═══════════════════════════════════════════
  buildAdminView() {
    const m = SaarthiData.platformMetrics;
    return `
    <div class="animate-fadeIn">
      <!-- KPI Stats -->
      <div class="dashboard-grid-4" style="margin-bottom:20px">
        <div class="stat-card" style="--stat-accent:linear-gradient(90deg,var(--color-accent-500),var(--color-accent-400))">
          <div class="stat-icon" style="background:rgba(245,158,11,0.15);color:var(--color-accent-400)">📋</div>
          <div class="stat-label">Total Applications</div>
          <div class="stat-value" id="admin-total">${m.totalApplications.toLocaleString()}</div>
          <div class="stat-change positive">↑ 12% this month</div>
        </div>
        <div class="stat-card" style="--stat-accent:linear-gradient(90deg,var(--color-success),#34d399)">
          <div class="stat-icon" style="background:rgba(16,185,129,0.15);color:var(--color-success)">✅</div>
          <div class="stat-label">Approved Today</div>
          <div class="stat-value">${m.approvedToday}</div>
          <div class="stat-change positive">↑ 4 from yesterday</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(6,182,212,0.15);color:var(--color-info)">⚡</div>
          <div class="stat-label">Avg Processing</div>
          <div class="stat-value">${m.avgProcessingTime}<span style="font-size:1rem;font-weight:400">min</span></div>
          <div class="stat-change positive">↓ from 3 days</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(124,58,237,0.15);color:var(--color-root-agent)">🤖</div>
          <div class="stat-label">Agent Success Rate</div>
          <div class="stat-value">${m.agentSuccessRate}<span style="font-size:1rem">%</span></div>
          <div class="stat-change positive">↑ 1.2% this week</div>
        </div>
      </div>

      <!-- Second Row Stats -->
      <div class="dashboard-grid-4" style="margin-bottom:24px">
        <div class="stat-card">
          <div class="stat-label">Manual Effort Reduced</div>
          <div class="stat-value" style="color:var(--color-success)">${m.manualEffortReduction}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Human Intervention Rate</div>
          <div class="stat-value">${m.humanInterventionRate}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">SLA Compliance</div>
          <div class="stat-value" style="color:var(--color-info)">${m.slaCompliance}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Fraud Detected</div>
          <div class="stat-value" style="color:var(--color-danger)">${m.fraudDetected}</div>
        </div>
      </div>

      <!-- Agent Performance Grid -->
      <div class="section-title mb-4">🤖 Agent Performance Metrics</div>
      <div class="admin-metric-grid mb-6" style="margin-bottom:24px">
        ${SaarthiData.agentMetrics.map(a => `
        <div class="agent-perf-card">
          <div class="agent-perf-icon">${a.icon}</div>
          <div class="agent-perf-name">${a.name}</div>
          <div class="agent-perf-rate" style="color:${a.successRate >= 98 ? 'var(--color-success)' : a.successRate >= 95 ? 'var(--color-info)' : 'var(--color-warning)'}">
            ${a.successRate}%
          </div>
          <div class="progress-bar-wrap" style="margin-bottom:6px">
            <div class="progress-bar-fill ${a.successRate >= 98 ? 'success' : a.successRate >= 95 ? 'primary' : 'warning'}" style="width:${a.successRate}%"></div>
          </div>
          <div style="font-size:0.68rem;color:var(--text-muted)">${a.avgTime}s avg · ${a.executions.toLocaleString()} runs</div>
        </div>`).join('')}
      </div>

      <!-- ADK Architecture Summary -->
      <div class="card" style="background:linear-gradient(135deg,rgba(124,58,237,0.08),rgba(37,99,235,0.06));border-color:rgba(124,58,237,0.2)">
        <div class="section-title mb-4">🏗️ ADK Architecture Summary</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;text-align:center">
          <div>
            <div style="font-family:Outfit;font-size:2rem;font-weight:800;color:#c4b5fd">1</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">Root Agent (LlmAgent)</div>
          </div>
          <div>
            <div style="font-family:Outfit;font-size:2rem;font-weight:800;color:#93c5fd">3</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">Workflow Containers</div>
          </div>
          <div>
            <div style="font-family:Outfit;font-size:2rem;font-weight:800;color:#fdba74">10</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">Specialist Sub-Agents</div>
          </div>
          <div>
            <div style="font-family:Outfit;font-size:2rem;font-weight:800;color:var(--color-accent-400)">14</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">Total ADK Nodes</div>
          </div>
        </div>
      </div>
    </div>`;
  },

  // ═══════════════════════════════════════════
  //  NOTIFICATIONS VIEW
  // ═══════════════════════════════════════════
  buildNotifView() {
    const notifs = [
      { icon: '⚠️', title: 'GST Return Missing', msg: 'LOAN-2024-001: Q4 FY23-24 GSTR-3B not uploaded by ABC Manufacturing', time: '10m ago', type: 'warning' },
      { icon: '🚨', title: 'High Fraud Score Alert', msg: 'LOAN-2024-003: Phantom Exports — fraud score 87/100. Immediate review required.', time: '1h ago', type: 'danger' },
      { icon: '✅', title: 'Application Approved', msg: 'LOAN-2024-002: Sunrise Textiles ₹15L — auto-approved. Score 812/850.', time: '2h ago', type: 'success' },
      { icon: 'ℹ️', title: 'Human Review Assigned', msg: 'LOAN-2024-001 assigned to Priya Sharma for conditional approval review', time: '3h ago', type: 'info' },
      { icon: '📧', title: 'Clarification Email Sent', msg: 'Agent 9 sent clarification email to ABC Manufacturing for GST documents', time: '3h ago', type: 'info' },
    ];
    return `
    <div class="animate-fadeIn" style="max-width:700px;">
      <div class="flex items-center justify-between mb-5">
        <div class="section-title">All Notifications</div>
        <button class="btn btn-ghost btn-sm" onclick="this.closest('.animate-fadeIn').querySelectorAll('.notif-item').forEach(el=>el.style.opacity='0.4')">Mark all read</button>
      </div>
      ${notifs.map(n => `
      <div class="card notif-item mb-3" style="margin-bottom:12px;border-left:4px solid ${n.type === 'danger' ? 'var(--color-danger)' : n.type === 'warning' ? 'var(--color-warning)' : n.type === 'success' ? 'var(--color-success)' : 'var(--color-info)'}">
        <div class="flex gap-3 items-start">
          <span style="font-size:1.5rem">${n.icon}</span>
          <div class="flex-1">
            <div style="font-weight:700;font-size:0.875rem;color:var(--text-primary);margin-bottom:4px">${n.title}</div>
            <div style="font-size:0.8rem;color:var(--text-secondary)">${n.msg}</div>
          </div>
          <div style="font-size:0.72rem;color:var(--text-muted);white-space:nowrap">${n.time}</div>
        </div>
      </div>`).join('')}
    </div>`;
  },

  // ═══════════════════════════════════════════
  //  INTERACTIVE ACTIONS
  // ═══════════════════════════════════════════
  selectCase(caseId) {
    this.activeCaseId = caseId;
    document.querySelectorAll('.case-card').forEach(el => el.classList.remove('selected'));
    document.getElementById(`case-item-${caseId}`)?.classList.add('selected');
    const detail = document.getElementById('case-detail-panel');
    if (detail) {
      detail.innerHTML = this.buildCaseDetail(SaarthiData.getCaseById(caseId));
      detail.classList.add('animate-fadeIn');
    }
  },

  toggleAccordion(id) {
    document.getElementById(id)?.classList.toggle('open');
  },

  filterCases(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('.case-card').forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = text.includes(q) ? '' : 'none';
    });
  },

  applyNextStep(step) {
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById(`apply-step-${i}`);
      if (el) el.classList.toggle('hidden', i !== step);
    }
    document.querySelectorAll('.step-item').forEach((el, i) => {
      const s = parseInt(el.dataset.step);
      el.classList.toggle('completed', s < step);
      el.classList.toggle('active', s === step);
    });
  },

  simulateUpload(docId, el) {
    el.classList.add('uploaded');
    el.querySelector('.doc-upload-icon').textContent = '✅';
    el.querySelector('.doc-upload-hint').textContent = 'Uploaded ✓';
    el.querySelector('.doc-upload-hint').style.color = 'var(--color-success)';
    Notifications.success('Document Uploaded', `${el.querySelector('.doc-upload-name').textContent} uploaded successfully`, 2500);
  },

  submitApplication() {
    Notifications.success('Application Submitted! 🚀', 'Case ID: LOAN-2024-NEW · AI agents are now processing your application', 5000);
    this.loginAs('officer');
    setTimeout(() => this.runDemo(), 1000);
  },

  makeDecision(caseId, decision) {
    const labels = {
      approve: { msg: 'Application Approved! ✅', type: 'success', status: 'approved' },
      conditional: { msg: 'Conditional Approval Granted ⚡', type: 'success', status: 'approved' },
      request_info: { msg: 'Clarification Requested 📋', type: 'info', status: 'clarification' },
      reject: { msg: 'Application Rejected ❌', type: 'danger', status: 'rejected' },
    };
    const d = labels[decision];
    const c = SaarthiData.getCaseById(caseId);
    if (c) c.status = d.status;
    Notifications[d.type](d.msg, `Decision recorded for ${caseId}`, 4000);
    setTimeout(() => this.navigateTo('cases'), 500);
  },

  showFullComms() {
    const c = SaarthiData.getDemoCase();
    const email = c?.agentOutputs?.communication?.templates?.email || '';
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">📧 Communication Preview – Agent 9</div>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="comms-preview">
          <div class="comms-channel-tabs">
            <button class="comms-channel-tab active">📧 Email</button>
            <button class="comms-channel-tab" onclick="Notifications.info('WhatsApp Preview','WhatsApp message preview coming soon')">💬 WhatsApp</button>
            <button class="comms-channel-tab" onclick="Notifications.info('SMS Preview','SMS preview coming soon')">📱 SMS</button>
          </div>
          <div class="comms-message">${email}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="this.closest('.modal-overlay').remove()">Close</button>
          <button class="btn btn-primary" onclick="Notifications.success('Email Sent!','Clarification email resent to applicant');this.closest('.modal-overlay').remove()">Resend Email</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  },

  // ═══════════════════════════════════════════
  //  DEMO RUNNER
  // ═══════════════════════════════════════════
  async runDemo() {
    if (this.demoRunning) return;
    this.demoRunning = true;

    // Navigate to ADK view first
    this.navigateTo('adk');
    await new Promise(r => setTimeout(r, 300));

    const btn = document.getElementById('run-demo-btn');
    const spinner = document.getElementById('demo-spinner');
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner spinner-sm"></span> Running...'; }

    const log = document.getElementById('demo-log');
    if (log) log.innerHTML = '';

    const addLog = (msg, color = 'var(--text-secondary)') => {
      if (!log) return;
      const t = new Date().toLocaleTimeString('en-IN', { hour12: false });
      const line = document.createElement('div');
      line.style.color = color;
      line.textContent = `[${t}] ${msg}`;
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    };

    // Update leaf card in UI
    const updateLeaf = (agentId, status, score) => {
      const el = document.getElementById(`leaf-${agentId}`);
      if (!el) return;
      el.className = `adk-leaf-card ${status}`;
      const scoreEl = el.querySelector('.adk-leaf-score');
      if (scoreEl && score !== null && score !== undefined) {
        scoreEl.style.color = SaarthiData.getScoreColor(score);
        scoreEl.textContent = score;
      }
    };

    // Update container highlight
    const highlightContainer = (containerId, active) => {
      const el = document.getElementById(`container-card-${containerId}`);
      if (el) el.classList.toggle('active', active);
    };

    // Update root agent status
    const updateRoot = (msg) => {
      const el = document.getElementById('root-status');
      if (el) el.innerHTML = `Status: <span style="color:var(--color-info)">${msg}</span>`;
    };

    const demoCase = SaarthiData.getDemoCase();

    const onUpdate = (event) => {
      switch (event.type) {
        case 'root_activated':
          addLog(`🟣 root_agent: saarthi_orchestrator — ACTIVATED`, '#c4b5fd');
          updateRoot('Active');
          break;
        case 'phase_change':
          const phaseLabels = { phase1: 'Phase 1: intake_pipeline (Sequential)', phase2: 'Phase 2: analysis_pipeline (Parallel ⚡)', phase3: 'Phase 3: decision_pipeline (Sequential)', escalated: 'ESCALATED to Risk Manager' };
          addLog(`📍 ${phaseLabels[event.phase] || event.phase}`, 'var(--color-accent-400)');
          ['intake', 'analysis', 'decision'].forEach(c => highlightContainer(c, event.container?.includes(c)));

          // Dynamic tab focusing in Case Detail view
          if (event.phase === 'phase1') this.setDetailTab('kyc');
          if (event.phase === 'phase2') this.setDetailTab('financials');
          if (event.phase === 'phase3') this.setDetailTab('risk');
          break;
        case 'parallel_start':
          addLog(`⚡ ParallelAgent: ${event.agents.length} agents firing simultaneously...`, '#fdba74');
          event.agents.forEach(id => updateLeaf(id, 'processing', null));
          break;
        case 'agent_start':
          addLog(`  → Agent starting: ${event.agentId}`, 'var(--text-muted)');
          updateLeaf(event.agentId, 'processing', null);
          break;
        case 'agent_complete':
          const scoreDisp = event.output?.score != null ? ` [${event.output.score}]` : '';
          const warn = event.output?.warning ? ' ⚠️' : ' ✓';
          addLog(`  ✓ ${event.agentId}${warn}${scoreDisp}`, event.output?.warning ? '#fcd34d' : 'var(--color-success)');
          updateLeaf(event.agentId, event.output?.warning ? 'warning' : 'completed', event.output?.score);

          // Switch to ops tab on communication agent completion
          if (event.agentId === 'communication') {
            this.setDetailTab('ops');
          }
          break;
        case 'exception':
          addLog(`  ⚠️ EXCEPTION [${event.agent}]: ${event.message}`, '#fcd34d');
          if (event.severity === 'warning') Notifications.warning('Agent Exception', event.message, 4000);
          if (event.severity === 'critical') Notifications.danger('🚨 Critical Exception', event.message, 5000);
          break;
        case 'human_review':
          addLog(`👤 ${event.message}`, '#c4b5fd');
          updateRoot('Awaiting Human Decision');
          Notifications.info('👤 Human Review Required', 'Routing to Loan Officer for final decision', 5000);
          break;
        case 'complete':
          addLog(`🎉 ${event.message}`, 'var(--color-success)');
          updateRoot('Complete');

          // Automatically navigate back to cases view to show updated underwriting report
          setTimeout(() => {
            if (this.currentView === 'adk') {
              this.navigateTo('cases');
            }
          }, 1500);
          break;
      }
    };

    addLog('=== SAARTHI AI – ADK DEMO STARTED ===', 'var(--color-accent-400)');
    await adkEngine.run(demoCase, onUpdate);
    addLog('=== DEMO COMPLETE ===', 'var(--color-accent-400)');

    if (btn) { btn.disabled = false; btn.innerHTML = '▶ Run Demo Again'; }
    this.demoRunning = false;
  },

  runAgentDemo(caseId) {
    this.activeCaseId = caseId;
    this.runDemo();
  },

  // ── Event Binders ──────────────────────────
  bindCasesEvents() { },
  bindApplyEvents() { },
  bindADKEvents() { },
  bindAdminEvents() {
    // Animate counters
    setTimeout(() => {
      const el = document.getElementById('admin-total');
      if (el) Utils.animateCount(el, SaarthiData.platformMetrics.totalApplications);
    }, 200);
  },
};

// Boot the app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
