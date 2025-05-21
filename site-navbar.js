class SiteNavbar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      
      // Track mobile menu state
      this.menuOpen = false;
      
      // Store color settings
      this.mainTextColor = '#fff';
      this.secondaryTextColor = '#fff';
      this.languageDropdownTextColor = '#000'; // Always black for the dropdown text
      this.borderColor = '#fff';
    }
  
    connectedCallback() {
      this.render();
      this.setupEventListeners();
      
      // Check for language preference and set it on load
      const savedLanguage = localStorage.getItem('preferredLanguage');
      if (savedLanguage) {
        this.setLanguage(savedLanguage);
      }
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
          }
          
          header {
            background-color: transparent;
            color: #fff;
            padding: 15px;
            position: relative;
            z-index: 900;
          }
  
          @media (max-width: 767px) {
            header {
              padding: 15px;
            }
          }
  
          header::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 97vw;
            height: 0.3px;
            background-color: var(--bottom-border-color, #fff);
          }
  
          nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          nav a {
            color: inherit;
            text-decoration: none;
            padding: 10px;
            font-weight: bold;
            font-family: "Roboto Condensed", sans-serif;
            font-size: 1.3em;
          }
          
          nav a:hover {
            background-color: #a85a3e;
            transform: scale(1.05);
            transition: all 0.3s ease-in-out;
          }
          
          nav ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            display: flex;
          }
          
          nav li {
            margin-right: 20px;
            position: relative;
          }
          
          nav li:hover .dropdown-menu {
            display: block;
          }
          
          .dropdown-menu {
            display: none;
            position: absolute;
            padding: 10px;
            z-index: 1;
          }
          
          .dropdown-menu li {
            margin-right: 0;
          }
          
          .language-dropdown {
            position: relative;
            display: inline-block;
            vertical-align: top;
            cursor: pointer;
          }
          
          .language-btn {
            background-color: transparent;
            border: none;
            color: inherit;
            padding: 10px;
            font-size: 16px;
            cursor: pointer;
            align-items: center;
            display: flex; 
          }
          
          .language-icon {
            width: 20px;
            height: 20px;
            margin-right: 5px;
            filter: var(--icon-filter, none); /* For SVG icon color control */
          }
          
          .active-language {
            margin-right: 5px;
            font-weight: bold;
            font-family: "Roboto Condensed", sans-serif;
            font-size: 1.3em;
            color: var(--main-text-color, #fff);
          }
          
          .language-content {
            display: none;
            position: absolute;
            background-color: #f1f1f1;
            min-width: 100px;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            right: 0;
          }
          
          .language-content a {
            color: #000; /* Always black text for language items */
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            font-size: 1.1em;
          }
          
          .language-content a:hover {
            background-color: #a85a3e;
            color: #fff;
          }
          
          .language-dropdown:hover .language-content {
            display: block;
          }
  
          /* Hamburger menu styles */
          .hamburger {
            display: none;
            cursor: pointer;
            padding: 10px;
            z-index: 1001;
          }
          
          .hamburger .bar {
            display: block;
            width: 25px;
            height: 3px;
            margin: 5px auto;
            background-color: var(--main-text-color, #fff);
            transition: all 0.3s ease-in-out;
          }
          
          @media (max-width: 767px) {
            .logo {
              display: none;
            }
            
            .active-language {
              display: none;
            }
            
            .hamburger {
              display: block;
            }
            
            .nav-menu {
              position: fixed;
              top: 0;
              right: -100%;
              width: 80%;
              height: 100vh;
              background-color: #333;
              text-align: center;
              transition: 0.3s;
              box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
              flex-direction: column;
              padding-top: 60px;
            }
            
            .nav-menu.active {
              right: 0;
            }
            
            nav ul {
              flex-direction: column;
            }
            
            nav li {
              margin: 1.5rem 0;
            }
            
            .hamburger.active .bar:nth-child(1) {
              transform: translateY(8px) rotate(45deg);
            }
            
            .hamburger.active .bar:nth-child(2) {
              opacity: 0;
            }
            
            .hamburger.active .bar:nth-child(3) {
              transform: translateY(-8px) rotate(-45deg);
            }
            
            /* Mobile language selector styling */
            .language-dropdown {
              position: static;
              display: block;
              margin-top: 20px;
            }
            
            .language-content {
              position: static;
              display: none;
              background-color: #f1f1f1; /* Light background for better readability */
              box-shadow: none;
              margin-top: 10px;
              padding: 5px 0;
              width: 100%;
            }
            
            .language-dropdown.active .language-content {
              display: block;
            }
            
            .language-content a {
              color: #000; /* Always black text for language items in mobile */
              text-align: center;
              padding: 8px 0;
            }
            
            .language-content a:hover {
              background-color: #a85a3e;
              color: #fff;
            }
            
            .language-icon {
              display: inline-block;
              vertical-align: middle;
              margin-right: 5px;
            }
            
            /* Override hover behavior for mobile */
            .language-dropdown:hover .language-content {
              display: none;
            }
            
            .language-dropdown.active .language-content {
              display: block;
            }
            
            /* When tapped on mobile, show the language dropdown */
            .language-dropdown.touchactive .language-content {
              display: block;
            }
          }
        </style>
        
        <header>
          <nav>
            <div class="logo">
              <a href="/index.html" id="title">THE GLOBAL ADVOCACY DATA HUB</a>
            </div>
            
            <div class="hamburger">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </div>
            
            <ul class="nav-menu">
              <li><a href="/index.html" id="nav-home">Home</a></li>
              <li><a href="/resources.html" id="nav-resources">Resources</a></li>
              <li><a href="/calendar.html" id="nav-calendar">Calendar</a></li>
              <li><a href="/support.html" id="nav-support">Support</a></li>
              <li><a href="/about.html" id="nav-about">About</a></li>
              <li class="language-dropdown">
                <img src="./images/translation-svg-wh.svg" class="language-icon" data-icon="white"> 
                <span id="active-language" class="active-language">EN</span>
                <div class="language-content">
                  <a href="#" data-lang="EN">English</a>
                  <a href="#" data-lang="FR">Français</a>
                  <a href="#" data-lang="ES">Español</a>
                  <a href="#" data-lang="PT">Português</a>
                  <a href="#" data-lang="RU">Русский</a>
                  <a href="#" data-lang="SW">Kiswahili</a>
                </div>
              </li>
            </ul>
          </nav>
        </header>
      `;
      
      // Apply initial colors using CSS variables
      this.updateColors();
    }
  
    updateColors() {
      // Set CSS variables for colors
      const root = this.shadowRoot.host;
      
      // Apply colors as CSS variables
      this.shadowRoot.host.style.setProperty('--main-text-color', this.mainTextColor);
      this.shadowRoot.host.style.setProperty('--bottom-border-color', this.borderColor);
      
      // Apply text color to nav links directly
      const navLinks = this.shadowRoot.querySelectorAll('nav a:not(.language-content a)');
      navLinks.forEach(link => {
        link.style.color = this.mainTextColor;
      });
      
      // Apply color to active language text
      const activeLanguage = this.shadowRoot.querySelector('.active-language');
      if (activeLanguage) {
        activeLanguage.style.color = this.secondaryTextColor;
      }
      
      // Set SVG icon color to match main text
      const languageIcon = this.shadowRoot.querySelector('.language-icon');
      if (languageIcon) {
        // For white icon
        if (this.mainTextColor === '#fff' || this.mainTextColor === 'white') {
          // No filter needed for white icon
          this.shadowRoot.host.style.setProperty('--icon-filter', 'none');
        } else if (this.mainTextColor === '#000' || this.mainTextColor === 'black') {
          // Invert for black
          this.shadowRoot.host.style.setProperty('--icon-filter', 'invert(1)');
        } else {
          // For other colors, we'd ideally replace the SVG or use more complex filters
          // This is just a simple approach that works for basic colors
          this.shadowRoot.host.style.setProperty('--icon-filter', 
            `brightness(0) saturate(100%) invert(1) sepia(0) saturate(1) hue-rotate(0deg) brightness(1)`);
        }
      }
    }
  
    setupEventListeners() {
      // Handle hamburger menu toggle
      const hamburger = this.shadowRoot.querySelector('.hamburger');
      const navMenu = this.shadowRoot.querySelector('.nav-menu');
      
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        this.menuOpen = !this.menuOpen;
      });
  
      // Close menu when clicking a nav link (mobile)
      const navLinks = this.shadowRoot.querySelectorAll('.nav-menu a:not(.language-content a)');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (this.menuOpen) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            this.menuOpen = false;
          }
        });
      });
  
      // Language dropdown toggle for mobile
      const languageDropdown = this.shadowRoot.querySelector('.language-dropdown');
      languageDropdown.addEventListener('click', (e) => {
        // Only handle clicks directly on the dropdown, not its children
        if ((e.target === languageDropdown || e.target.closest('.language-dropdown') === languageDropdown) && 
            !e.target.closest('.language-content')) {
          // Only toggle dropdown on mobile
          if (window.innerWidth <= 767) {
            e.preventDefault();
            e.stopPropagation();
            languageDropdown.classList.toggle('active');
            
            // Add touchactive class for mobile hover effect
            languageDropdown.classList.toggle('touchactive');
          }
        }
      });
  
      // Handle language selection
      const languageLinks = this.shadowRoot.querySelectorAll('.language-content a');
      languageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const selectedLang = link.getAttribute('data-lang');
          this.changeLanguage(selectedLang);
  
          // Close language dropdown on mobile
          if (window.innerWidth <= 767) {
            languageDropdown.classList.remove('active');
            languageDropdown.classList.remove('touchactive');
          }
  
          // Dispatch event to notify parent page of language change
          const event = new CustomEvent('languagechange', {
            bubbles: true,
            composed: true,
            detail: { language: selectedLang }
          });
          this.dispatchEvent(event);
        });
      });
  
      // Close both mobile menu and language dropdown when clicking outside
      document.addEventListener('click', (e) => {
        // Get references to elements
        const navMenu = this.shadowRoot.querySelector('.nav-menu');
        const hamburger = this.shadowRoot.querySelector('.hamburger');
        const languageDropdown = this.shadowRoot.querySelector('.language-dropdown');
        
        // Check if click is outside the navigation elements
        if (!e.composedPath().includes(this)) {
          // Close the mobile menu if it's open
          if (this.menuOpen) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            this.menuOpen = false;
          }
          
          // Close the mobile language dropdown if it's open
          if (window.innerWidth <= 767) {
            languageDropdown.classList.remove('active');
            languageDropdown.classList.remove('touchactive');
          }
        }
      });
      
      // Add touchstart event for better mobile experience
      if ('ontouchstart' in window) {
        languageDropdown.addEventListener('touchstart', (e) => {
          if (window.innerWidth <= 767 && 
              (e.target === languageDropdown || e.target.closest('.language-dropdown') === languageDropdown) && 
              !e.target.closest('.language-content')) {
            e.preventDefault();
            languageDropdown.classList.toggle('touchactive');
          }
        });
      }
    }
  
    changeLanguage(lang) {
      // Update the active language display in the navbar
      const activeLanguage = this.shadowRoot.querySelector('#active-language');
      activeLanguage.textContent = lang;
      
      // Update navigation item text if we have access to languageData
      if (window.languageData && window.languageData[lang]) {
        const navHome = this.shadowRoot.querySelector('#nav-home');
        const navResources = this.shadowRoot.querySelector('#nav-resources');
        const navCalendar = this.shadowRoot.querySelector('#nav-calendar');
        const navSupport = this.shadowRoot.querySelector('#nav-support');
        const navAbout = this.shadowRoot.querySelector('#nav-about');
        const title = this.shadowRoot.querySelector('#title');
        
        if (navHome && window.languageData[lang].navHome) {
          navHome.textContent = window.languageData[lang].navHome;
        }
        
        if (navResources && window.languageData[lang].navResources) {
          navResources.textContent = window.languageData[lang].navResources;
        }
        
        if (navCalendar && window.languageData[lang].navCalendar) {
          navCalendar.textContent = window.languageData[lang].navCalendar;
        }
        
        if (navSupport && window.languageData[lang].navSupport) {
          navSupport.textContent = window.languageData[lang].navSupport;
        }
        
        if (navAbout && window.languageData[lang].navAbout) {
          navAbout.textContent = window.languageData[lang].navAbout;
        }
        
        if (title && window.languageData[lang].Title) {
          title.textContent = window.languageData[lang].Title;
        }
      }
      
      // Store the selected language in localStorage for persistence
      localStorage.setItem('preferredLanguage', lang);
    }
  
    // Public methods for setting colors
    setTextColor(color) {
      this.mainTextColor = color;
      this.updateColors();
    }
    
    setSecondaryTextColor(color) {
      this.secondaryTextColor = color;
      this.updateColors();
    }
    
    setLanguageSelectorTextColor(color) {
      // This method is kept for backward compatibility,
      // but we now always use black for language dropdown items
      console.warn('Language dropdown text is now always black for better readability');
    }
  
    setBottomBorderColor(color) {
      this.borderColor = color;
      this.updateColors();
    }
    
    // Set mobile language text color (for items in the dropdown when in mobile view)
    setMobileLanguageTextColor(color) {
      // This method is kept for backward compatibility,
      // but we now always use black for language dropdown items
      console.warn('Language dropdown text is now always black for better readability');
    }
    
    // Allow parent page to set language programmatically
    setLanguage(lang) {
      this.changeLanguage(lang);
    }
  }
  
  // Register the custom element
  customElements.define('site-navbar', SiteNavbar);
  
  // Function to initialize the navbar with specific colors and event listeners
  function initializeNavbar(navbarId, textColor, secondaryTextColor, languageTextColor, borderColor, mobileLanguageTextColor) {
    document.addEventListener('DOMContentLoaded', function() {
      // Get reference to the navbar component by ID
      const navbar = document.getElementById(navbarId);
  
      if (!navbar) {
        console.warn(`Navbar element with ID "${navbarId}" not found`);
        return;
      }
  
      // Set main text color for navigation items
      if (typeof navbar.setTextColor === 'function') {
        navbar.setTextColor(textColor);
      }
      
      // Set secondary text color (for active language display)
      if (typeof navbar.setSecondaryTextColor === 'function') {
        navbar.setSecondaryTextColor(secondaryTextColor);
      }
  
      // Set text color specifically for language dropdown items in desktop view
      if (typeof navbar.setLanguageSelectorTextColor === 'function') {
        navbar.setLanguageSelectorTextColor(languageTextColor);
      }
      
      // Set text color for mobile language dropdown items
      if (typeof navbar.setMobileLanguageTextColor === 'function') {
        navbar.setMobileLanguageTextColor(mobileLanguageTextColor || textColor);
      }
  
      // Set bottom border color
      if (typeof navbar.setBottomBorderColor === 'function') {
        navbar.setBottomBorderColor(borderColor);
      }
  
      // Listen for language change events from the navbar
      navbar.addEventListener('languagechange', function(event) {
        const selectedLang = event.detail.language;
  
        // Call your existing language change function
        if (typeof changeLanguage === 'function') {
          changeLanguage(selectedLang);
        }
      });
  
      // Check for saved language preference
      const savedLanguage = localStorage.getItem('preferredLanguage');
      if (savedLanguage) {
        if (typeof navbar.setLanguage === 'function') {
          navbar.setLanguage(savedLanguage);
        }
  
        if (typeof changeLanguage === 'function') {
          changeLanguage(savedLanguage);
        }
      }
    });
  }
  