{
    const WEATHER_API_KEY = '';

    function startWeather() {
        initWeatherAutomation();
        setInterval(() => {
            initWeatherAutomation();
        }, 10 * 60 * 1000); 
        
        if (!document.getElementById('nav-weather')) {
            const observer = new MutationObserver((mutations, obs) => {
                const widget = document.getElementById('nav-weather');
                if (widget) {
                    initWeatherAutomation();
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startWeather);
    } else {
        startWeather();
    }

    async function initWeatherAutomation() {
        const widget = document.getElementById('nav-weather');
        if (!widget) return;

        const cached = localStorage.getItem('portfolio_weather');
        if (cached) {
            try {
                const { temp, condition } = JSON.parse(cached);
                updateNavWidget(temp, condition);
                widget.classList.add('visible');
            } catch (e) {
                localStorage.removeItem('portfolio_weather');
            }
        }

        try {
            const geoRes = await fetch("https://get.geojs.io/v1/ip/geo.json");
            const geoData = await geoRes.json();
            const lat = geoData.latitude;
            const lon = geoData.longitude;
            
            if (!lat || !lon) throw new Error('Location detection failed');

            let weatherRes;
            if (WEATHER_API_KEY) {
                weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
            } else {
                weatherRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
            }

            if (!weatherRes.ok) throw new Error('Weather fetch failed');
            
            const data = await weatherRes.json();
            const temp = Math.round(data.main.temp);
            const condition = data.weather[0].main;
            localStorage.setItem('portfolio_weather', JSON.stringify({
                temp,
                condition,
                timestamp: Date.now()
            }));
            
            updateNavWidget(temp, condition);
            widget.classList.add('visible');

        } catch (e) {
            if (!cached) widget.style.display = 'none';
        }
    }

    function updateNavWidget(temp, condition) {
        const widget = document.getElementById('nav-weather');
        if (!widget) return;

        let iconHtml = '';
        const c = condition.toLowerCase();

        if (c.includes('thunderstorm')) {
            iconHtml = '<div class="weather-icon"><div class="icon-thunder"></div></div>';
        } else if (c.includes('rain') || c.includes('drizzle')) {
            iconHtml = '<div class="weather-icon"><div class="icon-rain"><div class="icon-cloud"></div></div></div>';
        } else if (c.includes('snow')) {
            iconHtml = '<div class="weather-icon"><div class="icon-snow"></div></div>';
        } else if (c.includes('clear') || c.includes('sun')) {
            iconHtml = '<div class="weather-icon"><div class="icon-sun"></div></div>';
        } else if (c.includes('haze') || c.includes('mist') || c.includes('fog') || c.includes('smoke') || c.includes('dust') || c.includes('sand') || c.includes('ash') || c.includes('squall') || c.includes('tornado')) {
            iconHtml = '<div class="weather-icon"><div class="icon-haze"><span></span><span></span><span></span></div></div>';
        } else if (c.includes('cloud')) {
            iconHtml = '<div class="weather-icon"><div class="icon-cloud"></div></div>';
        } else {
            iconHtml = '<div class="weather-icon"><div class="icon-cloud"></div></div>';
        }

        widget.innerHTML = `${iconHtml} <span>${temp}°C</span>`;
    }
}
