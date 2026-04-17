{
    const WEATHER_API_KEY = 'ce1e039cf759ec579b18ab125a602bc5';

    function startWeather() {
        initWeatherAutomation();
        
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

        try {
            // 1. Get Location Coordinates (More accurate than just city name)
            const geoRes = await fetch("https://freeipapi.com/api/json");
            const geoData = await geoRes.json();

            const lat = geoData.latitude;
            const lon = geoData.longitude;
            
            if (!lat || !lon) throw new Error('Location detection failed');

            // 2. Get Weather using Coordinates
            const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
            if (!weatherRes.ok) throw new Error('Weather API unauthorized/offline');
            
            const data = await weatherRes.json();
            
            // 3. Display with smooth animation
            updateNavWidget(Math.round(data.main.temp), data.weather[0].main);
            setTimeout(() => widget.classList.add('visible'), 100);

        } catch (e) {
            console.log('Weather automation hidden due to error or offline status.');
            widget.style.display = 'none'; // Completely remove from layout if error
        }
    }

    function updateNavWidget(temp, condition) {
        const widget = document.getElementById('nav-weather');
        if (!widget) return;

        let iconHtml = '';
        const c = condition.toLowerCase();

        // COMPREHENSIVE MAPPING
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
            // FALLBACK
            iconHtml = '<div class="weather-icon"><div class="icon-cloud"></div></div>';
        }

        widget.innerHTML = `${iconHtml} <span>${temp}°C</span>`;
    }
}
