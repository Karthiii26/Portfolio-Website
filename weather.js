{
    const WEATHER_API_KEY = '';

    function mapWmoCodeToCondition(code) {
        if (code === 0) return 'clear';
        if (code >= 1 && code <= 3) return 'cloud';
        if (code === 45 || code === 48) return 'haze';
        if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65) || (code >= 80 && code <= 82)) return 'rain';
        if (code >= 71 && code <= 77) return 'snow';
        if (code >= 95 && code <= 99) return 'thunderstorm';
        return 'cloud';
    }

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
                const { temp, condition, timestamp } = JSON.parse(cached);
                updateNavWidget(temp, condition);
                widget.classList.add('visible');
                
                // If cache is less than 15 minutes old, skip refetching
                if (timestamp && (Date.now() - timestamp < 15 * 60 * 1000)) {
                    return;
                }
            } catch (e) {
                localStorage.removeItem('portfolio_weather');
            }
        }

        try {
            let lat = 13.0827; // Default to Chennai
            let lon = 80.2707;
            
            try {
                const geoRes = await fetch("https://get.geojs.io/v1/ip/geo.json");
                if (geoRes.ok) {
                    const geoData = await geoRes.json();
                    if (geoData.latitude && geoData.longitude) {
                        lat = geoData.latitude;
                        lon = geoData.longitude;
                    }
                }
            } catch (geoError) {
                console.warn("Geolocation failed, using default location:", geoError);
            }

            let temp, condition;
            try {
                let weatherRes;
                if (WEATHER_API_KEY) {
                    weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
                } else {
                    weatherRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
                }

                if (!weatherRes.ok) throw new Error('Primary weather API returned non-OK');
                
                const data = await weatherRes.json();
                temp = Math.round(data.main.temp);
                condition = data.weather[0].main;
            } catch (primaryError) {
                console.warn("Primary weather API failed, trying Open-Meteo fallback:", primaryError);
                const fallbackRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
                if (!fallbackRes.ok) throw new Error('All weather APIs failed');
                
                const data = await fallbackRes.json();
                temp = Math.round(data.current_weather.temperature);
                const code = data.current_weather.weathercode;
                condition = mapWmoCodeToCondition(code);
            }

            localStorage.setItem('portfolio_weather', JSON.stringify({
                temp,
                condition,
                timestamp: Date.now()
            }));
            
            updateNavWidget(temp, condition);
            widget.classList.add('visible');

        } catch (e) {
            console.error("Weather automation failed completely:", e);
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
