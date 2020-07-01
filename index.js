
//необходимые глобальные переменные для кеширования селектора.
const tempMode = document.getElementById("tempMode");
const tempText = document.getElementById("temp-text");
const windText = document.getElementById("wind-text");
const windText2 = document.getElementById("wind-text2");
const windText3 = document.getElementById("wind-text3");
const windText4 = document.getElementById("wind-text4");
const windText5 = document.getElementById("wind-text5");

// эта функция берет температуру из обработчика данных и отображает температуру в соответствии с правильной единицей измерения температуры, а также отображает температуру теплой или холодной.
function formatTemperature(kelvin) {


  let clicked = false;
  const fahr = ((kelvin * 9 / 5) - 459.67).toFixed(0);
  const cels = (kelvin - 273.15).toFixed(1);
  //инициация индикации температуры
  tempText.innerHTML = cels

  let firstClick = false;
  //щелкните обработчик, чтобы обновить единицу измерения температуры.
  tempMode.addEventListener("click", function () {
    firstClick = true;
    console.log(clicked);
    clicked === false ? clicked = true : clicked = false;
    clicked === true ? tempMode.innerHTML = "F&deg" : tempMode.innerHTML = "C&deg"
    if (clicked) {
      tempText.innerHTML = fahr

    } else
      tempText.innerHTML = cels
  });

  if (cels > 24) {
    document.getElementById("temp-text").style.color = 'red'
  } else if (cels < 18) {
    document.getElementById("temp-text").style.color = 'blue'
  }
}

//обрабатывает данные ответа и форматирует их соответствующим образом, поскольку это асинхронный объект ответа, вся обработка и форматирование данных должны выполняться в этой функции.

function dataHandler(data) {

  formatTemperature(data.main.temp);
  if (data.main.temp && data.sys) {
    // отображение иконки
    if (data.weather) {
      const imgURL = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
      document.getElementById("weatherImg").src = imgURL

      document.getElementById("weather-text").innerHTML = data.weather[0].description
    }
    // скорость ветра
    if (data.wind) {
      const knots = data.wind.speed;
      windText.innerHTML = knots.toFixed(1) + " М/С"
      const knots2 = data.wind.speed * 1.9438445;
      windText2.innerHTML = knots2.toFixed(1) + " Узлов"
    }
    if (data.main) {
      const mm = (data.main.pressure * 0.75006).toFixed(0);
      windText3.innerHTML = mm + " мм.рт.ст."
    }
    if (data.main) {
      const hum3 = data.main.humidity;
      windText4.innerHTML = hum3 + " %"
    }
//определяем направление ветра
    if (data.main) {
      var hum4 = data.wind.deg;
      if (hum4 => 0 && hum4 < 22.5) {
        windText5.innerHTML = "N (North)"
      }
      if (hum4 => 22.5 && hum4 < 67.5) {
        windText5.innerHTML = "N-E (Northeastern)"
      }
      if (hum4 => 67.5 && hum4 < 112.5) {
        windText5.innerHTML = "E (Eastern)"
      }
      if (hum4 => 112.5 && hum4 < 157.5) {
        windText5.innerHTML = "S-E (Southeastern)"
      }
      if (hum4 => 157.5 && hum4 < 202.5) {
        windText5.innerHTML = "S (South)"
      }
      if (hum4 => 202.5 && hum4 < 247.5) {
        windText5.innerHTML = "S-W (Southwest)"
      }
      if (hum4 => 247.5 && hum4 < 292.5) {
        windText5.innerHTML = "W (West)"
      }
      if (hum4 => 292.5 && hum4 < 337.5) {
        windText5.innerHTML = "N-W (Northwest)"
      }
      if (hum4 => 337.5) {
        windText5.innerHTML = "N (North)"
      }
    }
  }
}


const getWeather = async (locdata) => {
//выводим данные IP
  const {city, country, zip, lat, lon, query, org} = locdata
  const apiURI = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=5b58aee62c41eb64fcab16edce2e5cc1"
  if (locdata) {
    document.getElementById("city-text").innerHTML = city
    document.getElementById("city-text2").innerHTML = country
    document.getElementById("city-text3").innerHTML = " Индекс: " + zip
    document.getElementById("city-text4").innerHTML = " Широта: " + lat + " Долгота: " + lon
    document.getElementById("city-text5").innerHTML = " IP: " + query
    document.getElementById("city-text6").innerHTML = " Провайдер: " + org
  } else {
    console.log("fail");
  }

  //делаем запрос на данные о погоде
  let response = await fetch(apiURI);
  if (response.ok) {
    let json = await response.json()
    dataHandler(json)
  }
}

let counter = 0;

const getLocation = async () => {

  //делаем запрос на локализацию устройства
  const response = await fetch("http://ip-api.com/json/")
  if (response.ok) {
    let json = await response.json()
    return json
  } else {
    alert("Ошибка HTTP: " + response.status);
  }
}


setInterval(async () => {
  firstMount()
}, 30000)

const firstMount = async () => {
  const locdata = await getLocation()
  getWeather(locdata)
}
firstMount()

function showDateTime() {
  let now = new Date();
  date.innerHTML = `${now.toLocaleDateString("ru-ru", {day: "numeric", month: "long"})} ${now.getFullYear()} года, `
    + now.toLocaleDateString("ru-ru", {weekday: "long"});
  time.innerHTML = correctTime(now);
}

showDateTime();
setInterval(showDateTime, 1000);

// Общая функция корректного отображения времени.
function correctTime(time) {
  let h = time.getHours(),
    m = time.getMinutes(),
    s = time.getSeconds();
  return `${(h < 10 ? "0" : "") + h}:${(m < 10 ? "0" : "") + m}:${(s < 10 ? "0" : "") + s}`;
}
