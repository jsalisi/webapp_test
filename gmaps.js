// gmaps.js
//
// Contains a getAddress module that will obtain the address
//
// Author: Justin Salisi
// ID:     A00937043
// Set:    2A

const request = require('request');

var getCoordinates = (address) => {
  return new Promise((resolve, reject) => {
    request({
      url: `http://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}`,
      json: true
    }, (error, response, body) => {
      if (error){
        reject('Cannot connect to Google Maps');
      } else if (body.status === 'ZERO_RESULTS') {
        reject('Cannot find requested address');
      } else if (body.status === 'OK') {
        resolve({
          lat: body.results[0].geometry.location.lat,
          lng: body.results[0].geometry.location.lng
        });
      };
    });
  });
};

module.exports = {
  getCoordinates
};
