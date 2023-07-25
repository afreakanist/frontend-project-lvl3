import {
  inputElement,
  messageElement,
  listContainer,
  feedList,
} from './constants';

// helper functions
export const showSuccessMessage = () => {
  inputElement.classList.remove('is-invalid');
  messageElement.classList.remove('text-danger');
  messageElement.classList.add('text-success');
  messageElement.textContent = 'RSS was successfully loaded!';
};

export const showErrorMessage = (error) => {
  inputElement.classList.add('is-invalid');
  messageElement.classList.remove('text-success');
  messageElement.classList.add('text-danger');
  messageElement.textContent = error;
};

// export const hideError = () => {
//   inputElement.classList.remove('is-invalid');
//   messageElement.textContent = '';
// };

export const generateFeedItem = (url) => {
  const feedItem = document.createElement('li');
  feedItem.classList.add('list-group-item');
  const linkElem = document.createElement('a');
  linkElem.classList.add('link-primary');
  linkElem.textContent = url;
  linkElem.setAttribute('href', url);
  feedItem.prepend(linkElem);
  return feedItem;
};

export const addFeedItem = (url) => {
  listContainer.prepend(generateFeedItem(url));
};

export const isDuplicate = (url) => feedList.some((entry) => entry === url);
