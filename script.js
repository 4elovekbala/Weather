let input = document.querySelector(".input"),
   btn = document.querySelector(".btn"),
   wrapper = document.querySelector(".card__wrapper");

function show(data, container) {
   for (let i = 0; i < 5; i++) {
      let date = (data.daily[i].dt * 1000);
      let options = {
         month: 'long',
         weekday: 'long',
         day: 'numeric',
      };
      let today = new Date(date).toLocaleString("ru", options);
      container.innerHTML += `
            <div class="card__mini">
               <div class="first__block">
                  <h2 class="h2__mini date">${today}</h2>
                  <h2 class="h2__mini">${data.timezone}</h2>
                  <h3 class="h4__mini">Температура max: ${Math.round(data.daily[i].temp.max - 273) + '&deg;'}</h3>
                  <h3 class="h4__mini">Температура min: ${Math.round(data.daily[i].temp.min - 273) + '&deg;'}</h3>
               </div>
               <div class="second__block">
                  <h2 class="h4__mini weather">${data.daily[i].weather[0].main}</h2>
                  <h4 class="h4__mini weather">${data.daily[i].weather[0].description}</h4>
                  <img class="icon__mini" src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" />
               </div>
            </div>
   `;
   }
}

function show2(data) {
   console.log(data);
   let date = new Date(data.dt) * 1000;
   let options = {
      month: 'long',
      weekday: 'long',
      day: 'numeric',
   };
   let today = new Date(date).toLocaleString("ru", options);
   wrapper.innerHTML += `
       <div class="card">
         <div class="first__block">
            <h2 class="h2 date">${today}</h2>
            <h2 class="h2">${data.name}</h2>
            <h3 class="h4">Температура max: ${Math.round(data.main.temp_max - 273) + '&deg;'}</h3>
            <h3 class="h4">Температура min: ${Math.round(data.main.temp_min - 273) + '&deg;'}</h3>
            <button class="btn btn__more" id="${data.name}">See more</button>
         </div>
         <div class="second__block">
         <h2 class="h4 weather">${data.weather[0].main}</h2>
         <h4 class="h4 weather">${data.weather[0].description}</h4>
           <img class="icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
         </div>
      </div>
   `;
   let btn = document.getElementById(data.name);
   btn.addEventListener("click", () => {
      fiveDays(Math.round(data.coord.lat), Math.round(data.coord.lon));
   })
}

function findGeo() {
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
               wrapper.innerHTML += `
                     <div class="card">
                     <div class="first__block">
                        <h2 class="h2 date">${today}</h2>
                        <h2 class="h2">${data.timezone}</h2>
                        <h3 class="h4">Температура max: ${Math.round(data.daily[0].temp.max - 273) + '&deg;'}</h3>
                        <h3 class="h4">Температура min: ${Math.round(data.daily[0].temp.min - 273) + '&deg;'}</h3>
                        <button class="btn btn__more" id="${data.timezone}">See more</button>
                     </div>
                     <div class="second__block">
                     <h2 class="h4 weather">${data.daily[0].weather[0].main}</h2>
                     <h4 class="h4 weather">${data.daily[0].weather[0].description}</h4>
                        <img class="icon" src="https://openweathermap.org/img/wn/${data.daily[0].weather[0].icon}@2x.png" /> 
                     </div>
               </div>
               `;
               let btn = document.getElementById(data.timezone);
               btn.addEventListener("click", () => {
                  fiveDays(Math.round(position.coords.latitude), Math.round(position.coords.longitude));
               })
            });
      }, error => {
         alert(error);
      });

   }
}

function oneDay(value) {
   let url = `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=37421bdf14aeff7cbfd1a2a28f6f4878`;
   fetch(url)
      .then(response => response.json())
      .then(data => {
         show2(data);
      });
   input.value = "";
}

function fiveDays(lat, lon) {
   var newDiv = document.createElement("div");
   newDiv.classList.add("card__wrapper__mini");
   wrapper.appendChild(newDiv);
   let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${Math.round(lat)}&lon=${Math.round(lon)}&exclude=hourly,minutely&appid=37421bdf14aeff7cbfd1a2a28f6f4878`;
   fetch(url).then(response => response.json()).then(data => {
      show(data, newDiv);
   });
}

btn.addEventListener("click", () => {
   let value = input.value;
   oneDay(value);
})


findGeo();