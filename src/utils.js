import i18next from 'i18next';
import {
  inputElement,
  messageElement,
  feedListElement,
  postsListElement,
  modalHeader,
  modalTextElement,
  modalReadArticleLink,
  feedList,
} from './constants';

// TO DO: func to (re)render texts ???

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

const getTemplate = (selector) => {
  const element = document
    .querySelector(`#${selector}-template`)
    .content
    .querySelector(`.${selector}`)
    .cloneNode(true);

  return element;
};

const generateFeedElement = ({ title, description }) => {
  const feedElement = getTemplate('feed');

  const feedTitle = feedElement.querySelector('.feed__title');
  const feedDescription = feedElement.querySelector('.feed__description');

  feedTitle.textContent = title;
  feedDescription.textContent = description;

  return feedElement;
};

export const addFeedElement = (data) => {
  feedListElement.prepend(generateFeedElement(data));
};

const generatePostElement = ({ link, title, description }) => {
  const postElement = getTemplate('post');

  const postLink = postElement.querySelector('.post__link');
  const postBtn = postElement.querySelector('button');

  postLink.setAttribute('href', link);
  postLink.textContent = title;
  postBtn.textContent = i18next.t('seePostInfoBtn');

  postBtn.addEventListener('click', () => {
    modalHeader.textContent = title;
    modalTextElement.textContent = description;
    modalReadArticleLink.setAttribute('href', link);
  });

  return postElement;
};

export const addPostElement = (data) => {
  postsListElement.prepend(generatePostElement(data));
};

// TO DO: watch feedlist.length and trigger func
// to add text / visibility to feeds + posts section headers

export const isDuplicate = (url) => feedList.some((entry) => entry === url);
