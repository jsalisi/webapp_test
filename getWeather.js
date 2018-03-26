// getWeather.js
//
// Contains a getWeather module that will obtain the weather
//
// Author: Justin Salisi
// ID:     A00937043
// Set:    2A

const request = require('request');

var api_key = 'b85729dc2f3b3ca2cf0b62009d5536cc';

var getWeather = (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    request({
      url: `https://api.darksky.net/forecast/${api_key}/${latitude},${longitude}`,
      json: true
    }, (error, response, body) => {
      if (error) {
        reject('Error connecting to Dark Sky API');
      } else if (body.code === 400) {
        reject("BLEEP BLOOP: website not found");
      } else {
        resolve({
          summary: body.currently.summary,
          temp: parseFloat((body.currently.temperature - 32) * (5 / 9)).toFixed(2),
          timezone: body.timezone
        });
      };
    });
  })
}

module.exports = {
  getWeather
};
