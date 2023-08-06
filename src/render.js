import i18next from 'i18next';
import en from './locales/en';
import ru from './locales/ru';
import {
  headerElement,
  leadElement,
  inputElement,
  inputLabelElement,
  formElement,
  submitButton,
  exampleElement,
  messageElement,
  feedsHeader,
  feedListElement,
  postsHeader,
  postsListElement,
  footerCreatedElement,
  authorLinkElement,
  modalHeader,
  modalTextElement,
  modalReadArticleLink,
  modalCloseButton,
} from './constants';

// TO DO: func to (re)render texts ???
// localization
i18next.init({
  lng: 'ru',
  fallbackLng: 'ru',
  debug: true,
  resources: {
    en,
    ru,
  },
});

// TO DO: move it to some function with lang parameter (en default)
headerElement.textContent = i18next.t('header');
leadElement.textContent = i18next.t('lead');
inputElement.setAttribute('placeholder', i18next.t('inputPlaceholder'));
inputLabelElement.textContent = i18next.t('inputPlaceholder');
submitButton.textContent = i18next.t('submitBtn');
exampleElement.textContent = i18next.t('linkExample');
footerCreatedElement.prepend(i18next.t('footerCreated'));
authorLinkElement.textContent = i18next.t('author');
modalReadArticleLink.textContent = i18next.t('modalReadArticle');
modalCloseButton.textContent = i18next.t('modalCloseBtn');

export const showSuccessMessage = () => {
  inputElement.classList.remove('is-invalid');
  messageElement.classList.remove('text-danger');
  messageElement.classList.add('text-success');
  messageElement.textContent = 'RSS was successfully loaded!';
  formElement.reset();
};

export const showErrorMessage = (error) => {
  inputElement.classList.add('is-invalid');
  messageElement.classList.remove('text-success');
  messageElement.classList.add('text-danger');
  messageElement.textContent = error;
};

export const showSectionHeaders = () => {
  feedsHeader.textContent = i18next.t('feedsHeader');
  postsHeader.textContent = i18next.t('postsHeader');
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
