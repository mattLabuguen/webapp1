const express = require('express')
const app = express()
const weather = require('weather-js');
const { response } = require('express');
const fetch = require('node-fetch');
const path = require('path');

var weatherData;
var countryCode;
var currentDay;

getWeatherData();
currentDay = getCurrentDay();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res){
  res.render('index', {pageTitle: 'Home', data: weatherData, code: countryCode, dayNow : currentDay});
})

app.get('/other', function (req, res) {
  res.render('other', {pageTitle: 'Other', code: countryCode});
})

async function getCountryCode(location){
  var country = location.split(",")[1].trim();
  var urlRestCountries = 'https://restcountries.eu/rest/v2/name/'+country;
  var countryData;

  await fetch(urlRestCountries).then(res => res.json()).then(data => {
    countryCode = data[0].alpha2Code;
  }).catch(err=> console.log("Error: " + err));
}

function getWeatherData(){
  weather.find({search: 'Tokyo, Japan', degreeType: 'C'}, function(err, result) {
    if(err) console.log(err);
    weatherData = result;
    getCountryCode(weatherData[0].location["name"]);
  });
}

function getCurrentDay(){
  var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var currentDate = new Date();
  var currentDay = currentDate.getDay();

  return weekdays[currentDay];
}
 
app.listen(3000)