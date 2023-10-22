let searchCity = document.getElementById("floatingInput");
let resoponseContent = document.getElementById("sub-content");
let searchBtn = document.getElementById("search-btn");

let niz = [];
let podaciOGradu = [];
let forecast = [];

let limit = 1;
let cnt = 5;


searchBtn.addEventListener("click", () => {
    if(searchCity.value != ""){
        axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${searchCity.value}&limit=${limit}&appid=91ee46f30365bc76661c87560236a13b`,{}).then((response) => {

        niz = response.data;

        console.log(niz);

        let latitude = niz[0].lat;
        let londitude = niz[0].lon;

        console.log(latitude + " " + londitude);

        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${londitude}&units=metric&appid=91ee46f30365bc76661c87560236a13b`,{}).then((response) => {

            podaciOGradu = response.data;

            console.log(podaciOGradu);
            let visibility = podaciOGradu.visibility * 0.001;

            let sunrise = unixTimeSunrise(podaciOGradu.sys.sunrise);

            let sunset = unixTimeSunset(podaciOGradu.sys.sunset);

            let date = unixTimeDate(podaciOGradu.sys.sunrise);

            let icon = podaciOGradu.weather[0].icon;

            let cityDetails = `
            <div id="response-content">
                <h2 id="city">${niz[0].name}</h2>
                <img src='https://openweathermap.org/img/wn/${icon}@2x.png'><span id="temp">${podaciOGradu.main.temp}&#8451</span>
                <p id="temp-feels">Feels like <span>${podaciOGradu.main.feels_like}&#8451.</span> <span id="weather-main">${podaciOGradu.weather[0].main}.</span><span id="weather-desc"> ${podaciOGradu.weather[0].description}</span></p>
                <p id="temp-feels">Current date: ${date}</p>
                <div id="list-div">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><img src="/images/sunrise.png" alt="">Sunrise: ${sunrise}</li>
                        <li class="list-group-item"><img src="/images/icons8-wind-50.png" alt="">Wind: ${podaciOGradu.wind.speed}m/s W</li>
                        <li class="list-group-item"><img src="/images/icons8-pressure-24.png" alt="">Pressure: ${podaciOGradu.main.pressure}Pa</li>
                        <li class="list-group-item"><img src="/images/icons8-humidity-50.png" alt="">Humidity: ${podaciOGradu.main.humidity}%</li>
                    </ul>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><img src="/images/sunset.png" alt="">Sunset: ${sunset}</li>
                        <li class="list-group-item"><img src="/images/icons8-temperature-low-32.png" alt="">Lowest temp: ${podaciOGradu.main.temp_min}&#8451</li>
                        <li class="list-group-item"><img src="/images/icons8-temperature-high-32.png" alt="">Highest temp: ${podaciOGradu.main.temp_max}&#8451</li>
                        <li class="list-group-item"><img src="/images/icons8-eye-30.png" alt="">Visibility: ${visibility}km</li>
                    </ul>
                </div>

                <div id="map">

                </div>
            </div>
            `;

            resoponseContent.innerHTML = cityDetails;
            resoponseContent.style.opacity = 1;

            map(latitude, londitude);
            })
        })
    }else{
        alert("Enter a city")
    }
})

function map(latitude, londitude){
    var map = L.map('map').setView([latitude, londitude], 12);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            var marker = L.marker([latitude, londitude]).addTo(map);

            var marker = L.marker([latitude, londitude]).addTo(map);

            var circle = L.circle([latitude, londitude], {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.5,
                radius: 2000
            }).addTo(map);

            marker.bindPopup(`<b>Hello!</b><br>${niz[0].name}.`).openPopup();

            function onMapClick(e) {
                alert("You clicked the map at " + e.latlng);
                console.log(e.latlng.lat);
            }
            
            map.on('click', onMapClick);
}

function unixTimeSunrise(time){
    let unix = time;

    let date = new Date(unix * 1000);

    let hours = date.getHours();

    let minutes = "0" + date.getMinutes();

    let seconds = "0" + date.getSeconds();

    let formattedTime = hours + ':' + minutes.substr(-2) + ":" + seconds.substr(-2);

    return formattedTime;
}

function unixTimeSunset(time){
    let unix = time;

    let date = new Date(unix * 1000);

    let hours = date.getHours();

    let minutes = "0" + date.getMinutes();

    let seconds = "0" + date.getSeconds();

    let formattedTime = hours + ':' + minutes.substr(-2) + ":" + seconds.substr(-2);

    return formattedTime;
}

function unixTime(time){

    let unix = time;

    let date = new Date(unix * 1000);

    let session = "PM";
    let todaysDateH = date.getHours();
    let todaysDateM = date.getMinutes();

    if(todaysDateH > 12){
        todaysDateH = todaysDateH - 12;
        session = "PM";
    }else{
        session = "AM";
    }

    return todaysDateH + ":" + todaysDateM + " " + session;
}
function unixTimeDate(time){

    let unix = time;

    let date = new Date(unix * 1000);

    let todaysDate = date.toLocaleDateString('en-ca');

    return todaysDate;
}

