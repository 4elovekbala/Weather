window.addEventListener("load", () => {
   let input = document.querySelector(".input"),
      wrapper = document.querySelector(".card__wrapper");

   function createCard(today, timezone, max, min, main, description, icon, mini, lat, lon) {
      if (mini == true) {
         return `<div class="card__mini" data-lat=${lat} data-lon=${lon}>
            <div class="first__block">
               <h2 class="h2__mini date">${today}</h2>
               <h2 class="h2__mini">${timezone}</h2>
               <h3 class="h4__mini">Температура max: ${Math.round(max - 273) + '&deg;'}</h3>
               <h3 class="h4__mini">Температура min: ${Math.round(min - 273) + '&deg;'}</h3>
            </div>
            <div class="second__block">
               <h2 class="h4__mini weather">${main}</h2>
               <h4 class="h4__mini weather">${description}</h4>
               <img class="icon__mini" src="https://openweathermap.org/img/wn/${icon}@2x.png" />
            </div>
         </div>`;
      } else {
         return `<div class="card" data-lat=${lat} data-lon=${lon}>
                     <div class="first__block">
                           <h2 class="h2 date">${today}</h2>
                           <h2 class="h2">${timezone}</h2>
                           <h3 class="h4">Температура max: ${Math.round(max - 273) + '&deg;'}</h3>
                           <h3 class="h4">Температура min: ${Math.round(min - 273) + '&deg;'}</h3>
                           <button class="btn btn__more" id="${timezone}">See more</button>
                        </div>
                        <div class="second__block">
                        <h2 class="h4 weather">${main}</h2>
                        <h4 class="h4 weather">${description}</h4>
                           <img class="icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" /> 
                        </div>
                  </div>`;
      }
   }

   function fiveDays(lat, lon) {
      var newDiv = document.createElement("div");
      newDiv.classList.add("card__wrapper__mini");
      wrapper.appendChild(newDiv);
      let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${Math.round(lat)}&lon=${Math.round(lon)}&exclude=hourly,minutely&appid=37421bdf14aeff7cbfd1a2a28f6f4878`;
      fetch(url).then(response => response.json()).then(data => {
         show(data, true, newDiv);
      });
   }

   function oneDay(value) {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=37421bdf14aeff7cbfd1a2a28f6f4878`;
      fetch(url)
         .then(response => response.json())
         .then(data => {
            show(data, false, null);
         });
      input.value = "";
   }

   function getGeo() {
      let geoloaction = navigator.geolocation;
      if (geoloaction) {
         geoloaction.getCurrentPosition(position => {
            let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${Math.round(position.coords.latitude)}&lon=${Math.round(position.coords.longitude)}&exclude=hourly,minutely&appid=37421bdf14aeff7cbfd1a2a28f6f4878`;
            fetch(url)
               .then(response => response.json())
               .then(data => {
                  let date = new Date(data.current.dt) * 1000;
                  let options = {
                     month: 'long',
                     weekday: 'long',
                     day: 'numeric',
                  };
                  let today = new Date(date).toLocaleString("ru", options);
                  wrapper.innerHTML += createCard(today, data.timezone,
                     data.daily[0].temp.max, data.daily[0].temp.min, data.daily[0].weather[0].main,
                     data.daily[0].weather[0].description, data.daily[0].weather[0].icon, false, data.lat, data.lon);
               });
         }, error => {
            alert(error);
         });

      }
   }

   function show(data, days, container) {
      let date;
      if(days == true) date = (data.dt * 1000);
         date = (data.dt * 1000);
      let options = {
         month: 'long',
         weekday: 'long',
         day: 'numeric',
      };
      let today = new Date(date).toLocaleString("ru", options);
      if (days == true) {
         for (let i = 0; i < 5; i++) {
            date = (data.daily[i].dt * 1000);
            today = new Date(date).toLocaleString("ru", options);
            container.innerHTML += createCard(today, data.timezone,
               data.daily[0].temp.max, data.daily[0].temp.min, data.daily[0].weather[0].main,
               data.daily[0].weather[0].description, data.daily[0].weather[0].icon, true, data.lat, data.lon);
         }
      } else {
         wrapper.innerHTML += createCard(today, data.name,
            data.main.temp_max, data.main.temp_min, data.weather[0].main,
            data.weather[0].description, data.weather[0].icon, false, data.lat, data.lon);
      }
   }
   getGeo();
   window.addEventListener("click", (e) => {
      let lat = e.target.parentElement.parentElement.getAttribute("data-lat");
      let lon = e.target.parentElement.parentElement.getAttribute("data-lon");
      if (e.target.className == "btn btn__more") {
         fiveDays(lat, lon);
      } else if (e.target.className == "btn") {
         oneDay(input.value)
      }
   })
})