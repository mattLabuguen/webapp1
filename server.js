const express = require('express')
const app = express()
const weather = require('weather-js');
const { response } = require('express');
const fetch = require('node-fetch');
const path = require('path');
const randomCountryName = require("random-country-name");

const { get } = require('http');
const util = require('util');

const findWeather = util.promisify(weather.find);

var weatherData = [];
var countryData = [];
var currentDay = getCurrentDay();
var randomCountry = randomCountryName.random();
var urlRestCountries = 'https://restcountries.eu/rest/v2/name/'+randomCountry;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res){
  setData().then(result =>{
    res.render('index', {pageTitle: 'Home', wData: weatherData, cData: countryData, dayNow : currentDay});
  }).catch(err => {
    console.log("ERROR: " + err);
    res.redirect('/');
  });
})

app.get('/other', function (req, res) {
    res.render('other', {pageTitle: 'Other'});
})

async function setData(){
  randomCountry = await randomCountryName.random();
  urlRestCountries = 'https://restcountries.eu/rest/v2/name/'+randomCountry;
  countryData = await fetchCountryData();
}

async function fetchWeatherData(countryData){
  var location = countryData[0].capital + ", " + randomCountry;
  const data = await findWeather({ search: location, degreeType: 'C'});
  weatherData = data;
  return data;
}

async function fetchCountryData(){
  const response = await fetch(urlRestCountries);
  const data = await response.json();
 
  await fetchWeatherData(data);
  return data;
}

function getCurrentDay(){
  var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var currentDate = new Date();
  var currentDay = currentDate.getDay();

  return weekdays[currentDay];
}

app.listen(3000);