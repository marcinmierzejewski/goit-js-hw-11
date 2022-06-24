//Import library to display of large images for a full gallery.
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightBox = new SimpleLightbox('.gallery a');

//Function to render on website searched photos
export function renderPhotoListItems(hits, wrapper, page) {
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
  wrapper.insertAdjacentHTML('beforeend', markup);

  lightBox.refresh(); //refresh display of large images (SimpleLightbox)

  //Make smooth page scrolling
  if (page >= 2) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
