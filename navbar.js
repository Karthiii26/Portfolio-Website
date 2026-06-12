function toggleMenu() {
    const menu = document.querySelector('.menu');
    if (menu) menu.classList.toggle('active');
}

(function initNavbar() {
    function loadNavbar() {
        const navContainer = document.getElementById('navbar');
        if (!navContainer) return;

        fetch("navbar.html")
            .then(res => res.text())
            .then(data => {
                navContainer.innerHTML = data;
                
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
            })
            .catch(err => console.error("Navbar failed to load:", err));
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
            const v = Date.now();
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'weather.css?v=' + v;
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.id = 'weather-script';
            script.src = 'weather.js?v=' + v;
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
