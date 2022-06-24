//Import library to HTTP request
import axios from 'axios';
const axios = require('axios');

//Function for HTTP requests - used axios library,
export const fetchPhotos = async (input, page) => {
  const API_KEY = '1424879-278d005ef871cdc02a09416fb';
  const params = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
    page: page,
  });
  if (input.trim() !== '') {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${input}&${params}`
    );
    const responseData = response.data;
    return responseData;
  }
};
