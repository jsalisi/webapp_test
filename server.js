// server.js
//
// runs a node.js server using express
//
// Author: Justin Salisi
// ID:     A00937043
// Set:    2A


const express = require('express');
const request = require('request');
const hbs = require('hbs');
const fs = require('fs');

const geocode = require('./gmaps.js');
const weather = require('./getWeather.js');

var static_location = 'Vancouver';

var app = express();
var path = require('path');
var weather_info = {}; //variable to hold the weather info

app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');

app.set('views', './views');
app.set('view engine', 'hbs');

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('message', (text) => {
  return text.toUpperCase();
});

app.use((request, response, next) => {
  // response.render('maintenance.hbs', {});
  var time = new Date().toString();
  var log = `${time}: ${request.method} ${request.url}`;
  fs.appendFile('server.log', log + '\n', (error) => {
    if (error) {
      console.log('Unable to log message');
    }
  });
  next();
});

app.get('/', (request, response) => {
  // response.send('<h1>Hello Express!</h1>');
  response.send({
    name: 'Justin',
    school: [
      'BCIT',
      'SFU',
      'UBC'
    ]
  })
});

app.get('/main', (request, response) => {
  response.render('main.hbs', {
    welcome: 'Home page',
    year:new Date().getFullYear()
  });
});

app.get('/about', (request, response) => {
  response.render('about.hbs', {name: 'Justin Salisi'});
});

app.get('/weather', (request, response) => {
  response.render('weather', {
    title: 'Weather Information',
    location: static_location,
    summary: weather_info.Summary,
    temperature: weather_info.Temperature,
    timezone: weather_info.Timezone,
    welcome: 'Current weather',
    year: new Date().getFullYear(),
    image: 'imgs/Sketch.png'
  });
});

app.get('/info/secret', (request, response) => {
  response.send('<h3 style="text-align:center;">This is the secret page.</h3>');
  console.log('Visiting the secret page');
});

app.get('/404', (request, response) => {
  response.send({
    error: 'Page not found'
  });
});

app.listen(8080, () => {
  console.log('Server is up on the port 8080');
  // here add the logic to return the weather based on the statically provided location and save it inside the weather variable
  geocode.getCoordinates(static_location).then((results) => {
    return weather.getWeather(results.lat, results.lng);
  }).then((results) => {
    weather_info = {
      Summary: `${results.summary}`,
      Temperature: `${results.temp}${decodeURI('%C2%B0')}C`,
      Timezone: `${results.timezone}`
    }
  }).catch((error) => {
    console.log('Error message:', error);
  });
});
