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
let totalHits = 0;

let lightBox = new SimpleLightbox('.gallery a');

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
      if (currentPage === 1) {
        Notify.success(`Hooray! We found ${photos.totalHits} images.`);
      }
      renderPhotoListItems(photos.hits);
      console.log(currentPage);
      if (currentPage >= 1) {
        loadMoreBtn.classList.add('is-visible');
      }
      if (Math.ceil(photos.totalHits / 40) === currentPage) {
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.classList.remove('is-visible');
      }
      currentPage += 1;
      totalHits = photos.totalHits;
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      galleryWrapper.innerHTML = '';
    }
  } catch (error) {
    if (searchQuery.value.trim() !== '') {
      console.log(error.message);
      console.log('Something WRONG 0_o !?!');
    } else {
      Notify.failure('Empty search query. Please enter required images');
      galleryWrapper.innerHTML = '';
    }
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
        <div class="photo-card__item">
          <a class="photo-card__link" href="${largeImageURL}">       
            <img 
              class="photo-card__image" 
              src=${webformatURL}          
              alt="${tags}"
              loading="lazy"
              >
            </a>
          </div>
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${downloads}
          </p>
        </div>
        </div>
      `
    )
    .join('');
  galleryWrapper.insertAdjacentHTML('beforeend', markup);

  lightBox.refresh();

  if (currentPage >= 2) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

searchForm.addEventListener('submit', searchPhotos);
loadMoreBtn.addEventListener('click', renderSearchPhotos);

// window.addEventListener('scroll', () => {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

//   if (
//     scrollTop + clientHeight >= scrollHeight - 10 &&
//     Math.ceil(totalHits / 40) >= currentPage
//   ) {
//     renderSearchPhotos();
//     return;
//   }
// });
