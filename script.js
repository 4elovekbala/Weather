window.addEventListener("load", () => {
   let input = document.querySelector(".input"),
      wrapper = document.querySelector(".card__wrapper");
   const date = new Date().toLocaleString('ru', {
      month: 'long',
      weekday: 'long',
      day: 'numeric',
   });

   // card pattern
   function patternFirstCard(lat, lon, timezone, max, min, main, desc, icon) {
      timezone = timezone.indexOf("/") != -1 ? timezone.slice(timezone.indexOf("/") + 1, timezone.length) : timezone;
      return `
      <div class="card__wrapper">
         <div class="card" data-lat=${lat != undefined ? lat : false} data-lon=${lon != undefined ? lon : false}>
                  <div class="first__block">
                        <h2 class="h2 date">${date}</h2>
                        <h2 class="h2">${timezone}</h2>
                        <h3 class="h4">Температура max: ${Math.round(max - 273) + '&deg;'}</h3>
                        <h3 class="h4">Температура min: ${Math.round(min - 273) + '&deg;'}</h3>
                        <button class="btn btn__more" id="${timezone}">See more</button>
                     </div>
                     <div class="second__block">
                     <h2 class="h4 weather">${main}</h2>
                     <h4 class="h4 weather">${desc}</h4>
                     <img class="icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" /> 
                     </div>
               </div>
      </div>`;
   }

   // mini card pattern
   function createCard(lat, lon, today, timezone, max, min, main, desc, icon) {
      return `<div class="card__mini" data-lat=${lat} data-lon=${lon}>
         <div class="first__block">
            <h2 class="h2__mini date">${today}</h2>
            <h2 class="h2__mini">${timezone}</h2>
            <h3 class="h4__mini">Температура max: ${Math.round(max - 273) + '&deg;'}</h3>
            <h3 class="h4__mini">Температура min: ${Math.round(min - 273) + '&deg;'}</h3>
         </div>
         <div class="second__block">
            <h2 class="h4__mini weather">${main}</h2>
            <h4 class="h4__mini weather">${desc}</h4>
            <img class="icon__mini" src="https://openweathermap.org/img/wn/${icon}@2x.png" />
         </div>
      </div>`;
   }


   function firstCard(lat, lon) {
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${Math.round(lat)}&lon=${Math.round(lon)}&exclude=hourly,minutely&appid=37421bdf14aeff7cbfd1a2a28f6f4878`)
         .then(response => response.json())
         .then(data => {
            wrapper.innerHTML += patternFirstCard(lat, lon, data.timezone,
               data.daily[0].temp.max, data.daily[0].temp.min, data.daily[0].weather[0].main,
               data.daily[0].weather[0].description, data.daily[0].weather[0].icon);
         })
   }

   // get geo and first 
   function firstShowWeather() {
      let geoloaction = navigator.geolocation;
      if (geoloaction) {
         geoloaction.getCurrentPosition(position => {
            firstCard(position.coords.latitude, position.coords.longitude);
         }, error => {
            alert(error);
         });
      }
   }


   // search by input
   function searchByInput(value) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=37421bdf14aeff7cbfd1a2a28f6f4878`)
         .then(response => response.json())
         .then(data => {
            console.log(data);
            wrapper.innerHTML += patternFirstCard(data.coord.lat, data.coord.lon, data.name,
               data.main.temp_max, data.main.temp_min, data.weather[0].main,
               data.weather[0].description, data.weather[0].icon);
         });
      input.value = "";
   }

   //search by attr
   function searhByAttr(lat, lon, container) {
      let inner = document.createElement("div");
      inner.setAttribute("class", "card__wrapper__mini");
      container.appendChild(inner);
      let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${Math.round(lat)}&lon=${Math.round(lon)}&exclude=hourly,minutely&appid=37421bdf14aeff7cbfd1a2a28f6f4878`;
      fetch(url)
         .then(response => response.json())
         .then(data => {
            let timezone = data.timezone.indexOf("/") != -1 ? data.timezone.slice(data.timezone.indexOf("/") + 1, data.timezone.length) : data.timezone;;
            for (let i = 0; i < 5; i++) {
               let dateOfFiveDays = (data.daily[i].dt * 1000);
               today = new Date(dateOfFiveDays).toLocaleString("ru", {
                  month: 'long',
                  weekday: 'long',
                  day: 'numeric',
               });
               inner.innerHTML += createCard(lat, lon, today, timezone,
                  data.daily[i].temp.max, data.daily[i].temp.min, data.daily[i].weather[0].main,
                  data.daily[i].weather[0].description, data.daily[i].weather[0].icon);
            }
         });
   }
   //initialize
   firstShowWeather();
   window.addEventListener("click", (e) => {
      let lat = e.target.parentElement.parentElement.getAttribute("data-lat");
      let lon = e.target.parentElement.parentElement.getAttribute("data-lon");
      if (e.target.className == "btn btn__more") {
         searhByAttr(lat, lon, e.target.parentElement.parentElement.parentElement);
      } else if (e.target.className == "btn") {
         searchByInput(input.value)
      }
   })
})