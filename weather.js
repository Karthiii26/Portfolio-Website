{
    // WARNING: Do NOT hardcode your API key here to avoid GitGuardian alerts and exposure.
    // Instead, use a Vercel Serverless Function (created in api/weather.js).
    // If you are testing locally with live-server, you'll need the key temporarily, but DO NOT commit it.
    const WEATHER_API_KEY = '';
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
        console.log('Weather feature: Initializing weather automation...');
        const widget = document.getElementById('nav-weather');
        if (!widget) {
            console.log('Weather feature: Widget #nav-weather not found in DOM.');
            return;
        }

        try {
            console.log('Weather feature: Fetching location coordinates...');
            const geoRes = await fetch("https://get.geojs.io/v1/ip/geo.json");
            const geoData = await geoRes.json();

            const lat = geoData.latitude;
            const lon = geoData.longitude;
            console.log(`Weather feature: Location detected - Lat: ${lat}, Lon: ${lon}`);
            
            if (!lat || !lon) throw new Error('Location detection failed');

            console.log('Weather feature: Fetching weather data...');
            let weatherRes;
            
            if (WEATHER_API_KEY) {
                // LOCAL DEVELOPMENT FALLBACK
                console.log('Weather feature: Using local API key fallback...');
                weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
            } else {
                // PRODUCTION SECURE ENDPOINT (Vercel)
                console.log('Weather feature: Using secure backend endpoint...');
                weatherRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
            }

            if (!weatherRes.ok) throw new Error('Weather API unauthorized/offline or Secure Endpoint failed');
            
            const data = await weatherRes.json();
            console.log('Weather feature: Weather data received:', data);
            console.log(`Weather feature: Current condition - ${data.weather[0].main} (${data.weather[0].description})`);
            console.log(`Weather feature: Current temperature - ${Math.round(data.main.temp)}°C`);
            
            // 3. Display with smooth animation
            updateNavWidget(Math.round(data.main.temp), data.weather[0].main);
            setTimeout(() => widget.classList.add('visible'), 100);

        } catch (e) {
            console.error('Weather feature error:', e.message);
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
