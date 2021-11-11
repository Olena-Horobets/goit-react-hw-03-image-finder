import 'regenerator-runtime/runtime.js';

import { Notify, Loading } from 'notiflix';
import './notiflix-styles';

import refs from './refs.js';
import photoFinder from './fetchApi.js';
import galleryItemTpl from '../templates/gallery-item.hbs';

// import modal from './light-box';
import modal from './new-lightbox';
const { success, warning, failure, info } = Notify;

refs.searchForm.addEventListener('submit', onSearch);
refs.searchForm.addEventListener('input', e => {
  refs.resetBtn.disabled = false;
  refs.resetBtn.addEventListener('click', onReset, { once: true });
});

function onSearch(e) {
  e.preventDefault();
  Loading.standard();

  const value = e.currentTarget.elements.query.value.trim();
  if (value === '') {
    onServerResponse(failure, 'Please, enter valid query!');
    return;
  }

  try {
    refs.resetBtn.disabled = false;
    refs.resetBtn.addEventListener('click', onReset, { once: true });
    refs.message.classList.add('is-hidden');
    onNewFetch(value);
    fetchAndRender();
  } catch (err) {
    onServerResponse(failure, 'Please, enter valid query!');
  }
}

function onServerResponse(cb, message) {
  Loading.remove();
  cb(message);
}

function onMarkupRender(list) {
  refs.gallery.insertAdjacentHTML('beforeend', list);
}

async function fetchAndRender() {
  Loading.standard();

  const response = await fetch(photoFinder.getFetchUrl())
    .then(res => res.json())
    .then(data => {
      if (data.totalHits === 0) {
        onServerResponse(warning, `Sorry, we couldn't find anything for you(`);
        onReset();
        return;
      }
      if (data.hits.length < photoFinder.perPage) {
        onServerResponse(
          info,
          `This was all we had for you, try something else, please`,
        );
        refs.loadMoreBtn.classList.add('is-hidden');
        refs.loadMoreBtn.removeEventListener('click', fetchAndRender);
        try {
          onMarkupRender(galleryItemTpl(data.hits));
          smoothScrollingTo(String(data.hits[0].id));
          return;
        } catch (err) {
          onServerResponse(failure, 'Please, enter valid query!');
        }
      }

      if (photoFinder.page === 1) {
        onServerResponse(success, `Hooray! We found ${data.totalHits} images.`);
      }

      onMarkupRender(galleryItemTpl(data.hits));
      smoothScrollingTo(String(data.hits[0].id));
      photoFinder.setNextPage();
      Loading.remove();
      refs.loadMoreBtn.classList.remove('is-hidden');
      refs.loadMoreBtn.addEventListener('click', fetchAndRender);

      modal.srcList = data.hits;
      refs.gallery.addEventListener('click', modal.onModalOpen.bind(modal));
    });
}

function onNewFetch(value = '') {
  photoFinder.searcQuery = value;
  photoFinder.resetPage();
  refs.gallery.innerHTML = '';

  refs.loadMoreBtn.classList.add('is-hidden');
  refs.loadMoreBtn.removeEventListener('click', fetchAndRender);
}

function onReset() {
  refs.searchForm.elements.query.value = '';
  onNewFetch();
  refs.message.classList.remove('is-hidden');
  refs.resetBtn.disabled = true;
}

function smoothScrollingTo(id) {
  const element = document.getElementById(id);
  element.scrollIntoView({
    alignToTop: true,
    behavior: 'smooth',
    block: 'center',
  });
}
