import axios from 'axios';
import { Notify } from 'notiflix';
const axios = require('axios');
import './css/styles.css';

const API_KEY = '1424879-278d005ef871cdc02a09416fb';

const searchForm = document.querySelector('#search-form');
const searchQuery = document.querySelector('input[name="searchQuery"]');

const galleryWrapper = document.querySelector('.gallery');

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  try {
    const photos = await fetchPhotos();
    if (photos.hits.length !== 0) {
      // console.log(`Found: ${Photos.totalHits}`)
      Notify.success(`Hooray! We found ${photos.totalHits} images.`)
      renderPhotoListItems(photos.hits);
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    // console.log(Photos)
  } catch (error) {
    console.log(error.message);
    console.log('zesrało siię');
  }
});

const fetchPhotos = async () => {
  const response = await axios.get(
    `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery.value}&image_type=photo`
  );
  const responseData = response.data;
  return responseData;
};

function renderPhotoListItems(hits) {
  console.log(hits);
  const markup = hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <a class="photo-card__item" href="${largeImageURL}">       
          <img 
            class="photo-card__image" 
            src=${webformatURL}          
            alt="${tags}"
            >
          </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>: ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>: ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>: ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>: ${downloads}
          </p>
        </div> 
      </div>`
    )
    .join('');
  galleryWrapper.innerHTML = markup;
}
