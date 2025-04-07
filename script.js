const form = document.getElementById('packingForm');
const list = document.getElementById('packingList');

const API_KEY = '37079d6cd8c4c2625ab0b7ed5670af1e'; // Your OpenWeatherMap API Key

const getPackingItems = (weather, temp) => {
    const items = new Set();
  
    if (temp < 5 && weather.includes('snow')) {
      return ['Winter Coat', 'Gloves', 'Scarf', 'Thermal Wear', 'Boots'];
    }
  
    if (temp >= 10 && temp <= 15 && weather.includes('rain')) {
      return ['Jacket', 'Umbrella', 'Waterproof Shoes', 'Sweater', 'Scarf'];
    }
  
    if (temp >= 30 && weather.includes('clear')) {
      return ['Sunglasses', 'Sunscreen', 'Hat', 'Light T-Shirts', 'Water Bottle'];
    }
  
    if (temp >= 20 && temp <= 25 && weather.includes('clear')) {
      return ['T-Shirts', 'Jeans', 'Sneakers', 'Light Sweater', 'Sunglasses'];
    }
  
    if (weather.includes('wind') || weather.includes('cloud')) {
      return ['Windbreaker', 'Full Sleeves Shirt', 'Comfortable Pants', 'Cap', 'Moisturizer'];
    }
  
    // Default logic if none matched
    if (temp < 15) items.add('Jacket');
    if (temp > 30) {
      items.add('Sunglasses');
      items.add('Sunscreen');
    }
    if (weather.includes('rain')) {
      items.add('Umbrella');
      items.add('Waterproof Shoes');
    }
    if (weather.includes('snow')) {
      items.add('Winter Coat');
      items.add('Gloves');
    }
  
    return Array.from(items);
  };
  

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = document.getElementById('city').value;
  list.innerHTML = '<li>Loading...</li>';

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
    const data = await response.json();

    if (data.cod !== "200") {
      list.innerHTML = `<li>Error: ${data.message}</li>`;
      return;
    }

    if (!data.list || !Array.isArray(data.list)) {
      list.innerHTML = '<li>Unexpected weather data format</li>';
      return;
    }

    const itemsSet = new Set();
    data.list.slice(0, 8).forEach(entry => {
      const temp = entry.main.temp;
      const weather = entry.weather[0].main.toLowerCase();
      getPackingItems(weather, temp).forEach(item => itemsSet.add(item));
    });

    const items = Array.from(itemsSet);
    list.innerHTML = '';
    if (items.length === 0) {
      list.innerHTML = '<li>No specific items recommended.</li>';
    } else {
      items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
    }

  } catch (error) {
    console.error(error);
    list.innerHTML = '<li>Failed to fetch weather data.</li>';
  }
});
