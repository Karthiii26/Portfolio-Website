function toggleMenu() {
    const menu = document.querySelector('.menu');
    if (menu) menu.classList.toggle('active');
}

const ASSET_VERSION = '26.4';

const NAVBAR_HTML = `
<header class="navbar">
  <div class="logo">Portfolio</div>
  <div class="main-nav-container">
    <nav>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="skills.html">Skills</a>
      <a href="projects.html">Projects</a>
      <a href="globeperspectives.html">Perspectives</a>
      <a href="platforms.html">Platforms</a>
      <a href="contact.html">Contact</a>
    </nav>

    <div class="nav-right">
      <div id="nav-weather" class="weather-widget"></div>

      <div class="hamburger">
        <img src="photos/menu.svg" alt="hamburger" height="20px" width="20px" onclick="toggleMenu()">
        <div class="menu">
          <a href="index.html">Home</a>
          <a href="about.html">About</a>
          <a href="skills.html">Skills</a>
          <a href="projects.html">Projects</a>
          <a href="globeperspectives.html">Perspectives</a>
          <a href="platforms.html">Platforms</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
    </div>
  </div>
  <div id="scrollTopBtn" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"
      stroke-linejoin="round">
      <path d="m18 15-6-6-6 6" />
    </svg>
  </div>
</header>`;

(function initNavbar() {
    function loadNavbar() {
        const navContainer = document.getElementById('navbar');
        if (!navContainer) return;

        navContainer.innerHTML = NAVBAR_HTML;

        const currentPath = location.pathname.split("/").pop() || "index";
        const currentName = currentPath.replace(".html", "");

        document.querySelectorAll("#navbar nav a, #navbar .menu a").forEach(link => {
            const href = link.getAttribute("href");
            const hrefName = href.replace(".html", "");

            if (hrefName === currentName || (hrefName === "index" && currentName === "")) {
                link.classList.add("active");
            }
        });

        if (typeof initWeatherAutomation === 'function') {
            initWeatherAutomation();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadNavbar);
    } else {
        loadNavbar();
    }
})();

let isScrolling;
window.addEventListener('scroll', () => {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 10);
        if (isAtBottom) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }
    document.body.classList.add('is-scrolling');
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
    }, 1000);
});

(function injectWeather() {
    function doInject() {
        if (!document.getElementById('weather-script') && document.body) {
            if (!document.querySelector('link[href^="weather.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'weather.css?v=' + ASSET_VERSION;
                document.head.appendChild(link);
            }

            const script = document.createElement('script');
            script.id = 'weather-script';
            script.src = 'weather.js?v=' + ASSET_VERSION;
            script.defer = true;
            document.body.appendChild(script);
        }
    }

    if (document.body) {
        doInject();
    } else {
        document.addEventListener('DOMContentLoaded', doInject);
    }
})();

window.showToast = function(message, duration = 2500) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.setProperty('--duration', `${duration}ms`);
    toast.innerHTML = `
        <div class="toast-loader"></div>
        <span>${message}</span>
        <div class="toast-progress"></div>
    `;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    setTimeout(() => {
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 700);
        }
    }, duration);
};
