import axios from 'axios';
import { Notify } from 'notiflix';
const axios = require('axios');
import './css/styles.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '1424879-278d005ef871cdc02a09416fb';

const searchForm = document.querySelector('#search-form');
const searchQuery = document.querySelector('input[name="searchQuery"]');
const galleryWrapper = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 0;
let totalPage = 0;

const searchPhotos = e => {
  e.preventDefault();
  galleryWrapper.innerHTML = '';
  currentPage = 1;
  loadMoreBtn.classList.remove('is-visible');
  renderSearchPhotos();
};

const renderSearchPhotos = async () => {
  try {
    const photos = await fetchPhotos();
    if (photos.hits.length !== 0) {
      // console.log(`Found: ${Photos.totalHits}`)
      if (currentPage === 1) {
        Notify.success(`Hooray!! We found ${photos.totalHits} images.`);
      }
      renderPhotoListItems(photos.hits);
      // currentPage += 1;
      console.log(currentPage);
      if (currentPage >= 1) {
        loadMoreBtn.classList.add('is-visible');
      }
      if (Math.ceil(photos.totalHits / 40) === currentPage) {
        Notify.failure('Nothing else...');
        loadMoreBtn.classList.remove('is-visible');
      }
      currentPage += 1;
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      galleryWrapper.innerHTML = '';
    }

    // console.log(Photos)
  } catch (error) {
    if (searchQuery.value !== '') {
      console.log(error.message);
      console.log('Something WRONG 0_o !?!');
    }
    Notify.failure('Empty search query. Please enter required images');
    galleryWrapper.innerHTML = '';
  }
};

const fetchPhotos = async () => {
  const params = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
    page: currentPage,
  });
  if (searchQuery.value !== '') {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery.value}&${params}`
    );
    const responseData = response.data;
    return responseData;
  }
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
      `
      <div class="photo-card">
        <a class="photo-card__item" href="${largeImageURL}">       
          <img 
            class="photo-card__image" 
            src=${webformatURL}          
            alt="${tags}"
            loading="lazy"
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
        </div>
      `
    )
    .join('');
  // galleryWrapper.innerHTML = markup;
  galleryWrapper.insertAdjacentHTML('beforeend', markup);

  new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
}

searchForm.addEventListener('submit', searchPhotos);
loadMoreBtn.addEventListener('click', renderSearchPhotos);
