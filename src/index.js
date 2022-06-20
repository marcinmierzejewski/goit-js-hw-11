//Import library to HTTP request
import axios from 'axios';
const axios = require('axios');

//Import library to show notifications
import { Notify } from 'notiflix';

//styles
import './css/styles.css';

//Import library to display of large images for a full gallery.
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const searchQuery = document.querySelector('input[name="searchQuery"]');
const galleryWrapper = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let numberOfPicture = 0;
let currentPage = 0;
let totalHits = 0;
let lightBox = new SimpleLightbox('.gallery a');

//Function to search request photo
const searchPhotos = e => {
  e.preventDefault();
  galleryWrapper.innerHTML = '';
  currentPage = 1;
  loadMoreBtn.classList.remove('is-visible');
  renderSearchPhotos();
};

//Function for reacting to events depending on the data received from the request
const renderSearchPhotos = async () => {
  try {
    const photos = await fetchPhotos();
    if (photos.hits.length !== 0) {
      if (currentPage === 1) {
        Notify.success(`Hooray! We found ${photos.totalHits} images.`);
      }
      renderPhotoListItems(photos.hits);
      // console.log(currentPage);
      if (currentPage >= 1) {
        loadMoreBtn.classList.add('is-visible');
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

//Function for HTTP requests - used axios library,
const fetchPhotos = async () => {
  const API_KEY = '1424879-278d005ef871cdc02a09416fb';
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

//Function to render on website searched photos
function renderPhotoListItems(hits) {
  // console.log(hits);
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

  numberOfPicture = document.querySelectorAll('.photo-card');

  lightBox.refresh(); //refresh display of large images (SimpleLightbox)

  //Make smooth page scrolling
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

//Function to check end of rendered photos
function checkEndOfHits() {
  if (totalHits > numberOfPicture.length) {
    renderSearchPhotos();
  } else {
    // console.log('stop!');
    Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreBtn.classList.remove('is-visible');
  }
}

//Events calls
searchForm.addEventListener('submit', searchPhotos);
loadMoreBtn.addEventListener('click', checkEndOfHits);

// window.addEventListener('scroll', () => {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

//   if (scrollTop + clientHeight > scrollHeight -5) {
//     checkEndOfHits();
//     return
//   }
// });
