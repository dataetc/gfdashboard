class SiteFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();

    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      this.updateLanguage(savedLanguage);
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; }

        footer {
          background-color: #111;
          border-top: 3px solid #a85a3e;
          padding: 36px 6vw;
          font-family: "Roboto Condensed", sans-serif;
        }

        .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .footer-brand {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .footer-links a {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          letter-spacing: 0.05em;
          padding: 6px 12px;
          font-weight: bold;
          transition: color 0.2s, background-color 0.2s;
        }

        .footer-links a:hover {
          color: #fff;
          background-color: #a85a3e;
        }

        @media (max-width: 600px) {
          .footer-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .footer-links {
            flex-direction: column;
            gap: 2px;
          }
        }
      </style>

      <footer>
        <div class="footer-inner">
          <span class="footer-brand">© 2025–2026 The Global Advocacy Data Hub</span>
          <nav>
            <ul class="footer-links">
              <li><a href="/index.html"   id="footer-home">Home</a></li>
              <li><a href="/resources.html" id="footer-resources">Resources</a></li>
              <li><a href="/calendar.html"  id="footer-calendar">Calendar</a></li>
              <li><a href="/support.html"   id="footer-support">Support</a></li>
              <li><a href="/blog.html"      id="footer-blog">News</a></li>
              <li><a href="/about.html"     id="footer-about">About</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    `;
  }

  setupEventListeners() {
    // Listen for language changes dispatched by the navbar
    document.addEventListener('languagechange', (e) => {
      this.updateLanguage(e.detail?.language);
    });

    // Also listen via the navbar's custom event bubbling through the DOM
    window.addEventListener('languagechange', (e) => {
      this.updateLanguage(e.detail?.language);
    });
  }

  updateLanguage(lang) {
    if (!lang || !window.languageData || !window.languageData[lang]) return;
    const d = window.languageData[lang];

    const map = {
      'footer-home':      d.navHome,
      'footer-resources': d.navResources,
      'footer-calendar':  d.navCalendar,
      'footer-support':   d.navSupport,
      'footer-blog':      d.navBlog,
      'footer-about':     d.navAbout,
    };

    Object.entries(map).forEach(([id, text]) => {
      const el = this.shadowRoot.querySelector(`#${id}`);
      if (el && text) el.textContent = text;
    });
  }
}

customElements.define('site-footer', SiteFooter);