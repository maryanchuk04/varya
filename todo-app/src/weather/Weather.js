import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './Weather.css'

// доступ к API сервиса погоды
const api = {
  key: 'c7616da4b68205c2f3ae73df2c31d177',
  base: 'http://api.openweathermap.org/data/2.5/'
}

function Weather() {

  // действия при изменении города в поле ввода
  const [city, setCity] = useState('');

  // действия с данными погоды
  const [weather, setWeather] = useState({});
  
  useEffect(() => {
    city && localStorage.setItem('city', JSON.stringify(city));
  }, [city]);
  
  useEffect(() => {
    setCity(JSON.parse(localStorage.getItem('UserData')).location)
    fetch(`${api.base}weather?q=${JSON.parse(localStorage.getItem('UserData')).location}&units=metric&appid=${api.key}`) // отправляем запрос
        .then(res => res.json())  // ответ преобразуем в json
        .then(result => {         // работаем с результатом
          setWeather(result);
          setCity('');
        });
  }, []);

  const setLocationUser = (location) =>{
    console.log(JSON.parse(localStorage.getItem("UserData"))._id)
    axios.post(`http://localhost:4000/api/changeLocation/${JSON.parse(localStorage.getItem("UserData"))._id}`, {
      location : location
    }).then((res)=>{
      console.log(res.data);
      localStorage.setItem("UserData", JSON.stringify(res.data));
    }).catch((err)=>{
      console.log(err);
    })
  }

  // обработчик, который срабатывает когда нажата клавиша Enter
  const search = evt => {
    console.log(evt.target.value);
    
    if (evt.key === 'Enter') {
      fetch(`${api.base}weather?q=${city}&units=metric&appid=${api.key}`) // отправляем запрос
        .then(res => res.json())  // ответ преобразуем в json
        .then(result => {         // работаем с результатом
          setWeather(result);
          setCity('');
          setLocationUser(evt.target.value)
          // localStorage.setItem('weather', JSON.stringify(result));
        });
    }
  }

  // форматирование даты
  const format_date = (d) => {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

  // JSX разметка
  return (
      <main>
        <div className='search-box'>
          <input
            type='text'
            className='search-bar'
            placeholder='Enter city to search the weather'
            onChange={e => setCity(e.target.value)}
            value={city}
            onKeyPress={search}
          />
        </div>
        {(typeof weather?.main != 'undefined') ? (
        <div>
          <div className='location-box'>
            <div className='location'>{weather.name}, {weather.sys.country}</div>
            <div className='date'>{format_date(new Date())}</div>
          </div>
          <div className='weather-box'>
            <div className='temp'>
              {Math.round(weather.main.temp)}°c
            </div>
            <div className='weather'>{weather.weather[0].main}</div>
          </div>
        </div>
        ) : ('')}
      </main>
  );
}

export default Weather;