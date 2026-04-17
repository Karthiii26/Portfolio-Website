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
                
                const current = location.pathname.split("/").pop() || "index.html";
                document.querySelectorAll("#navbar nav a, #navbar .menu a").forEach(link => {
                    const href = link.getAttribute("href");
                    if (href === current || (href === "index.html" && current === "")) {
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
            
            // Add Stylesheet
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
