'use strict';

const api_key = "c9a8b486f962ef0ad274570383974022";

/** 
    * fetch data from server
    * @param {string} URL api url
    * @param {function} callback callback
*/
export const fetchData = function(URL, callback) {
    fetch(`${URL}&appid=${api_key}`)
    .then(res => res.json())
    .then(data => callback(data));
}

export const url = {
    currentWeather(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`
    },
    forecast(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`
    },
    airPollution(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`
    },
    reverseGeo(lat, lon) {
        return `https://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`
    },
    /** 
    * @param {string} query search query e.g. "London", "New York"
    */
    geo(query) {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
    }
}