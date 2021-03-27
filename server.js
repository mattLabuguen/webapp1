const express = require('express')
const app = express()
const { response } = require('express');
const fetch = require('node-fetch');
const path = require('path');
const bodyParser = require('body-parser');  

const { get } = require('http');
const util = require('util');
const { time } = require('console');
const PersonData = require('./models/person');
const mongoose = require('mongoose');


const db_uri = "mongodb+srv://user:p4$$w0rd@it-elective-4-sa.0iqmw.mongodb.net/personData?retryWrites=true&w=majority";

mongoose.connect(db_uri, { useNewUrlParser: true , useUnifiedTopology: true}).then((result) => console.log("Connected to db")).catch((err) => console.log("error: " + err));

var timeData = {};

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({
  extended: true
}));

app.get('/', function (req, res){
  res.render('index', {pageTitle:"Home"});
})

app.get('/country', function (req, res) {
  res.render('country', {pageTitle: 'Timezone'});
})

app.post('/country', function (req, res) {
    setData(req.body.selectCity).then(result =>{
      timeData = processTimeData(result);

      PersonData.find({timezone: req.body.selectCity}).then(result =>{
        res.render('country', {pageTitle: "Timezone", data: timeData, city: req.body.selectCity, person: result});
      }).catch(error =>{
        console.log("View Table Error: " + error);
      });
  
    }).then(request => console.log("Time Data Request: " + request))
    .catch(err => {console.log("Time Data Error: " + err)});
})

app.post('/new', function (req, res){
  // Initialize data to be added
  const person = new PersonData({
    name: req.body.personName,
    nationality: req.body.nationality, 
    birthdate: req.body.date,
    timezone: req.body.location
  });
  //Add it to database
  person.save().then(result =>{}).catch(error => {console.log(error)});

  setData(req.body["location"]).then(result =>{
    timeData = processTimeData(result);
  //Refresh table
    PersonData.find({timezone: req.body["location"]}).then(result =>{
      res.render('country', {pageTitle: "Timezone", data: timeData, city: req.body["location"], person: result});
    }).catch(error =>{
      console.log("View Table Error: " + error);
    });
  }).then(request => console.log("Time Data Request: " + request))
  .catch(err => {console.log("Time Data Error: " + err)});
})

app.post('/new_person', function (req, res) {
  res.render('new_person', {pageTitle:"New Person", city: req.body.location});
})

app.post('/view', (req, res) => {
  PersonData.findById(req.body.id).then(result =>{
    res.render('view_person', {pageTitle: "View Person",  person: result});  
  }).catch(error =>{
      console.log("View Error: " + error);
  });
})

app.post('/back', function (req,res){
  setData(req.body["location"]).then(result =>{
    timeData = processTimeData(result);

    PersonData.find({timezone:req.body["location"]}).then(result =>{
      res.render('country', {pageTitle: "Timezone", data: timeData, city: req.body["location"], person: result});
    }).catch(error =>{
      console.log("View Table Error: " + error);
    });

  }).then(request => console.log("Time Data Request: " + request))
  .catch(err => {console.log("Time Data Error: " + err)});
})

function processTimeData(data){ 
  var timeOptions = {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZone: data["timezone"]};
  var dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: data["timezone"]};
  
  var datetime = new Date(data["datetime"]);
  
  var time = new Intl.DateTimeFormat('en-US', timeOptions).format(datetime);
  var date = new Intl.DateTimeFormat('en-US', dateOptions).format(datetime);

  return [date, time];
}

async function setData(timezone){   
  timeData = await fetchCountryTime(timezone);
  return timeData;
}

async function fetchCountryTime(timezone){
  const response = await fetch('http://worldtimeapi.org/api/timezone/' + timezone);
  const data = await response.json();
  return data;
}

app.listen(3000);
