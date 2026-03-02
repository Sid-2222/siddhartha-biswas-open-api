async function getWeather() {
    const city = document.getElementById("cityInput").value;

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    try {
        // Get latitude & longitude
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );
        const geoData = await geoRes.json();

        if (!geoData.results) {
            alert("City not found");
            return;
        }

        const { latitude, longitude } = geoData.results[0];
		console.log(geoData.results[0]);

        // Get weather
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&current_weather=true&timezone=auto`
        );
		//&current_weather=true
		//https://api.open-meteo.com/v1/forecast?latitude=-34.125&longitude=-56.25&hourly=temperature_2m,weathercode&current_weather=true&timezone=auto
        const weatherData = await weatherRes.json();
		

        const temperature = weatherData.current_weather.temperature;
        const windSpeed = weatherData.current_weather.windspeed;
        const weatherCode = weatherData.current_weather.weathercode;
		const locationName = weatherData.timezone;
		
		document.getElementById("location").textContent = geoData.results[0].name + " , "+ geoData.results[0].country;;
        document.getElementById("temp").textContent = temperature;
        document.getElementById("wind").textContent = windSpeed;

        const icon = document.getElementById("icon");

        // Weather code mapping
        if (weatherCode === 0) {
            icon.textContent = "☀️"; // Clear sky
        } 
        else if ([1, 2, 3].includes(weatherCode)) {
            icon.textContent = "⛅"; // Partly cloudy
        } 
        else if ([45, 48].includes(weatherCode)) {
            icon.textContent = "🌫️"; // Fog
        } 
        else if ([51,53,55,61,63,65,80,81,82].includes(weatherCode)) {
            icon.textContent = "🌧️"; // Rain
        } 
        else if ([71,73,75,85,86].includes(weatherCode)) {
            icon.textContent = "❄️"; // Snow
        } 
        else {
            icon.textContent = "🌤️"; // Default
        }

    } catch (error) {
        console.error(error);
        alert("Something went wrong");
    }
}