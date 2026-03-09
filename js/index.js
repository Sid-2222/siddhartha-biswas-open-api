
let globalLatitude;
let globalLongitude;

async function getCity() {
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

        document.getElementById("templink").style.display = "inline";
        document.getElementById("conditionlink").style.display = "inline";
        const { latitude, longitude } = geoData.results[0];
        globalLatitude=latitude; // setting lat long value to global variable 
        globalLongitude=longitude;
		//console.log(geoData.results[0]);

        // get history

        const historyRes = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${geoData.results[0].country}`
        );		
        const historyData = await historyRes.json();
       
		//set data to view
		document.getElementById("location").textContent = "Location: "+ geoData.results[0].name + " , "+ geoData.results[0].country;;
        document.getElementById("history").textContent ="Little History: "+  geoData.results[0].name+" is in " + historyData.extract;
        document.getElementById("temp").style.display = "none";
        document.getElementById("wind").style.display = "none";
        document.getElementById("guide").textContent= "Click Temperature or Weather Condition to get information"


    } catch (error) {
        console.error(error);
        alert("Something went wrong in get city");
    }
}

document.getElementById("templink").addEventListener("click", () =>{
         document.getElementById("temp").style.display = "inline";
         document.getElementById("wind").style.display = "inline";
    
        async function getTemp(){
            try{
                // Get weather.
                const weatherRes = await fetch(
                      
                    `https://api.open-meteo.com/v1/forecast?latitude=${globalLatitude}&longitude=${globalLongitude}&current_weather=true&hourly=temperature_2m,windspeed_10m&timezone=auto`

                   );
               
                const weatherData = await weatherRes.json();
                console.log("inside temp link click");
                console.log(weatherData);
                const temperature = weatherData.current_weather.temperature;
                const windSpeed = weatherData.current_weather.windspeed;
            
           function cToF(celsius) {
                return ((celsius * 9/5) + 32).toFixed(2); 
                }

                document.getElementById("temp").textContent ="Current Temperature: "+cToF(temperature) + " °F";
                document.getElementById("wind").textContent ="Current Wind Speed: "+ windSpeed + " km/h";


            }catch (error) {
                console.error(error);
                alert("Something went wrong while temp check");
            }
    }
    getTemp();

});

document.getElementById("conditionlink").addEventListener("click", () =>{

             document.getElementById("temp").style.display = "inline";
             document.getElementById("wind").style.display = "inline";
     
        async function getCondition(){
            try{
                // Get weather
                const weatherRes = await fetch(
                    
                    `https://api.open-meteo.com/v1/forecast?latitude=${globalLatitude}&longitude=${globalLongitude}&current_weather=true&hourly=temperature_2m,windspeed_10m,winddirection_10m,weathercode&timezone=auto`
                  );
                
                const weatherData = await weatherRes.json();
                console.log("inside condition nav");
                console.log(weatherData);
                const weatherCode = weatherData.current_weather.weathercode;
                const windDirection = weatherData.current_weather.winddirection;

                function degToFullCompass(deg) {
                const dirs = [
                    "North","North-Northeast","Northeast","East-Northeast","East",
                    "East-Southeast","Southeast","South-Southeast","South","South-Southwest",
                    "Southwest","West-Southwest","West","West-Northwest","Northwest","North-Northwest"
                     ];
                const index = Math.floor((deg / 22.5) + 0.5) % 16;
                return dirs[index];
            }

            const allWeatherCodes = {
                0: "Clear sky",
                1: "Mainly clear",
                2: "Partly cloudy",
                3: "Overcast",

                45: "Fog",
                48: "Depositing rime fog",

                51: "Light drizzle",
                53: "Moderate drizzle",
                55: "Dense drizzle",
                56: "Light freezing drizzle",
                57: "Dense freezing drizzle",

                61: "Slight rain",
                63: "Moderate rain",
                65: "Heavy rain",
                66: "Light freezing rain",
                67: "Heavy freezing rain",

                71: "Slight snowfall",
                73: "Moderate snowfall",
                75: "Heavy snowfall",
                77: "Snow grains",

                80: "Slight rain showers",
                81: "Moderate rain showers",
                82: "Violent rain showers",

                85: "Slight snow showers",
                86: "Heavy snow showers",

                95: "Thunderstorm",
                96: "Thunderstorm with slight hail",
                99: "Thunderstorm with heavy hail"
                };

                document.getElementById("temp").textContent ="Current Weather Condition: "+ allWeatherCodes[weatherCode];
                document.getElementById("wind").textContent ="Current Wind Direction: " + degToFullCompass(windDirection);



            }catch (error) {
        console.error(error);
        alert("Something went wrong while condition ckeck");
         }
    }
    getCondition();

});