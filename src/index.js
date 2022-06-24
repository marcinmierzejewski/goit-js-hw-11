//Import library to show notifications
import { Notify } from 'notiflix';

//import styles
import './sass/index.scss';

//import modules
import { fetchPhotos } from './js/fetchPhotos';
import { renderPhotoListItems } from './js/renderPhotoListItems';

const searchForm = document.querySelector('#search-form');
const searchQuery = document.querySelector('input[name="searchQuery"]');
const galleryWrapper = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let numberOfPicture = 0;
let currentPage = 0;
let totalHits = 0;

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
    const photos = await fetchPhotos(searchQuery.value, currentPage);
    if (photos.hits.length !== 0) {
      if (currentPage === 1) {
        Notify.success(`Hooray! We found ${photos.totalHits} images.`);
      }
      renderPhotoListItems(photos.hits, galleryWrapper, currentPage);
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

//Function to check end of rendered photos
function checkEndOfHits() {
  numberOfPicture = document.querySelectorAll('.photo-card');

  if (totalHits > numberOfPicture.length) {
    renderSearchPhotos();
  } else {
    // console.log('stop!');
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.classList.remove('is-visible');
  }
}

//Events calls
searchForm.addEventListener('submit', searchPhotos);
loadMoreBtn.addEventListener('click', checkEndOfHits);

//// Scroll event to infinite scroll
// window.addEventListener('scroll', () => {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

//   if (scrollTop + clientHeight > scrollHeight -5) {
//     checkEndOfHits();
//     return
//   }
// });
