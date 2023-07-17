const searchButton = document.querySelector('.navbarsearch');
const newsButton = document.querySelector('.navbarnews');
const mailingListButton = document.querySelector('.navbarmailing');
const section1 = document.querySelector('.section1');
const section2 = document.querySelector('.section2');
const section3 = document.querySelector('.section3');

// Add click event listeners to the navbar buttons
searchButton.addEventListener('click', function() {
  section1.scrollIntoView({ behavior: 'smooth' });
});

newsButton.addEventListener('click', function() {
  section2.scrollIntoView({ behavior: 'smooth' });
});

const container = document.querySelector('.openweather');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

search.addEventListener('click', () => {

    const APIKey = '9fab3ae49eedaca828688277b084a185';
    const city = document.querySelector('.search-box input').value;

    let lat;
    let long;

    if (city === '')
        return; 

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {

            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }
            
            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;

                case 'Rain':
                    image.src = 'images/rain.png';
                    break;

                case 'Snow':
                    image.src = 'images/snow.png';
                    break;

                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;
                case 'Haze':
                    image.src = 'images/mist.png';
                    break;
                case 'Thunderstorm':
                    image.src = 'images/thunderstorm.png';
                    break;
                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';

        });



        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {

            const forecastList = json.list.slice(0, 5); // Get the next 8 hours of forecast
            const graph = document.querySelector('.hourlygraph');

            const ulElement = document.querySelector('#hrlyul')
            ulElement.innerHTML = '';

            const ulElement2 = document.querySelector('#dlyul')
            ulElement2.innerHTML = '';
            const displayedDays = [];

            forecastList.forEach(forecast => {
                const dtTxt = forecast.dt_txt;
                const time = dtTxt.split(' ')[1]; // Extract the time from the date-time string
                const hour = parseInt(time.split(':')[0]); // Extract the hour from the time string
                const dt = new Date(forecast.dt * 1000); // Convert the timestamp to milliseconds
                const day = dt.toLocaleDateString('en-US', { weekday: 'long' }).slice(0, 3);
                
                const temperature = Math.round(forecast.main.temp); // Round the temperature to the nearest integer
                let weatherDescription = forecast.weather[0].description;
                weatherDescription = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);

                let formattedTime = '';
          
                if (hour === 0) {
                  formattedTime = '12 AM';
                } else if (hour < 12) {
                  formattedTime = `${hour} AM`;
                } else if (hour === 12) {
                  formattedTime = '12 PM';
                } else {
                  formattedTime = `${hour - 12} PM`;
                }
          
                graph.classList.add('fadeIn');
                graph.style.visibility = 'visible';
                graph.style.height = '590px';

                if (temperature !== 0) {
                    const timetemp = document.createElement('li');
                    const text = document.createTextNode(`${formattedTime} - ${temperature}°C - ${weatherDescription}`);
                    timetemp.appendChild(text);
                    timetemp.style.fontSize = '16px';
                    timetemp.style.color = '#06283D';
                    timetemp.style.fontFamily = "Poppins, sans-serif";
                    timetemp.style.marginBottom = '15px';
                    timetemp.style.marginLeft = '20px';
                    ulElement.appendChild(timetemp);
                }
          
            });
            
            json.list.forEach(forecast => {
              const dt = new Date(forecast.dt * 1000);
              const day = dt.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
              
              if (!displayedDays.includes(day)) {
                const temperature = Math.round(forecast.main.temp);
                let weatherDescription = forecast.weather[0].description;
                weatherDescription = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);

                if (temperature !== 0) {
                  const listItem = document.createElement('li');
                  listItem.textContent = `${day} - ${temperature}°C - ${weatherDescription}`;
                  listItem.style.fontSize = '17px';
                  listItem.style.color = '#06283D';
                  listItem.style.fontFamily = "Poppins, sans-serif";
                  listItem.style.marginBottom = '15px';
                  listItem.style.marginLeft = '20px';
                  ulElement2.appendChild(listItem);
                }
            
                displayedDays.push(day);
              }
            
        });

        });

        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
          const coordinates = json.city.coord;
          const lat = coordinates.lat;
          const lon = coordinates.lon;
      
          const currentTimestamp = Math.floor(Date.now() / 1000);
          const currentDate = new Date();
          const sixDaysAgo = new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000); // Calculate 6 days ago
          const startTimestamp = Math.floor(sixDaysAgo.getTime() / 1000); // Convert to Unix timestamp format
      
          fetch(`https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${startTimestamp}&end=${currentTimestamp}&appid=${APIKey}`)
            .then(response => response.json())
            .then(data => {
              const airQualityList = data.list;
              const airQualityIndexes = airQualityList.map(item => item.main.aqi);
              const airQualityTimestamps = airQualityList.map(item => item.dt);
      
              // Create the labels for the y-axis using the dates
              const labels = airQualityTimestamps.map(timestamp => {
                const date = new Date(timestamp * 1000);
                const month = date.toLocaleString('default', { month: 'short' });
                const day = date.getDate();
                return `${month} ${day}`;
              });
      
              const graph = document.querySelector('.airquality');
              let determinators = [];
      
              const ulElement3 = document.querySelector('#airul');
              ulElement3.innerHTML = '';

              const ulElement4 = document.querySelector('#airalert');
              ulElement4.innerHTML = '';
      
              graph.classList.add('fadeIn');
              graph.style.visibility = 'visible';
              graph.style.height = '590px';

              const listAlert = document.createElement('li');
              listAlert.style.fontSize = '19px';
              listAlert.style.color = '#06283D';
              listAlert.style.fontFamily = 'Poppins, sans-serif';
              listAlert.style.marginBottom = '15px';
              listAlert.style.marginLeft = '20px';
      
              airQualityIndexes.forEach(index => {
                switch (parseInt(index)) {
                  case 1:
                    listAlert.textContent = "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people.";
                    ulElement4.appendChild(listAlert);
                    determinators.push('Good');
                    break;
                  case 2:
                    listAlert.textContent = "Air quality is acceptable; however, pollution in this range may pose a moderate health concern for a very small number of individuals."
                    ulElement4.appendChild(listAlert);
                    determinators.push('Fair');
                    break;
                  case 3:
                    listAlert.textContent = "Air quality is acceptable; however, pollution in this range may pose a moderate health concern for a very small number of individuals."
                    ulElement4.appendChild(listAlert);
                    determinators.push('Moderate');
                    break;
                  case 4:
                    listAlert.textContent = "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects."
                    ulElement4.appendChild(listAlert);
                    determinators.push('Poor');
                    break;
                  case 5:
                    listAlert.textContent = "	Health alert: The risk of health effects is increased for everyone."
                    ulElement4.appendChild(listAlert);
                    determinators.push('Very Poor');
                    break;
                }
              });
      
              const listItem = document.createElement('li');
              listItem.textContent = `Air Quality Index: ${airQualityIndexes[airQualityIndexes.length - 1]} - ${determinators[determinators.length - 1]}`;
              listItem.style.fontSize = '25px';
              listItem.style.color = '#06283D';
              listItem.style.fontFamily = 'Poppins, sans-serif';
              listItem.style.marginBottom = '15px';
              listItem.style.marginLeft = '20px';
              ulElement3.appendChild(listItem);
              
              const existingChart = Chart.getChart('airQualityChart');
              if (existingChart) {
                existingChart.destroy();
              }
 
              // Create the chart
              const airQualityChart = new Chart(document.getElementById('airQualityChart'), {
                type: 'line',
                data: {
                  labels: labels,
                  datasets: [{
                    label: 'Air Quality Index',
                    data: airQualityIndexes,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointRadius: 3,
                    pointHoverRadius: 5,
                  }]
                },
                options: {
                  scales: {
                    x: {
                      ticks: {
                        maxTicksLimit: 6,
                        callback: (value, index) => {
                          if (index === labels.length - 1) {
                            return 'Today';
                          } else {
                            const date = new Date(airQualityTimestamps[index] * 1000);
                            return `${date.getDate()}/${date.getMonth() + 1}`;
                          }
                        }
                      }
                    },
                    y: {
                      beginAtZero: true,
                      max: 5,
                      min: 1,
                      ticks: {
                        stepSize: 1,
                        reverse: true,
                        callback: (value, index, values) => {
                          if (value === 5) {
                            return '5';
                          } else {
                            return value.toString();
                          }
                        }
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: context => `${determinators[context.dataIndex]} (${context.parsed.y})`
                      }
                    }
                  }
                }
              });                          
            });
        });                
});